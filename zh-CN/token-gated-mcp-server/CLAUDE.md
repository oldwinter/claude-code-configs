# Token-Gated MCP Server 开发助理

你是构建基于 FastMCP 与 Radius MCP SDK 的“代币门控（Token-Gated）”MCP 服务器的专家，精通 Web3 认证、ERC-1155 代币，以及为 AI 工具打造安全、去中心化的访问控制体系。

## 项目背景

该 Token-Gated MCP Server 项目聚焦：

- 使用 ERC-1155（Radius Network）实现基于代币的访问控制
- 使用 FastMCP 快速构建 MCP 服务器
- 借助 Radius MCP SDK 完成加密证明校验
- 通过 EIP-712 进行安全认证
- 面向“去中心化 AI 工具市场”的代币经济模型

## 技术栈

### 核心技术

- TypeScript — 类型安全开发
- Node.js — 运行时环境
- FastMCP — MCP 服务器框架
- Radius MCP SDK — 代币门控授权
- Radius 测试网 — 区块链网络（Chain ID: 1223953）

### Web3 组件

- Viem — 以太坊交互库
- EIP-712 — 结构化数据签名
- ERC-1155 — 多代币标准
- Radius MCP Server — 认证与钱包管理

### FastMCP 能力

- 简单的工具/资源/提示词定义
- HTTP 流式传输
- 会话管理
- 错误处理
- 进度通知
- TypeScript 支持

## 架构模式

### 代币门控实现

```typescript
import { FastMCP } from 'fastmcp';
import { RadiusMcpSdk } from '@radiustechsystems/mcp-sdk';

// 初始化 SDK（默认使用 Radius 测试网）
const radius = new RadiusMcpSdk({
  contractAddress: '0x5448Dc20ad9e0cDb5Dd0db25e814545d1aa08D96'
});

const server = new FastMCP({
  name: 'Token-Gated Tools',
  version: '1.0.0'
});

// 3 行代码为任意工具增加代币保护
server.addTool({
  name: 'premium_tool',
  description: 'Premium feature (requires token)',
  parameters: z.object({ query: z.string() }),
  handler: radius.protect(101, async (args) => {
    // 仅当用户拥有 101 号代币时才会执行
    return processPremiumQuery(args.query);
  })
});
```

### 认证流程

```typescript
// 1. 客户端未认证直接调用受保护工具
await tool({ query: "data" });
// → EVMAUTH_PROOF_MISSING 错误

// 2. 客户端通过 Radius MCP Server 进行认证
const { proof } = await authenticate_and_purchase({ 
  tokenIds: [101],
  targetTool: 'premium_tool'
});

// 3. 客户端携带证明重试
await tool({ 
  query: "data",
  __evmauth: proof  // 特殊命名空间
});
// → 成功！
```

## 关键实现细节

### 1. 多代币保护

```typescript
// ANY 逻辑（满足其一即可）
handler: radius.protect([101, 102, 103], async (args) => {
  // 用户拥有 101 或 102 或 103
  return processRequest(args);
})

// 分层访问模式
const TOKENS = {
  BASIC: 101,
  PREMIUM: 102,
  ENTERPRISE: [201, 202, 203]
};
```

### 2. 错误响应结构

```typescript
// SDK 输出对 AI 友好的错误结构
{
  error: {
    code: "EVMAUTH_PROOF_MISSING",
    message: "Authentication required",
    details: {
      requiredTokens: [101],
      contractAddress: "0x...",
      chainId: 1223953
    },
    claude_action: {
      description: "Authenticate and purchase tokens",
      steps: [...],
      tool: {
        server: "radius-mcp-server",
        name: "authenticate_and_purchase",
        arguments: { tokenIds: [101] }
      }
    }
  }
}
```

### 3. `__evmauth` 命名空间

```typescript
// 重要：__evmauth 始终被接受
// 即使未在工具 schema 中声明！
const result = await any_protected_tool({
  normalParam: "value",
  __evmauth: proof
});

// SDK 会在进入 handler 前剥离认证参数
handler: radius.protect(101, async (args) => {
  // args 中仅保留正常参数，不包含 __evmauth
  console.log(args); // { normalParam: "value" }
});
```

### 4. 安全模型

- EIP-712 签名验证 — 密码学级别校验
- Chain ID 校验 — 防止跨链重放
- Nonce 校验 — 30 秒过期
- 合约校验 — 确保使用正确的代币合约
- Fail-Closed — 任一校验失败即拒绝

## 性能优化

### 缓存策略

```typescript
const radius = new RadiusMcpSdk({
  contractAddress: '0x...',
  cache: {
    ttl: 300,
    maxSize: 1000,
    disabled: false
  }
});
```

### 批处理代币检查

```typescript
// SDK 自动批量化多代币检查
handler: radius.protect([101, 102, 103, 104, 105], handler)
// 内部使用 balanceOfBatch 提升效率
```

### HTTP 流

```typescript
server.start({
  transportType: 'httpStream',
  httpStream: {
    port: 3000,
    endpoint: '/mcp',
    stateless: true
  }
});
```

## 测试策略

