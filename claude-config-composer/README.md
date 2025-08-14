# Claude Config Composer

Dynamic Claude Code configuration generator that intelligently combines multiple configs based on your development stack.

## Problem

Currently, Claude Code configs are isolated. If you want to build a Next.js 15 app with shadcn/ui components, you need to manually combine configurations. This tool solves that by intelligently merging configs while:

- Avoiding duplicate sections
- Preserving critical framework-specific information
- Handling dependencies and conflicts
- Maintaining proper section priorities

## Features

- **Complete .claude Generation**: Creates full configuration with agents, commands, hooks, and settings
- **Interactive CLI**: Select your stack through an intuitive interface
- **Intelligent Merging**: Smart deduplication and section prioritization
- **Preset Stacks**: Quick selection for common combinations
- **Conflict Detection**: Warns about incompatible configurations
- **Dependency Resolution**: Automatically suggests required dependencies
- **Category-based Selection**: Choose configs by type (framework, UI, database, etc.)

## Installation

```bash
# Clone the config repository
git clone https://github.com/Matt-Dionis/claude-code-configs.git
cd claude-code-configs/claude-config-composer

# Install dependencies
npm install

# Build the CLI
npm run build

# Link globally (optional)
npm link
```

## Usage

### Interactive Mode

```bash
# Run interactive selection
npm run dev

# Or if linked globally
claude-compose
```

### Generate Preset

```bash
# Generate a Next.js + shadcn configuration
npm run dev generate nextjs-shadcn

# Generate a full-stack configuration
npm run dev generate nextjs-fullstack
```

### List Available Configs

```bash
npm run dev list
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
