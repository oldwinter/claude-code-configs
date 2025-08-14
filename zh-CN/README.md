# 🚀 Claude Code 高级配置参考

> 一套用于提升 AI 辅助开发效率的生产级 Claude Code 配置、专业代理与自动化工作流的综合参考

## 📚 目的

本仓库作为一个面向学习的“配置参考”，帮助开发者最大化利用 Claude Code 的生产力。它展示了在实际生产中打磨出的高级配置范式、自定义代理与自动化工作流，这些经验来自于构建生产级 AI 系统、MCP 服务器与向量数据库的广泛实践。

⚠️ 注意：此仓库仅供学习参考，所有凭证均为占位符。请根据你的实际环境与需求进行调整。

## 🎯 你将学到

- 🤖 构建领域专家型 AI 代理
- ⚙️ 配置高级权限与安全控制
- 🔧 为复杂工作流构建自定义命令
- 🚀 使用智能钩子自动化重复性任务
- 💾 通过向量检索实现记忆系统
- 🏗️ 部署具备监控能力的生产级 MCP 服务器
- 🔍 调试与优化 AI 辅助开发流程

## 📁 仓库结构

```text
memory-mcp-server/     # 具备记忆与向量检索的 MCP 服务器
├── .claude/
│   ├── agents/        # 15 个专业 AI 代理
│   ├── commands/      # 7 条自定义工作流命令
│   ├── hooks/         # 2 个自动化脚本
│   └── settings.json  # 中央配置
├── CLAUDE.md          # MCP 开发生态指南
└── README.md          # 安装与使用文档

nextjs-15/             # 完整的 Next.js 15 配置
├── .claude/
│   ├── agents/        # 11 个 Next.js 专用代理
│   ├── commands/      # 6 条工作流命令
│   ├── hooks/         # 校验与格式化
│   └── settings.json
├── CLAUDE.md          # Next.js 15 最佳实践
└── README.md          # 安装指南

# 🚧 即将推出：
vercel-ai-sdk/         # Vercel AI SDK 配置
drizzle/               # Drizzle ORM 配置
zod/                   # Zod 校验配置
shadcn/                # shadcn/ui 组件配置
tailwindcss/           # TailwindCSS 原子化样式
# ... 以及更多！
```

## 🎨 Claude Config CLI（即将推出）

我们正在开发一款强大的 CLI，用于根据你的技术栈生成“最优 Claude Code 配置”。

```bash
# 交互式配置生成器
npx create-claude-config

# 快速初始化（可选项）
npx create-claude-config --lang typescript --framework nextjs --deps "drizzle,zod,tailwind"
```

CLI 将可以：

- 🎯 分析你的项目依赖与结构
- 🤖 为你的技术栈生成专用代理
- ⚙️ 为你的工作流创建自定义命令
- 🔧 设置合适的钩子与权限
- 📚 自动包含相关的 CLAUDE.md 文档

## 🎯 已提供的配置

### Memory MCP Server 配置

面向具备“持久化记忆”与“向量检索”的 MCP 服务器的生产级配置：

- 15 个专业代理（MCP、数据库与记忆系统）
- 7 条自定义命令（覆盖开发工作流）
- 2 个自动化钩子（TypeScript 与日志）
- 优化目标：PostgreSQL 17、pgvector、Drizzle ORM、MCP SDK

查看详情 → `./memory-mcp-server/README.md`

## 🎯 框架专用配置

### Next.js 15 配置

面向 Next.js 15 开发的完整 Claude Code 配置，包括：

#### Next.js 专用代理（共 11 个）

核心开发：

- `nextjs-app-router` — App Router 路由模式与最佳实践
- `nextjs-server-components` — Server/Client 组件划分与优化
- `nextjs-server-actions` — 表单、变更与渐进增强
- `nextjs-data-fetching` — 缓存策略与流式渲染
- `nextjs-performance` — 包体分析与核心 Web 指标

基础设施与质量：

- `nextjs-testing` — Jest、Vitest、Playwright
- `nextjs-deployment` — Docker、Vercel、AWS 部署
- `nextjs-migration` — Pages Router → App Router 迁移
- `nextjs-security` — 认证、CSP、OWASP 合规
- `nextjs-debugging` — React DevTools 与排错
- `nextjs-typescript` — 类型安全与错误处理

