# Token-Gated MCP Server Claude Code 配置 🔐

一套用于基于 FastMCP 与 Radius MCP SDK 构建“代币门控（Token-Gated）”MCP 服务器的完整 Claude Code 配置。只需 3 行代码，即可为你的 AI 工具启用去中心化、基于代币的访问控制。

## ✨ 特性

该配置提供完整支持：

- 代币门控访问 — 基于 ERC-1155 的授权
- FastMCP 集成 — 快速构建 MCP 服务器  
- Radius MCP SDK — 加密证明校验
- Web3 认证 — EIP-712 签名验证
- 分层定价 — 针对不同工具设定不同代币需求
- 完整开发环境 — 代理、命令、钩子与设置一应俱全

## 📦 安装

1) 将完整配置复制到你的 Token-Gated MCP 服务器项目：

```bash
# 复制整个配置
cp -r token-gated-mcp-server/.claude your-mcp-project/
cp token-gated-mcp-server/CLAUDE.md your-mcp-project/

# 赋予钩子脚本可执行权限
chmod +x your-mcp-project/.claude/hooks/*.sh
```

2) 启动 Claude Code 时会自动加载该配置。

## 📁 配置结构

```text
.claude/
├── settings.json           # 主配置（权限、环境变量、钩子）
├── agents/                 # 专用 AI 子代理
│   ├── radius-sdk-expert.md      # Radius MCP SDK 实现专家
│   ├── fastmcp-builder.md        # FastMCP 服务器开发专家
│   ├── auth-flow-debugger.md     # 认证流程调试专家
│   ├── token-economics-designer.md # 代币分层与经济模型专家
│   └── web3-security-auditor.md  # Web3 安全审计专家
├── commands/               # 自定义斜杠命令
│   ├── setup-token-gate.md       # 一键搭建代币门控服务器
│   ├── test-auth.md              # 端到端测试认证流程
│   ├── create-tool.md            # 新建代币门控工具
│   ├── debug-proof.md            # 调试加密证明校验
│   ├── deploy-local.md           # 本地部署（ngrok）
│   └── validate-config.md        # 配置校验
└── hooks/                  # 自动化脚本
    ├── validate-token-config.sh  # 代币配置校验
    ├── format-typescript.sh      # TypeScript 自动格式化
    ├── log-mcp-commands.sh       # MCP 命令日志记录
    └── production-safety.sh      # 生产安全检查
```

## 🤖 专用代理（5 个专家代理）

| Agent | 描述 | 适用场景 |
|------|------|---------|
| `radius-sdk-expert` | Radius MCP SDK 实现专家 | 代币保护、证明校验、多代币模式 |
| `fastmcp-builder` | FastMCP 服务器开发专家 | 服务器搭建、工具/资源/提示词、传输配置 |
| `auth-flow-debugger` | 认证流程调试专家 | EVMAUTH 错误、证明校验、代币验证 |
| `token-economics-designer` | 代币经济与分层设计专家 | 定价模型、接入层级、代币分配 |
| `web3-security-auditor` | Web3 安全专家 | 合约安全、密码学操作、安全审计 |

## 🛠️ 命令（6 条强力命令）

| 命令 | 描述 | 用法 |
|------|------|-----|
| `/setup-token-gate` | 一键搭建代币门控 MCP 服务器 | `/setup-token-gate [basic\|full\|testnet]` |
| `/test-auth` | 端到端测试认证流程 | `/test-auth [tool-name] [token-id]` |
| `/create-tool` | 新建代币门控工具 | `/create-tool <tool-name> <token-id> [tier]` |
| `/debug-proof` | 调试证明校验问题 | `/debug-proof` |
| `/deploy-local` | 通过 ngrok 本地部署 | `/deploy-local` |
| `/validate-config` | 校验代币门控配置 | `/validate-config` |

## 🪝 自动化钩子

### Pre-Tool Use（前置）
- 代币配置校验（`validate-token-config.sh`）
  - 合约地址格式检查（0x + 40 位 hex）
  - 检测是否硬编码私钥
  - 生产环境中的调试模式告警
  - 校验 `__evmauth` 参数是否包含

- MCP 命令日志（`log-mcp-commands.sh`）
  - 记录 FastMCP 与 ngrok 相关命令
  - 追踪代币配置检查
  - 阻止危险命令（rm -rf、开发环境 npm publish）
  - 提供开发提示

