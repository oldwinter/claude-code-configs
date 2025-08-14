# Next.js 15 Claude Code 配置 🚀

一套面向生产的 Claude Code 配置，帮助你以最佳实践、自动化工作流与智能辅助构建 Next.js 15 应用。

## ✨ 特性

本配置提供：

- 11 个 Next.js 开发方向的专用 AI 代理
- 6 条常用工作流命令
- 智能钩子（校验与格式化）
- 针对 Next.js 的优化设置
- 包含 Next.js 15 最佳实践的“记忆”文档

## 📦 安装

1) 将 `.claude` 目录复制到 Next.js 项目根目录：

```bash
cp -r nextjs-15/.claude your-nextjs-project/
cp nextjs-15/CLAUDE.md your-nextjs-project/
```

2) 在项目中启动 Claude Code 时会自动加载本配置。

## 🤖 专用代理

### 核心开发代理

| Agent | 描述 | 适用场景 |
|------|------|---------|
| `nextjs-app-router` | App Router 路由专家 | 页面/布局/动态与并行路由 |
| `nextjs-server-components` | Server/Client 组件专家 | 组件边界优化、修复水合问题 |
| `nextjs-server-actions` | Server Actions 专家 | 表单、变更、渐进增强 |
| `nextjs-data-fetching` | 数据获取与缓存 | Fetch 策略、缓存、重验证、流式渲染 |
| `nextjs-performance` | 性能优化专家 | 包体分析、Core Web Vitals、代码拆分 |

### 基建与测试代理

| Agent | 描述 | 适用场景 |
|------|------|---------|
| `nextjs-testing` | 测试专家 | Jest、Vitest、Playwright、Cypress |
| `nextjs-deployment` | 部署与 DevOps | Docker、Vercel、AWS、CI/CD |
| `nextjs-migration` | 迁移专家 | Pages → App Router、版本升级 |
| `nextjs-security` | 安全专家 | 认证、CSP、输入校验、OWASP |
| `nextjs-debugging` | 调试专家 | React DevTools、错误定位与修复 |
| `nextjs-typescript` | TypeScript 专家 | 类型配置、修错、类型安全范式 |

## 🛠️ 命令

### 快速参考

| 命令 | 描述 | 示例 |
|-----|------|-----|
| `/create-page` | 创建新页面与结构 | `/create-page products/[id]` |
| `/create-server-action` | 生成类型安全的 Server Action | `/create-server-action createUser user` |
| `/optimize-components` | 分析与优化组件边界 | `/optimize-components` |
| `/setup-testing` | 配置测试框架 | `/setup-testing playwright` |
| `/analyze-performance` | 生成性能报告 | `/analyze-performance` |
| `/migrate-to-app-router` | 从 Pages Router 迁移 | `/migrate-to-app-router /about` |

## 🪝 智能钩子

### 提交前校验

- 校验 Next.js 15 模式（异步 params/searchParams）
- 检查缺失的 'use client'
- 校验环境变量使用
- 运行 TypeScript 与 ESLint 检查

### 自动格式化

- 使用 Prettier 格式化 TS/JS
- 校验 Server Component 模式
- 建议缺失的 loading/error 边界

### 智能提示

- 更佳实践的提示
- 常见错误的警告
- 性能建议

## ⚙️ 配置

### 设置概览

包含：

- 权限：适配 Next.js 开发的安全默认
- 环境：优化的工作流参数
- 钩子：自动化校验与格式化
- 状态栏：显示 Next.js 版本与构建状态

### 自定义

编辑 `.claude/settings.json`：

```json
{
  "permissions": {
    "allow": ["Write(app/**/*)", "Bash(npm run dev*)"],
    "deny": ["Read(.env.production)"]
  },
  "env": {
    "NEXT_PUBLIC_API_URL": "http://localhost:3000"
  }
}
```

## 🚀 使用示例

### 创建新功能

```bash
# 1. 创建页面与所需文件
> /create-page dashboard/analytics

# 2. 将自动生成：
# - app/dashboard/analytics/page.tsx
# - app/dashboard/analytics/loading.tsx
# - app/dashboard/analytics/error.tsx
```

### 优化性能

```bash
# 分析当前性能
> /analyze-performance

# 系统将：
# - 执行包体分析
# - 检查 Core Web Vitals
# - 识别优化机会
# - 生成报告
```

### 配置认证

```bash
# 使用安全代理
> 使用 nextjs-security 代理以 NextAuth.js 搭建认证

# 将自动：
# - 配置 NextAuth.js
# - 设置 Provider
# - 创建 middleware
# - 实施会话管理
```

## 📚 强制最佳实践

- 默认 Server Components，最小化客户端 JS
- 正确处理异步 params/searchParams
- 完整的 TypeScript 类型安全
- 安全优先：输入校验、认证、CSP
- 性能优化：代码拆分、缓存、流式
- 完整测试覆盖
- 渐进增强：表单可无 JS 正常工作

## 🔄 升级

```bash
# 拉取最新配置
git pull origin main

# 复制更新文件
cp -r nextjs-15/.claude your-project/
```

## 🤝 贡献

欢迎改进本配置：

1) Fork 仓库  
2) 创建特性分支  
3) 提交改动  
4) 发起 Pull Request  

### 可贡献方向

- 更多专用代理
- 更多自动化命令
- 更强的钩子
- 测试改进
- 文档完善

## 📖 文档

- 代理：详细提示与专长
- 命令：描述与示例
- 钩子：校验逻辑与自动化
- 设置：权限模式与配置

## 🐛 故障排查

常见问题：

钩子未执行：

```bash
chmod +x .claude/hooks/*.sh
```

代理无响应：

```bash
ls .claude/agents/
```

命令找不到：

```bash
# 重新加载 Claude Code 配置
# 退出并重启 Claude Code
```

## 📝 许可证

MIT License - 自由使用于你的项目！

## 🙏 致谢

- 官方 Next.js 15 文档
- React 19 最佳实践
- 社区反馈与模式
- 生产经验

---

献给 Next.js 社区的 ❤️

借助 Claude Code 的智能辅助，构建更优秀的 Next.js 应用。