#### Next.js 命令（共 6 条）

```bash
/create-page [route]          # 生成带 loading/error 边界的页面
/create-server-action [name]  # 创建类型安全的 Server Actions
/optimize-components          # 分析组件边界
/setup-testing [framework]    # 配置测试框架
/analyze-performance          # 生成性能报告
/migrate-to-app-router        # 从 Pages Router 迁移
```

#### 关键特性

- React 19 与异步请求 API — 兼容 Next.js 15 破坏性变更
- Server Components 优先 — 极小化客户端 JS
- 智能校验 — 提交前自动格式化与规则检查
- 最佳实践守护 — 自动检测常见错误
- 完整文档 — 附带 Next.js 15 模式的 CLAUDE.md

## 🛠️ 特色命令

### Memory MCP Server 命令

```bash
/setup quick       # 快速初始化 MCP 项目
/setup full        # 完整环境与依赖
/setup database    # 初始化 PostgreSQL 与 pgvector
/mcp-debug         # 调试 MCP 协议问题
/memory-ops        # 记忆 CRUD 操作测试
```

### Next.js 15 命令

```bash
/create-page              # 生成页面及边界
/create-server-action     # 创建类型安全的 Server Actions
/optimize-components      # 分析组件边界
/analyze-performance      # 性能分析报告
/migrate-to-app-router    # 从 Pages Router 迁移
```

## ⚡ 共享能力

### 自动化钩子

两套配置均包含智能钩子：

- TypeScript 开发：自动类型检查、格式化与 Lint
- 命令日志：时间戳与审计追踪
- 智能过滤：忽略 node_modules、构建目录
- 测试自动化：变更时触发测试

### 安全最佳实践

所有配置均默认：

- 🔒 白名单式命令权限
- 🚫 保护敏感文件（.env、secrets）
- ✅ 文件类型范围化写权限
- 🛡️ 安全的 git 操作（禁止强推）
- 🔐 使用 Zod 进行输入校验

## 💡 使用场景与示例

### 1. Memory MCP Server 开发

适用于：

- 构建具备持久化记忆的 MCP 服务器
- 使用 pgvector 与 OpenAI embeddings 实现向量检索
- 构建多租户 AI Companion 系统
- 在 Neon 上部署生产级 PostgreSQL
- 使用 Docker 与 Kubernetes 部署

### 2. Next.js 15 应用开发

适用于：

- 以最佳实践初始化 Next.js 15 项目
- 从 Pages Router 迁移至 App Router
- 实施 Server Components 与 Server Actions
- 优化性能与 Core Web Vitals
- 配置完整测试方案
- 部署至 Vercel、Docker 或 AWS

### 3. 生产部署流水线

借助部署代理用于：

- 安全加固的 Docker 容器化
- 具备自动扩缩容的 Kubernetes 编排
- Prometheus/Grafana 监控
- 结构化日志与分布式追踪

### 3. AI Companion 开发

构建多租户 Companion 系统：

- 用户级隔离的记忆空间
- 基于 Token 的认证与授权
- 限流与配额管理
- 向量检索的对话历史

## 🚀 快速开始

### 1. 选择你的配置

```bash
# 面向 MCP 服务器开发
cp -r memory-mcp-server/.claude your-project/
cp memory-mcp-server/CLAUDE.md your-project/

# 面向 Next.js 15 开发
cp -r nextjs-15/.claude your-project/
cp nextjs-15/CLAUDE.md your-project/
```

### 2. 浏览可用配置

```bash
# Memory MCP Server 配置
ls -la memory-mcp-server/.claude/
cat memory-mcp-server/README.md

# Next.js 15 配置
ls -la nextjs-15/.claude/
cat nextjs-15/README.md
```

### 3. 适配你的工作流

1) 选择符合项目类型的基础配置  
2) 按需定制专用代理  
3) 根据安全诉求配置权限  
4) 设置自动化钩子  
5) 若需多框架并行，可合并配置

### 3. 核心配置范式

#### 环境变量（占位示例）

