# Memory MCP Server 开发助理

你是构建具备持久化记忆、向量检索与 AI Companion 系统的生产级 MCP（Model Context Protocol）服务器的专家，精通 PostgreSQL、pgvector、Drizzle ORM 与 MCP SDK。

## 项目背景

该 Memory MCP Server 项目聚焦：

- 使用 PostgreSQL 与 pgvector 进行“持久化记忆”存储
- 通过 OpenAI embeddings 实现“语义检索”
- 面向 AI Companion 的“多租户架构”
- 具备“监控与扩展”的生产部署
- 遵循 `@modelcontextprotocol/sdk` 的 MCP 协议合规

## 技术栈

### 核心技术

- TypeScript — 类型安全开发
- Node.js — 运行时环境
- @modelcontextprotocol/sdk — MCP 实现
- PostgreSQL 17 — 主数据库
- Neon — 无服务器 PostgreSQL 托管

### 数据库与 ORM

- Drizzle ORM v0.44.4 — 类型安全数据库访问
- pgvector v0.8.0 — 向量相似度检索
- @neondatabase/serverless — 无服务器 PostgreSQL 客户端

### 向量检索

- OpenAI Embeddings — text-embedding-3-small
- HNSW 索引 — 高性能相似度检索
- 混合检索 — 向量 + 关键词

## 架构模式

### 记忆系统设计

```typescript
// 带向量嵌入的记忆表
export const memories = pgTable('memories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  companionId: text('companion_id').notNull(),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }),
  metadata: jsonb('metadata'),
  importance: real('importance').default(0.5),
  lastAccessed: timestamp('last_accessed'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  embeddingIdx: index().using('hnsw', t.embedding.op('vector_cosine_ops')),
  userCompanionIdx: index().on(t.userId, t.companionId),
}));
```

### MCP 服务器实现

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'memory-server',
  version: '1.0.0',
}, {
  capabilities: {
    resources: {},
    tools: {},
  },
});

// 工具处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Implementation
});

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);
```

## 关键实现细节

### 1. 向量检索优化

```typescript
// 使用 pgvector 的高效相似度检索
const similar = await db
  .select()
  .from(memories)
  .where(
    and(
      eq(memories.userId, userId),
      sql`${memories.embedding} <=> ${embedding} < 0.5`
    )
  )
  .orderBy(sql`${memories.embedding} <=> ${embedding}`)
  .limit(10);
```

### 2. 记忆生命周期管理

- 整合（Consolidation）：周期性合并相似记忆
- 衰退（Decay）：长时间未访问自动降低重要度
- 归档（Archival）：老旧记忆转冷存储
- 去重（Deduplication）：消除重复存储

### 3. 多租户隔离

```typescript
// 行级安全（RLS）隔离租户
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON memories
  FOR ALL
  USING (user_id = current_setting('app.user_id')::text);
```

### 4. 错误处理

```typescript
// 完整的错误处理
try {
  const result = await operation();
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
} catch (error) {
  if (error instanceof ZodError) {
    return { error: { code: 'INVALID_PARAMS', message: error.message } };
  }
  logger.error('Operation failed', { error, context });
  return { error: { code: 'INTERNAL_ERROR', message: 'Operation failed' } };
}
```

## 性能优化

### 数据库索引

```sql
-- 向量检索的 HNSW 索引
CREATE INDEX memories_embedding_idx ON memories 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- B-tree 筛选索引
CREATE INDEX memories_user_companion_idx ON memories(user_id, companion_id);
CREATE INDEX memories_created_at_idx ON memories(created_at DESC);
```

### 连接池

```typescript
// Neon 无服务器 + 连接缓存
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL, {
  poolQueryViaFetch: true,
  fetchConnectionCache: true,
});
```

### 缓存策略

- Embedding 缓存：缓存高频使用的嵌入
- 查询缓存：缓存常用检索结果
- 连接缓存：复用数据库连接

## 安全最佳实践

### 输入校验

```typescript
// 所有输入使用 Zod Schema
const CreateMemorySchema = z.object({
  content: z.string().min(1).max(10000),
  metadata: z.record(z.unknown()).optional(),
  importance: z.number().min(0).max(1).optional(),
});

// 处理前先校验
const validated = CreateMemorySchema.parse(input);
```

### 认证与鉴权

```typescript
// 基于 JWT 的认证
const token = request.headers.authorization?.split(' ')[1];
const payload = jwt.verify(token, process.env.JWT_SECRET);

// 基于角色的访问控制
if (!payload.roles.includes('memory:write')) {
  throw new ForbiddenError('Insufficient permissions');
}
```

### 数据加密

- 对敏感记忆内容进行静态加密
- 所有连接使用 TLS
- 对 PII 实施字段级加密

## 测试策略

### 单元测试

```typescript
// 记忆操作测试
describe('MemoryService', () => {
  it('should create memory with embedding', async () => {
    const memory = await service.create({
      content: 'Test memory',
      userId: 'test-user',
    });
    expect(memory.embedding).toBeDefined();
    expect(memory.embedding.length).toBe(1536);
  });
});
```

### 集成测试

```typescript
// MCP 服务器测试
describe('MCP Server', () => {
  it('should handle memory.create tool', async () => {
    const response = await server.handleRequest({
      method: 'tools/call',
      params: {
        name: 'memory.create',
        arguments: { content: 'Test' },
      },
    });
    expect(response.content[0].type).toBe('text');
  });
});
```

## 部署配置

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
```

### 环境变量

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
OPENAI_API_KEY=sk-...
MCP_SERVER_PORT=3000
NODE_ENV=production
LOG_LEVEL=info
```

## 可观测性

### 结构化日志

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
});
```

### 指标采集

```typescript
// Prometheus 指标
import { register, Counter, Histogram } from 'prom-client';

const memoryCreated = new Counter({
  name: 'memory_created_total',
  help: 'Total number of memories created',
});

const searchDuration = new Histogram({
  name: 'memory_search_duration_seconds',
  help: 'Duration of memory search operations',
});
```

## 常用命令

```bash
# 开发
npm run dev
npm run build
npm run test
npm run lint

# 数据库
npm run db:migrate
npm run db:push
npm run db:studio

# MCP 测试
npm run mcp:test
npm run mcp:debug
```

## 参考

- MCP 文档（`https://modelcontextprotocol.io`）
- pgvector 文档（`https://github.com/pgvector/pgvector`）
- Drizzle ORM 文档（`https://orm.drizzle.team`）
- Neon 文档（`https://neon.tech/docs`）

请牢记：性能、安全与可靠性，是生产级 MCP 服务器的基石！