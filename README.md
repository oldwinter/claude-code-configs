# 🚀 Claude Code Advanced Configuration Reference

> **A comprehensive collection of production-grade Claude Code configurations, specialized agents, and automation workflows for optimizing AI-assisted development**

## 📚 Purpose

This repository serves as an **educational reference** for developers looking to maximize their productivity with Claude Code. It demonstrates advanced configuration patterns, custom agents, and automation workflows that have been refined through extensive real-world usage in building production AI systems, MCP servers, and vector databases.

**⚠️ Note:** This is a reference repository intended for learning. All credentials shown are placeholders. Adapt these patterns to your specific needs and environment.

## 🎯 What You'll Learn

- **🤖 Create specialized AI agents** for domain-specific expertise
- **⚙️ Configure advanced permissions** and security controls  
- **🔧 Build custom commands** for complex workflows
- **🚀 Automate repetitive tasks** with intelligent hooks
- **💾 Implement memory systems** with vector search
- **🏗️ Deploy production MCP servers** with monitoring
- **🔍 Debug and optimize** AI-assisted development

## 📁 Repository Structure

```text
.claude/
├── agents/          # 15 specialized AI agents (~15,000 lines)
├── commands/        # 7 custom workflow commands
├── hooks/          # 2 automation scripts
└── settings.json   # Central configuration hub
```

## 🤖 Specialized Agents

This configuration includes **15 expert agents**, each with deep domain knowledge and specific capabilities:

### Core Development

- **`code-reviewer`** - Comprehensive code review with security focus
- **`debugger`** - Systematic debugging and root cause analysis
- **`test-runner`** - Automated testing with MCP protocol validation

### MCP Protocol Experts

- **`mcp-protocol-expert`** - Protocol debugging and compliance validation
- **`mcp-sdk-builder`** - SDK implementation patterns
- **`mcp-transport-expert`** - Transport layers (stdio, HTTP, SSE, WebSocket)
- **`mcp-types-expert`** - TypeScript type system and Zod schemas

### Database & Vector Search

- **`neon-drizzle-expert`** - Neon PostgreSQL with Drizzle ORM
- **`pgvector-advanced`** - Advanced pgvector v0.8.0 features
- **`vector-search-expert`** - Semantic search and embeddings

### Memory & Architecture

- **`memory-architecture`** - Database design and indexing strategies
- **`memory-lifecycle`** - Consolidation and expiration management
- **`memory-validator`** - Data integrity and validation
- **`companion-architecture`** - Multi-tenant AI companion systems
- **`production-deployment`** - HTTPS deployment with Kubernetes

## 🔧 Custom Commands

Streamline complex workflows with these custom commands:

### Development Workflow

```bash
/setup quick       # Quick project setup
/setup full        # Complete environment with all dependencies
/setup database    # Database-focused initialization
```

### Testing & Review

```bash
/test             # Generate comprehensive test suites
/review           # Security-focused code review
/explain          # Context-aware code explanation
```

### Operations & Debugging

```bash
/mcp-debug        # Debug MCP protocol issues
/memory-ops       # Test memory CRUD operations
/perf-monitor     # Performance profiling
```

## ⚡ Automation Hooks

### TypeScript Development Hook

Automatically triggered on file modifications:

- ✅ Type checking with `tsc --noEmit`
- ✨ Prettier formatting
- 🔧 ESLint fixing
- 🧪 Test execution for test files
- 📁 Smart filtering (skips node_modules, build dirs)

### Bash Command Logging

- 📝 Logs all executed commands for audit trails
- ⏱️ Timestamps for debugging

## 🛡️ Security Configuration

### Permission Model

```json
{
  "permissions": {
    "allow": [
      "Read", "Grep", "Glob", "LS",
      "Bash(npm test:*)",
      "Write(**/*.ts)"
    ],
    "deny": [
      "Read(./.env)",
      "Bash(rm -rf:*)",
      "Bash(git push:*)"
    ]
  }
}
```