```json
"env": {
  "DATABASE_URL": "postgresql://user:pass@host/dbname?sslmode=require",
  "OPENAI_API_KEY": "sk-your-openai-api-key-here",
  "MCP_SERVER_PORT": "3000"
}
```

#### 钩子配置

```json
"hooks": {
  "PostToolUse": [{
    "matcher": "Edit|MultiEdit|Write",
    "hooks": [{
      "type": "command",
      "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/typescript-dev.sh"
    }]
  }]
}
```

## 📊 配置统计

### Memory MCP Server 配置

- 15 个专业代理 — ~15,000 行领域知识
- 7 条自定义命令 — 覆盖完整开发生命周期
- 2 个自动化钩子 — TypeScript 与日志自动化
- 关注方向：MCP 协议、向量检索、记忆系统、生产部署

### Next.js 15 配置

- 11 个 Next.js 代理 — 框架专用能力
- 6 条工作流命令 — 自动化常见开发任务
- 智能钩子 — 校验与格式化
- 关注方向：App Router、Server Components、性能、测试

## 🔗 技术栈

该配置针对以下技术进行了优化：

### 通用开发

- TypeScript 与 Node.js
- PostgreSQL 17（Neon 无服务器）
- Drizzle ORM v0.44.4（类型安全的数据库访问）
- pgvector v0.8.0（向量相似度检索）
- MCP SDK（协议实现）
- Docker 与 Kubernetes（部署）

### 框架支持

- Next.js 15（App Router）
- React 19（Server Components）
- Tailwind CSS（样式）
- Server Actions（变更）
- Turbopack（更快构建）

## 📈 本配置带来的收益

1. 🚀 开发效率提升 10x — 专家型代理处理复杂任务
2. 🛡️ 更强的安全性 — 多层权限控制
3. 🤖 自动化工作流 — 钩子接管日常操作
4. 📚 内建领域知识 — 代理包含深度经验
5. 🔧 面向生产 — 覆盖部署与监控
6. 🧪 质量保障 — 自动化测试与评审

## 🤝 贡献

欢迎开源贡献！社区的共同参与有助于覆盖更多框架与场景。

### 如何贡献

1) 新增框架配置：
- 新建目录（如：`vercel-ai-sdk/`、`drizzle/`、`zod/`）
- 包含 `.claude/`（agents、commands、hooks、settings）
- 提供详尽的 `CLAUDE.md`（最佳实践）
- 编写 `README.md`（安装与使用）

2) 改进现有配置：
- 增加新的专用代理
- 添加常见任务的工作流命令
- 增强自动化钩子
- 提升安全模式

3) 帮助建设 CLI：
- 参与配置生成逻辑
- 增强框架检测能力
- 提供配置模板
- 优化交互式设置体验

### 优先支持的框架

- Vercel AI SDK — 流式、函数调用、模型提供商管理
- Drizzle ORM — 模型设计、迁移、类型安全
- Zod — 校验范式与 Schema 生成
- shadcn/ui — 组件库模式、主题、可访问性
- TailwindCSS — 原子类、自定义插件、设计系统

### 贡献指南

- 遵循既有结构与范式
- 提供完整文档
- 充分测试配置
- 附带真实用例
- 确保安全最佳实践

## 📝 许可证

本配置参考以“按现状”提供，供学习之用。请依据你的需求进行调整与修改。

## ⚠️ 重要提示

1) 仅作参考 — 本仓库并非可直接克隆用于生产  
2) 占位值 — 所有凭证均为示例  
3) 按需自定义 — 依据你的工作流进行适配  
4) 安全优先 — 始终审视与调整权限

## 🎓 学习路径

1) 从简入手 — 先配置 `settings.json` 中的权限  
2) 增加命令 — 实现一条自定义命令  
3) 集成代理 — 添加与你领域相关的专用代理  
4) 自动化 — 为你的工作流配置钩子  
5) 迭代 — 基于使用反馈持续优化

---

用 ❤️ 为 Claude Code 社区打造

让生产级配置，助力你的 AI 辅助开发

🌟 如果有帮助，请点亮 Star！  
🐛 遇到问题请提 Issue  
🚀 欢迎通过 PR 提交你的框架配置