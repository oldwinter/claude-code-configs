import { z } from 'zod';
import path from 'path';
import fs from 'fs/promises';

export const ConfigMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  category: z.enum(['framework', 'ui', 'tooling', 'testing', 'database', 'api']),
  dependencies: z.array(z.string()).optional(),
  conflicts: z.array(z.string()).optional(),
  priority: z.number().default(0),
  path: z.string(),
  sections: z.array(z.object({
    title: z.string(),
    mergeable: z.boolean().default(true),
    priority: z.number().default(0)
  })).optional()
});

export type ConfigMetadata = z.infer<typeof ConfigMetadataSchema>;

export class ConfigRegistry {
  private configs: Map<string, ConfigMetadata> = new Map();
  private configsPath: string;

  constructor(configsPath?: string) {
    // Default to parent directory of claude-config-composer
    this.configsPath = configsPath || path.resolve(process.cwd(), '..');
  }

  async initialize() {
    const registry: ConfigMetadata[] = [
      {
        id: 'nextjs-15',
        name: 'Next.js 15',
        description: 'Next.js 15 with App Router, React 19, and Server Components',
        version: '15.0.0',
        category: 'framework',
        path: path.join(this.configsPath, 'nextjs-15'),
        priority: 10,
        sections: [
          { title: 'Project Context', mergeable: true, priority: 10 },
          { title: 'Critical Next.js 15 Changes', mergeable: false, priority: 15 },
          { title: 'Core Principles', mergeable: true, priority: 8 },
          { title: 'Common Commands', mergeable: true, priority: 5 },
          { title: 'Security Best Practices', mergeable: true, priority: 7 },
          { title: 'Performance Optimization', mergeable: true, priority: 6 }
        ]
      },
      {
        id: 'shadcn',
        name: 'shadcn/ui',
        description: 'Beautiful, accessible components with Radix UI and Tailwind CSS',
        version: '0.8.0',
        category: 'ui',
        dependencies: ['tailwindcss'],
        path: path.join(this.configsPath, 'shadcn'),
        priority: 8,
        sections: [
          { title: 'Project Context', mergeable: true, priority: 10 },
          { title: 'Technology Stack', mergeable: true, priority: 9 },
          { title: 'Critical shadcn/ui Principles', mergeable: false, priority: 15 },
          { title: 'Component Development Patterns', mergeable: true, priority: 8 },
          { title: 'Theming System', mergeable: false, priority: 10 },
          { title: 'Common Commands', mergeable: true, priority: 5 }
        ]
      },
      {
        id: 'tailwindcss',
        name: 'Tailwind CSS',
        description: 'Utility-first CSS framework',
        version: '3.4.0',
        category: 'ui',
        path: path.join(this.configsPath, 'tailwind'),
        priority: 5,
        sections: [
          { title: 'Tailwind Configuration', mergeable: false, priority: 10 },
          { title: 'Utility Classes', mergeable: true, priority: 7 }
        ]
      },
      {
        id: 'react-19',
        name: 'React 19',
        description: 'React 19 with Server Components and new features',
        version: '19.0.0',
        category: 'framework',
        path: path.join(this.configsPath, 'react-19'),
        priority: 9
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        description: 'TypeScript configuration and best practices',
        version: '5.3.0',
        category: 'tooling',
        path: path.join(this.configsPath, 'typescript'),
        priority: 7
      },
      {
        id: 'tanstack',
        name: 'TanStack',
        description: 'TanStack Query, Table, Router, and Form',
        version: '5.0.0',
        category: 'tooling',
        path: path.join(this.configsPath, 'tanstack'),
        priority: 6
      },
      {
        id: 'prisma',
        name: 'Prisma',
        description: 'Prisma ORM for database management',
        version: '5.0.0',
        category: 'database',
        path: path.join(this.configsPath, 'prisma'),
        priority: 7
      },
      {
        id: 'trpc',
        name: 'tRPC',
        description: 'Type-safe API layer with tRPC',
        version: '11.0.0',
        category: 'api',
        dependencies: ['typescript'],
        path: path.join(this.configsPath, 'trpc'),
        priority: 6
      }
    ];

    for (const config of registry) {
      this.configs.set(config.id, config);
    }
  }

  getAll(): ConfigMetadata[] {
    return Array.from(this.configs.values());
  }

  getByCategory(category: string): ConfigMetadata[] {
    return this.getAll().filter(c => c.category === category);
  }

  get(id: string): ConfigMetadata | undefined {
    return this.configs.get(id);
  }

  validateCompatibility(selectedIds: string[]): {
    valid: boolean;
    conflicts: string[];
    missingDependencies: string[];
  } {
    const conflicts: string[] = [];
    const missingDependencies: string[] = [];

    for (const id of selectedIds) {
      const config = this.get(id);
      if (!config) continue;

      if (config.conflicts) {
        const foundConflicts = config.conflicts.filter(c => selectedIds.includes(c));
        conflicts.push(...foundConflicts.map(c => `${id} conflicts with ${c}`));
      }

      if (config.dependencies) {
        const missing = config.dependencies.filter(d => !selectedIds.includes(d));
        missingDependencies.push(...missing.map(d => `${id} requires ${d}`));
      }
    }

    return {
      valid: conflicts.length === 0 && missingDependencies.length === 0,
      conflicts,
      missingDependencies
    };
  }

  async getConfigContent(id: string): Promise<string | null> {
    const config = this.get(id);
    if (!config) return null;

    const claudeMdPath = path.join(config.path, 'CLAUDE.md');
    try {
      return await fs.readFile(claudeMdPath, 'utf-8');
    } catch {
      return null;
    }
  }
}