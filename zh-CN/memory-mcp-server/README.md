# Memory MCP Server Claude Code 配置 🧠

一套面向生产的 Claude Code 配置，专注于构建具备“持久化记忆”“向量检索”与“AI Companion 系统”的 MCP 服务器。

## ✨ 特性

该配置完整支持：

- 记忆系统 — 基于 pgvector 的向量化持久化
- MCP 协议 — 完整服务器实现工具集
- 数据库架构 — PostgreSQL 17 + Neon 无服务器
- AI Companions — 多租户架构模式
- 生产部署 — Docker、Kubernetes、监控

## 📦 安装

1) 将 `.claude` 目录复制到你的 MCP 服务器项目：

```bash
cp -r memory-mcp-server/.claude your-mcp-project/
cp memory-mcp-server/CLAUDE.md your-mcp-project/
```

2) 启动 Claude Code 时会自动加载该配置。

## 🤖 专用代理（共 15 个）

### MCP 协议专家

| Agent | 描述 | 适用场景 |
|------|------|---------|
| `mcp-protocol-expert` | 协议调试与合规 | 连接问题、协议校验 |
| `mcp-sdk-builder` | SDK 实现范式 | 新建 MCP 服务器 |
| `mcp-transport-expert` | 传输层（stdio、HTTP、SSE） | 会话管理、优化 |
| `mcp-types-expert` | TypeScript 与 Zod Schema | 类型安全、JSON-RPC 格式 |

### 数据库与向量检索

| Agent | 描述 | 适用场景 |
|------|------|---------|
| `neon-drizzle-expert` | Neon PostgreSQL + Drizzle ORM | 数据库搭建、迁移 |
| `pgvector-advanced` | pgvector v0.8.0 高级特性 | 二进制向量、HNSW 索引 |
| `vector-search-expert` | 语义检索与向量模型 | OpenAI embeddings、相似度检索 |

### 记忆与架构

| Agent | 描述 | 适用场景 |
|------|------|---------|
| `memory-architecture` | 数据库设计与索引 | 模型与检索优化 |
| `memory-lifecycle` | 整理/衰退/过期 | 记忆衰减、去重 |
| `memory-validator` | 数据完整性与校验 | CRUD、测试 |
| `companion-architecture` | 多租户 AI 系统 | 隔离策略、扩展性 |

### 开发与运维

| Agent | 描述 | 适用场景 |
|------|------|---------|
| `code-reviewer` | 全面代码评审 | 安全与最佳实践 |
| `debugger` | 系统化调试 | 根因分析 |
| `test-runner` | 自动化测试 | MCP 协议验证 |
| `production-deployment` | HTTPS 部署 | 容器化与监控 |

## 🛠️ 命令（共 7 条）

### 开发生命周期

```bash
/setup quick       # 快速初始化
/setup full        # 完整依赖与环境
/setup database    # 仅数据库与向量模块
```

### 测试与审查

```bash
/test             # 生成全面测试套件
/review           # 以安全为重点的代码审查
/explain          # 上下文感知的代码讲解
```

### MCP 运维

```bash
/mcp-debug        # 调试 MCP 协议问题
/memory-ops       # 记忆 CRUD 演示
/perf-monitor     # 性能剖析
```

## 🪝 自动化钩子

### TypeScript 开发钩子

文件修改时自动触发：

- ✅ `tsc --noEmit` 类型检查
- ✨ Prettier 格式化
- 🔧 ESLint 修复
- 🧪 针对测试文件运行测试
- 📁 智能过滤（跳过 node_modules 与构建目录）

### 命令日志

- 📝 记录全部 Bash 命令
- ⏱️ 附带时间戳
- 📊 维护审计追踪

## ⚙️ 配置详情

### 安全权限

```json
{
  "permissions": {
    "allow": [
      "Read", "Grep", "Glob", "LS",
      "Bash(npm test:*)",
      "Write(**/*.ts)",
      "Bash(npx drizzle-kit:*)",
      "Bash(psql:*)"
    ],
    "deny": [
      "Read(./.env)",
      "Bash(rm -rf:*)",
      "Bash(git push:*)"
    ]
  }
}
```

### 环境变量

已为 MCP 开发预置：

- `DATABASE_URL` — PostgreSQL 连接串
- `OPENAI_API_KEY` — Embeddings 用途
- `MCP_SERVER_PORT` — 服务器配置
- `NEON_DATABASE_URL` — 无服务器 PostgreSQL

## 🚀 使用示例

### 构建记忆型 MCP 服务器

```bash
# 1. 初始化项目
> /setup full

# 2. 设计记忆数据模型
> 使用 memory-architecture 代理进行数据库建模

# 3. 实现 MCP 服务器
> 使用 mcp-sdk-builder 代理生成与完善代码

# 4. 集成向量检索
> 使用 vector-search-expert 实现语义检索

# 5. 部署生产
> 使用 production-deployment 代理容器化与监控
```

### 调试 MCP 连接

```bash
# 调试协议问题
> /mcp-debug

# 调试器将：
# - 校验协议合规
# - 检查消息格式
# - 测试传输层
# - 定位连接问题
```

## 📊 技术栈

优化目标：

- TypeScript 与 Node.js
- PostgreSQL 17（Neon 无服务器）
- Drizzle ORM v0.44.4（类型安全）
- pgvector v0.8.0（向量相似度）
- @modelcontextprotocol/sdk（MCP）
- OpenAI embeddings（语义检索）
- Docker 与 Kubernetes（部署）

## 🎯 关键能力

### 记忆持久化

- pgvector 向量化存储
- 语义检索
- 记忆整合与生命周期
- 多租户隔离

### MCP 协议支持

- 完整 SDK 实现范式
- 传输层优化
- 协议合规校验
- 会话管理

### 生产就绪

- Docker 容器化
- Kubernetes 编排
- Prometheus/Grafana 监控
- 结构化日志

## 🔧 自定义

编辑 `.claude/settings.json`：

- 权限策略（匹配你的安全需求）
- 环境变量（你的服务）
- 钩子（工作流）
- 代理选择（领域相关）

## 📝 最佳实践

该配置强调：

1) 类型安全 — 全量 TypeScript + Zod 校验  
2) 安全优先 — 输入校验与认证  
3) 性能优化 — 高效向量检索与缓存  
4) 测试完善 — 覆盖率全面  
5) 可观测性 — 结构化日志与指标  
6) 文档清晰 — 注释与 API 文档  

## 🐛 故障诊断

### 常见问题

钩子未执行：

```bash
chmod +x .claude/hooks/*.sh
```

数据库连接失败：

```bash
# 检查环境变量
echo $DATABASE_URL
# 测试连接
psql $DATABASE_URL
```

MCP 协议错误：

```bash
/mcp-debug
```

## 📚 资源

- MCP SDK 文档（`https://modelcontextprotocol.io`）
- pgvector 文档（`https://github.com/pgvector/pgvector`）
- Neon 文档（`https://neon.tech/docs`）
- Drizzle ORM 文档（`https://orm.drizzle.team`）

---

为生产级 MCP 服务器开发而生 🚀

用专用 AI 能力与自动化，全面提升你的开发体验。