### Key Security Features

- 🔒 Whitelist approach for commands
- 🚫 Prevents access to sensitive files
- ✅ Scoped write permissions
- 🛡️ Git operation safety

## 💡 Use Cases & Examples

### 1. Building a Memory MCP Server

Use the memory-focused agents to:

- Design vector-indexed database schemas
- Implement semantic search with pgvector
- Handle memory lifecycle and consolidation
- Deploy with production monitoring

### 2. Production Deployment Pipeline

Leverage deployment agents for:

- Docker containerization with security hardening
- Kubernetes orchestration with auto-scaling
- Prometheus/Grafana monitoring setup
- Structured logging and distributed tracing

### 3. AI Companion Development

Build multi-tenant companion systems with:

- Isolated memory spaces per user
- Token-based authentication
- Rate limiting and quota management
- Conversation history with vector search

## 🚀 Getting Started

### 1. Study the Configuration Structure

```bash
# Explore the agents
ls -la .claude/agents/

# Review custom commands
cat .claude/commands/setup.md

# Examine hooks
cat .claude/hooks/typescript-dev.sh
```

### 2. Adapt to Your Workflow

1. **Choose relevant agents** for your domain
2. **Customize commands** for your tech stack
3. **Configure permissions** based on your security needs
4. **Set up hooks** for your development workflow

### 3. Key Configuration Patterns

#### Environment Variables (Placeholder Examples)

```json
"env": {
  "DATABASE_URL": "postgresql://user:pass@host/dbname?sslmode=require",
  "OPENAI_API_KEY": "sk-your-openai-api-key-here",
  "MCP_SERVER_PORT": "3000"
}
```

#### Hook Configuration

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

## 📊 Configuration Statistics

- **15 Specialized Agents** - ~15,000 lines of domain expertise
- **7 Custom Commands** - Covering full development lifecycle
- **2 Automation Hooks** - TypeScript and logging automation
- **109 Lines of Settings** - Fine-tuned configuration
- **Version-Locked Stack** - Production-tested dependencies

## 🔗 Technology Stack

This configuration is optimized for:

- **TypeScript** & Node.js development
- **PostgreSQL 17** with **Neon** serverless
- **Drizzle ORM v0.44.4** for type-safe database access
- **pgvector v0.8.0** for vector similarity search
- **MCP SDK** for protocol implementation
- **Docker** & **Kubernetes** for deployment

## 📈 Benefits of This Configuration

1. **🚀 10x Faster Development** - Specialized agents handle complex tasks
2. **🛡️ Enhanced Security** - Multi-layered permission controls
3. **🤖 Automated Workflows** - Hooks handle routine tasks
4. **📚 Built-in Expertise** - Deep domain knowledge in agents
5. **🔧 Production-Ready** - Deployment and monitoring included
6. **🧪 Quality Assurance** - Automated testing and review

## 🤝 Contributing

While this is primarily a reference repository, suggestions for improvements are welcome. Consider:

- Additional agent specializations
- New workflow commands
- Enhanced automation hooks
- Security improvements

## 📝 License

This configuration reference is provided as-is for educational purposes. Adapt and modify for your specific needs.

## ⚠️ Important Notes

1. **Reference Only** - This repository is for learning, not direct cloning
2. **Placeholder Values** - All credentials are examples only
3. **Customize for Your Needs** - Adapt patterns to your specific workflow
4. **Security First** - Always review and adjust permissions for your environment

## 🎓 Learning Path

1. **Start Simple** - Begin with `settings.json` permissions
2. **Add Commands** - Implement one custom command
3. **Integrate Agents** - Add relevant specialized agents
4. **Automate** - Set up hooks for your workflow
5. **Iterate** - Refine based on your experience

---

**Built with ❤️ for the Claude Code community**

*Transform your AI-assisted development with production-grade configurations*