### Post-Tool Use（后置）
- TypeScript 格式化（`format-typescript.sh`）
  - Prettier 自动格式化
  - 校验代币保护是否正确实现
  - 检查错误处理是否规范
  - 统计服务器文件中受保护的工具数

### Stop（停止）
- 生产安全检查（`production-safety.sh`）
  - 针对环境的安全告警
  - 调试模式检测
  - 未提交变更提醒
  - 代币配置摘要

## ⚙️ 配置详情

### 安全权限

该配置预置了全面的安全权限用于安全开发：

允许操作：
- 标准文件操作（Read、Write、Edit、MultiEdit）
- 检索与导航工具（Grep、Glob、LS）
- 开发命令（npm run dev/build/test/lint/typecheck）
- 包管理（npm install、npm ci）
- FastMCP 与 ngrok（用于测试）
- Git 版本控制操作
- Docker 容器相关命令
- RPC 端点测试

禁止操作：
- 读取/写入私钥或敏感凭据
- 破坏性命令（rm -rf）
- 开发阶段发布 npm
- 修改生产环境文件
- 不安全的 curl（POST、PUT、DELETE）

### 环境变量

已为代币门控开发给出示例：

- `EVMAUTH_CONTRACT_ADDRESS` — ERC-1155 合约（0x5448Dc20ad9e0cDb5Dd0db25e814545d1aa08D96）
- `EVMAUTH_CHAIN_ID` — Radius 测试网（1223953）
- `EVMAUTH_RPC_URL` — 区块链 RPC（https://rpc.testnet.radiustech.xyz）
- `EVMAUTH_TOKEN_ID` — 需要的代币 ID（默认 1）
- `NODE_ENV` — 环境（development/production）
- `DEBUG` — 调试开关（默认 false，生产严禁开启）
- `RADIUS_TESTNET` — 测试网标识（true）

### 状态栏

自定义状态栏实时展示代币门控信息：

```text

🔐 Token-Gated MCP | Chain: 1223953 | Token: 1 | dev

```

## 🚀 使用示例

### 搭建代币门控 MCP 服务器

```bash
# 1. 初始化项目
> /setup full

# 2. 新建受代币保护的工具
> /create-tool premium_analytics 101

# 3. 测试认证流程
> /test-auth

# 4. 使用 ngrok 部署本地
> /deploy-local

# 5. 在 claude.ai 连接
# 使用 ngrok URL + /mcp
```

### 三行集成

```typescript
// 就是这么简单！
const radius = new RadiusMcpSdk({ 
  contractAddress: '0x5448Dc20ad9e0cDb5Dd0db25e814545d1aa08D96' 
});

server.addTool({
  name: 'premium_tool',
  handler: radius.protect(101, yourHandler)
});
```

### 认证流程调试

```bash
# 调试认证问题
> /debug-proof

# 调试器会：
# - 校验证明结构
# - 检查签名验证
# - 测试代币持有
# - 识别配置问题
```

## 📊 技术栈

优化目标：

- TypeScript 与 Node.js
- FastMCP v3.0+（MCP 服务器）
- Radius MCP SDK（代币门控）
- Viem（以太坊交互）
- Zod（Schema 校验）
- EIP-712（密码学签名）
- Radius Network 测试网（Chain ID: 1223953）

## 🎯 关键能力

### 基于代币的访问控制

- ERC-1155 多代币支持
- ANY 逻辑（用户需至少持有其一）
- 分层访问模式
- 动态代币需求

### 认证流程

- 加密证明校验
- EIP-712 签名验证
- 30 秒证明有效期
- 防重放攻击

### 开发体验

- 三行集成
- 面向 AI 的友好错误信息
- 自动重试建议
- 内建缓存

### 生产就绪

- Docker 容器化
- 健康检查端点
- 结构化日志
- 性能监控

## 🔧 自定义

编辑 `.claude/settings.json` 以自定义：

- 代币合约地址
- 各网络 Chain ID
- 代币分层/门槛配置
- 缓存参数
- 调试选项

## 📝 最佳实践

本配置强调：

1) 安全优先 — 加密校验，失败即拒绝（fail-closed）
2) 简洁集成 — 极简代码实现最大保护
3) AI 友好错误 — 引导认证流程
4) 性能优化 — 缓存、批量校验、优化
5) 测试完善 — 完整认证流程验证
6) 生产就绪 — 监控、健康检查、日志

## 🐛 故障诊断

### 常见问题

EVMAUTH_PROOF_MISSING：