### 本地开发

```bash
# 启动服务器
npm run dev

# 借助 ngrok 供 claude.ai 测试
ngrok http 3000

# 在 claude.ai 中使用：
https://abc123.ngrok.io/mcp
```

### 集成测试

```typescript
describe('Token-Gated Tool', () => {
  it('should require authentication', async () => {
    const response = await protectedTool({ query: 'test' });
    expect(response.error.code).toBe('EVMAUTH_PROOF_MISSING');
  });

  it('should accept valid proof', async () => {
    const response = await protectedTool({
      query: 'test',
      __evmauth: validProof
    });
    expect(response.content).toBeDefined();
  });
});
```

## 部署配置

### 环境变量

```env
# Radius Network
EVMAUTH_CONTRACT_ADDRESS=0x5448Dc20ad9e0cDb5Dd0db25e814545d1aa08D96
EVMAUTH_CHAIN_ID=1223953
EVMAUTH_RPC_URL=https://rpc.testnet.radiustech.xyz

# Token
EVMAUTH_TOKEN_ID=1

# Server
PORT=3000
NODE_ENV=production
DEBUG=false
```

### Docker 部署

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### 生产清单

- [ ] 关闭调试模式（debug: false）
- [ ] 使用环境变量管理配置
- [ ] 配置错误监控
- [ ] 启用限流
- [ ] 健康检查就绪
- [ ] 日志规范化

## 常见模式

### 分层访问控制

```typescript
// 不同代币对应不同功能
server.addTool({
  name: 'basic_analytics',
  handler: radius.protect(TOKENS.BASIC, basicHandler)
});

server.addTool({
  name: 'premium_analytics',
  handler: radius.protect(TOKENS.PREMIUM, premiumHandler)
});

server.addTool({
  name: 'enterprise_analytics',
  handler: radius.protect(TOKENS.ENTERPRISE, enterpriseHandler)
});
```

### 动态代币需求

```typescript
server.addTool({
  name: 'flexible_tool',
  handler: async (request) => {
    const tier = determineTier(request);
    const tokenId = getTokenForTier(tier);
    
    return radius.protect(tokenId, async (args) => {
      return processWithTier(args, tier);
    })(request);
  }
});
```

### 资源保护

```typescript
server.addResource({
  name: 'premium_dataset',
  uri: 'dataset://premium/2024',
  handler: radius.protect(102, async () => {
    return {
      contents: [{
        uri: 'dataset://premium/2024',
        text: loadPremiumData()
      }]
    };
  })
});
```

## 调试技巧

### 启用调试日志

```typescript
const radius = new RadiusMcpSdk({
  contractAddress: '0x...',
  debug: true
});
```

### 常见问题

1) EVMAUTH_PROOF_MISSING  
- 确保客户端包含 `__evmauth` 参数  
- 检查与 Radius MCP Server 的连接  

2) PROOF_EXPIRED  
- 证明 30 秒过期，需要刷新  

3) PAYMENT_REQUIRED  
- 用户缺少所需代币，需调用 `authenticate_and_purchase`  

4) CHAIN_MISMATCH  
- 校验 chainId 配置  
- 确保证明与网络一致  

## 安全最佳实践

1) 切勿在代码或日志中暴露私钥  
2) 使用 Zod 等工具校验所有输入  
3) 将敏感配置放入环境变量  
4) 生产环境务必关闭调试模式  
5) 为公共端点实现限流  
6) 监控异常代币校验模式  
7) 及时更新 SDK 获取安全修复  

## Claude Code 配置能力

### 可用代理

- `radius-sdk-expert` — 代币保护与 SDK 实现
- `fastmcp-builder` — FastMCP 服务器开发
- `auth-flow-debugger` — 认证流程调试
- `token-economics-designer` — 代币分层设计
- `web3-security-auditor` — 安全审计

### 可用命令

- `/setup-token-gate [basic|full|testnet]` — 一键搭建
- `/test-auth [tool] [token-id]` — 测试认证流程
- `/create-tool <name> <token-id> [tier]` — 新建代币门控工具
- `/debug-proof` — 调试证明校验
- `/deploy-local` — 使用 ngrok 部署
- `/validate-config` — 校验配置

### 自动化钩子

- 前置钩子 — 校验代币配置、记录命令
- 后置钩子 — 格式化 TypeScript、校验保护
- 停止钩子 — 生产安全检查

## 常用命令

```bash
# 开发
yarn dev || npm run dev
npm run build
npm run test
npm run lint

# 与 Claude 配合
npx fastmcp dev server.ts
npx fastmcp inspect server.ts

# 生产
npm start
npm run docker:build
npm run docker:run
```

## 资源

- FastMCP 文档（`https://github.com/punkpeye/fastmcp`）
- Radius MCP SDK（`https://github.com/radiustechsystems/mcp-sdk`）
- Model Context Protocol（`https://modelcontextprotocol.io`）
- Radius Network 文档（`https://docs.radiustech.xyz`）
- EIP-712 规范（`https://eips.ethereum.org/EIPS/eip-712`）

牢记：简单集成、强力保护、去中心化访问！