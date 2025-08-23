# Claude Config Composer (Beta v1.0.0-beta.1)

Generate custom Claude Code configurations for your exact tech stack.

🚧 **Beta Release:** v1.0.0-beta.1 - Production-ready but not yet on NPM. Use local installation method below.
📦 **NPM Package:** Coming in v1.0.0 with `npx` support!

## 🚀 Quick Start (Current - Local Installation)

```bash
# One-time setup
git clone https://github.com/Matt-Dionis/claude-code-configs.git
cd claude-code-configs/claude-config-composer
npm install && npm run build

# Use from your project directory
cd /path/to/your/project
node /path/to/claude-code-configs/claude-config-composer/dist/cli.js nextjs-15 shadcn
```

## 🔜 Coming Soon: Zero Installation with NPX

Once published to npm, you'll be able to run without any installation:

```bash
# In your project directory
npx claude-config-composer nextjs-15 shadcn
# Your .claude/ directory is created instantly
```

## Common Stacks

```bash
# Using the local installation path from above:
COMPOSER=/path/to/claude-code-configs/claude-config-composer/dist/cli.js

# Next.js + shadcn/ui
node $COMPOSER nextjs-15 shadcn

# Full-stack Next.js
node $COMPOSER nextjs-15 shadcn prisma trpc typescript

# React + shadcn/ui
node $COMPOSER react-19 shadcn tanstack typescript
```

## Features

✅ **Zero installation** - Will use npx once published, leaving no trace
✅ **Intelligent merging** - Combines configs without duplication
✅ **Automatic backups** - Preserves existing .claude/ configs
✅ **Git-friendly** - Auto-adds to .gitignore
✅ **Production ready** - Generated configs work immediately
✅ **Conflict detection** - Warns about incompatible configurations
✅ **Dependency resolution** - Automatically suggests required dependencies

## Advanced Usage

### Interactive Mode
```bash
# Opens interactive selection UI
node /path/to/claude-config-composer/dist/cli.js
```

### List Available Configs
```bash
node /path/to/claude-config-composer/dist/cli.js list
```

### Custom Output Directory
```bash
node /path/to/claude-config-composer/dist/cli.js nextjs-15 shadcn --output .claude-custom
```

### Skip Backup/Gitignore
```bash
node /path/to/claude-config-composer/dist/cli.js nextjs-15 shadcn --no-backup --no-gitignore
```

## What Gets Generated

```
.claude/
├── CLAUDE.md           # Combined documentation
├── .claude/
│   ├── settings.json   # Merged settings
│   ├── agents/         # Framework-specific agents
│   ├── commands/       # Custom commands
│   └── hooks/          # Development hooks
├── README.md
└── package.json
```

---

## 🛠️ Development & Contributing

### Local Development Setup

```bash
# Clone the config repository
git clone https://github.com/Matt-Dionis/claude-code-configs.git
cd claude-code-configs/claude-config-composer

# Install dependencies
npm install

# Build the CLI
npm run build

# Test locally
npm run dev nextjs-15 shadcn
```

## Available Configurations

### Frameworks

- **Next.js 15**: App Router, React 19, Server Components
- **React 19**: Latest React with Server Components

### UI/Styling

- **shadcn/ui**: Radix UI + Tailwind components
- **Tailwind CSS**: Utility-first CSS framework

### Tooling

- **TypeScript**: Type-safe development
- **TanStack**: Query, Table, Router, Form

### Database

- **Prisma**: Modern ORM for Node.js

### API

- **tRPC**: End-to-end typesafe APIs

## How It Works

1. **Registry System**: Maintains metadata about each configuration including:
   - Dependencies and conflicts
   - Section priorities
   - Mergeable vs non-mergeable sections

2. **Smart Merging**: The merger:
   - Parses markdown structure
   - Identifies duplicate sections
   - Merges compatible content (e.g., commands)
   - Preserves framework-critical sections
   - Orders sections by priority

3. **Conflict Resolution**:
   - Detects incompatible configs
   - Suggests missing dependencies
   - Allows override with warnings

## Example Output

When you combine Next.js 15 + shadcn, the tool:

1. Preserves critical Next.js 15 breaking changes
2. Includes shadcn component patterns
3. Merges common commands from both
4. Combines security best practices
5. Maintains proper section hierarchy

## Architecture

```text
claude-config-composer/
├── src/
│   ├── cli.ts                      # CLI interface
│   ├── registry/
│   │   └── config-registry.ts      # Config metadata & validation
│   ├── parser/
│   │   └── config-parser.ts        # Parse existing configs
│   ├── merger/
│   │   ├── config-merger.ts        # Merge CLAUDE.md files
│   │   └── component-merger.ts     # Merge agents, commands, hooks
│   └── generator/
│       └── config-generator.ts     # Generate complete .claude structure
├── package.json
├── tsconfig.json
└── README.md
```

## Extending

To add a new configuration:

1. Create a config directory with `CLAUDE.md`
2. Add metadata to `config-registry.ts`:

```typescript
{
  id: 'your-config',
  name: 'Your Config',
  description: 'Description',
  version: '1.0.0',
  category: 'framework',
  dependencies: ['required-config'],
  conflicts: ['incompatible-config'],
  path: path.join(configsPath, 'your-config'),
  priority: 8,
  sections: [
    { title: 'Critical Section', mergeable: false, priority: 15 }
  ]
}
```

## Advanced Features

### Section Priorities

Sections are ordered by priority (higher first):

- Critical/Breaking changes: 15
- Core principles: 10
- Common commands: 5

### Mergeable Sections

These sections combine content from multiple configs:

- Common Commands
- Security Best Practices
- Testing Approaches
- Performance Optimization

### Non-Mergeable Sections

These sections are preserved from the highest priority config:

- Breaking Changes
- Critical Principles
- Framework-specific conventions

## Future Enhancements

- [ ] Web UI for config generation
- [ ] Config validation and linting
- [ ] Custom merge strategies
- [ ] Config inheritance chains
- [ ] Version compatibility matrix
- [ ] Export to different formats
- [ ] Config testing framework
- [ ] Community config registry

## Contributing

1. Fork the repository
2. Add your configuration
3. Update the registry
4. Test merging with existing configs
5. Submit a pull request

## License

MIT