```bash
# 检查 Radius MCP Server 连接
# 确认 __evmauth 参数已包含
# 校验证明未过期（30 秒）
```

代币验证失败：

```bash
# 检查合约地址
echo $EVMAUTH_CONTRACT_ADDRESS

# 校验链 ID
echo $EVMAUTH_CHAIN_ID

# 测试 RPC 连接
curl $EVMAUTH_RPC_URL
```

调试认证流程：

```bash
/debug-proof
```

## 🌟 示例项目

### 简单的代币门控时间戳

```typescript
server.addTool({
  name: 'get_timestamp',
  description: `Get current time (requires token ${TOKEN_ID})`,
  parameters: z.object({
    format: z.enum(['unix', 'iso', 'readable'])
  }),
  handler: radius.protect(TOKEN_ID, async (args) => {
    return new Date().toISOString();
  })
});
```

### 多层级分析

```typescript
const TOKENS = {
  BASIC: 101,
  PREMIUM: 102,
  ENTERPRISE: [201, 202, 203]
};

// 不同层级对应不同工具
server.addTool({
  name: 'basic_analytics',
  handler: radius.protect(TOKENS.BASIC, basicHandler)
});

server.addTool({
  name: 'enterprise_analytics',
  handler: radius.protect(TOKENS.ENTERPRISE, enterpriseHandler)
});
```

## 🔗 与 Radius MCP Server 的集成

该 SDK 与“Radius MCP Server”协作以实现完整代币门控：

1) Radius MCP Server（每个 AI 客户端一个）
   - OAuth 认证
   - 通过 Privy 管理钱包
   - 生成认证证明
   - 代币购买

2) 你的 MCP Server（使用本配置）
   - 校验认证证明
   - 代币持有检查
   - 工具执行
   - 错误引导

## 📚 资源

- FastMCP 文档（`https://github.com/punkpeye/fastmcp`）
- Radius MCP SDK（`https://github.com/radiustechsystems/mcp-sdk`）
- Model Context Protocol（`https://modelcontextprotocol.io`）
- Radius Network 测试网（`https://docs.radiustech.xyz`）
- EIP-712 规范（`https://eips.ethereum.org/EIPS/eip-712`）

## 🎉 快速上手示例

```bash
# 1. 安装依赖
npm install fastmcp @radiustechsystems/mcp-sdk zod

# 2. 创建 server.ts
cat > server.ts << 'EOF'
import { FastMCP } from 'fastmcp';
import { RadiusMcpSdk } from '@radiustechsystems/mcp-sdk';
import { z } from 'zod';

const radius = new RadiusMcpSdk({
  contractAddress: '0x5448Dc20ad9e0cDb5Dd0db25e814545d1aa08D96'
});

const server = new FastMCP({ name: 'My Token Server' });

server.addTool({
  name: 'premium_tool',
  description: 'Premium feature (token required)',
  parameters: z.object({ input: z.string() }),
  handler: radius.protect(1, async (args) => {
    return `Premium result for: ${args.input}`;
  })
});

server.start({ 
  transportType: 'httpStream',
  httpStream: { port: 3000 }
});
EOF

# 3. 启动服务器
npx tsx server.ts

# 4. 使用 ngrok 测试
ngrok http 3000

# 5. 在 claude.ai 中使用 ngrok URL + /mcp
```

## 🎯 本配置的独特之处

### 完整开发环境

- 5 个专家代理 — 覆盖代币门控的方方面面
- 6 条强力命令 — 从搭建到部署全流程自动化
- 4 个智能钩子 — 自动校验、格式化与安全检查
- 全面设置 — 针对 Radius 测试网的安全最佳实践

### 关键能力

1) 三行集成 — 以最少代码对任何工具进行代币保护
2) AI 友好错误 — 自动引导 Claude 完成认证流程
3) 生产就绪 — 内建安全检查与部署工具
4) 安全优先 — 自动检测私钥与不安全模式
5) 开发体验 — 自动格式化、日志与调试工具

### 非常适合

- 使用 FastMCP 构建代币门控的 MCP 服务器
- 实现 ERC-1155 代币访问控制
- 构建分层访问的 AI 工具集合
- 部署到 Radius Network（测试网/主网）
- 学习 Web3 认证模式

---

为去中心化 AI 工具市场而生 🚀

用极简代码，获得最强的代币门控安全。

配置版本：1.0.0 | 兼容：FastMCP 3.0+、Radius MCP SDK 1.0+