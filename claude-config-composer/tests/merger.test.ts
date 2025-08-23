import { describe, expect, it } from 'vitest';
import { ComponentMerger } from '../src/merger/component-merger';
import { ConfigMerger } from '../src/merger/config-merger';

describe('ConfigMerger', () => {
  describe('merge', () => {
    it('should merge multiple configurations without duplicates', () => {
      const merger = new ConfigMerger();
      const configs = [
        {
          content: '# Config 1\n## Section 1\nContent 1\n## Common Section\nContent from config 1',
          metadata: {
            id: 'config1',
            name: 'Config 1',
            version: '1.0.0',
            description: 'Test config 1',
            category: 'test',
            path: '/test/config1',
            priority: 1,
          },
        },
        {
          content: '# Config 2\n## Section 2\nContent 2\n## Common Section\nContent from config 2',
          metadata: {
            id: 'config2',
            name: 'Config 2',
            version: '1.0.0',
            description: 'Test config 2',
            category: 'test',
            path: '/test/config2',
            priority: 2,
          },
        },
      ];

      const merged = merger.merge(configs);

      // Check that merged content is a string
      expect(typeof merged).toBe('string');
      expect(merged).toContain('Composed Claude Code Configuration');
      expect(merged).toContain('Config 1');
      expect(merged).toContain('Config 2');
      expect(merged).toContain('Section 1');
      expect(merged).toContain('Section 2');
    });

    it('should handle empty configurations gracefully', () => {
      const merger = new ConfigMerger();
      const configs = [];
      const merged = merger.merge(configs);

      expect(typeof merged).toBe('string');
      expect(merged).toContain('Composed Claude Code Configuration');
    });

    it('should preserve priority when merging sections', () => {
      const merger = new ConfigMerger();
      const configs = [
        {
          content: '# Low Priority\n## Content\nLow priority content',
          metadata: {
            id: 'low-priority',
            name: 'Low Priority',
            version: '1.0.0',
            description: 'Low priority config',
            category: 'test',
            path: '/test/low',
            priority: 1,
          },
        },
        {
          content: '# High Priority\n## Content\nHigh priority content',
          metadata: {
            id: 'high-priority',
            name: 'High Priority',
            version: '1.0.0',
            description: 'High priority config',
            category: 'test',
            path: '/test/high',
            priority: 10,
          },
        },
      ];

      const merged = merger.merge(configs);

      // Higher priority content should appear in merged result
      expect(merged).toContain('High priority content');
    });

    it('should merge complex nested sections', () => {
      const merger = new ConfigMerger();
      const configs = [
        {
          content:
            '# Config 1\n## Settings\nRead enabled: true\nPaths: /a\n## Development\nUse TypeScript',
          metadata: {
            id: 'config1',
            name: 'Config 1',
            version: '1.0.0',
            description: 'Config 1',
            category: 'test',
            path: '/test/config1',
            priority: 1,
          },
        },
        {
          content:
            '# Config 2\n## Settings\nRead paths: /b\nExecute enabled: true\n## Development\nUse ESLint',
          metadata: {
            id: 'config2',
            name: 'Config 2',
            version: '1.0.0',
            description: 'Config 2',
            category: 'test',
            path: '/test/config2',
            priority: 1,
          },
        },
      ];

      const merged = merger.merge(configs);

      // Check that settings from both configs are present
      expect(merged).toContain('Settings');
      expect(merged).toContain('Development');
      expect(merged).toContain('Config 1');
      expect(merged).toContain('Config 2');
    });

    it('should handle special characters in content', () => {
      const merger = new ConfigMerger();
      const configs = [
        {
          content: '# Title\n\n```javascript\nconst x = "hello";\n```\n\n## Special chars: ${}[]',
          metadata: {
            id: 'special',
            name: 'Special',
            version: '1.0.0',
            description: 'Special chars test',
            category: 'test',
            path: '/test/special',
            priority: 1,
          },
        },
      ];

      const merged = merger.merge(configs);

      expect(merged).toContain('```javascript');
      expect(merged).toContain('const x = "hello"');
      expect(merged).toContain('Special chars: ${}[]');
    });
  });
});

describe('ComponentMerger', () => {
  describe('mergeAgents', () => {
    it('should merge agents without duplicates', () => {
      const merger = new ComponentMerger();
      const agentGroups = [
        [
          { name: 'agent1', description: 'Agent 1', tools: ['tool1'] },
          { name: 'agent2', description: 'Agent 2', tools: ['tool2'] },
        ],
        [
          { name: 'agent2', description: 'Agent 2 updated', tools: ['tool2', 'tool3'] },
          { name: 'agent3', description: 'Agent 3', tools: ['tool3'] },
        ],
      ];

      const merged = merger.mergeAgents(agentGroups);

      expect(merged).toHaveLength(3);
      expect(merged.map(a => a.name)).toContain('agent1');
      expect(merged.map(a => a.name)).toContain('agent2');
      expect(merged.map(a => a.name)).toContain('agent3');

      // Check that agent2 has the updated description and tools
      const agent2 = merged.find(a => a.name === 'agent2');
      expect(agent2?.description).toBe('Agent 2 updated');
      expect(agent2?.tools).toContain('tool3');
    });
  });

  describe('mergeCommands', () => {
    it('should merge commands without duplicates', () => {
      const merger = new ComponentMerger();
      const commandGroups = [
        [
          { name: 'cmd1', description: 'Command 1', arguments: [] },
          { name: 'cmd2', description: 'Command 2', arguments: [] },
        ],
        [
          { name: 'cmd2', description: 'Command 2 updated', arguments: ['arg1'] },
          { name: 'cmd3', description: 'Command 3', arguments: [] },
        ],
      ];

      const merged = merger.mergeCommands(commandGroups);

      expect(merged).toHaveLength(3);
      expect(merged.map(c => c.name)).toContain('cmd1');
      expect(merged.map(c => c.name)).toContain('cmd2');
      expect(merged.map(c => c.name)).toContain('cmd3');

      // Check that cmd2 has the updated description and arguments
      const cmd2 = merged.find(c => c.name === 'cmd2');
      expect(cmd2?.description).toBe('Command 2 updated');
      expect(cmd2?.arguments).toContain('arg1');
    });
  });

  describe('mergeHooks', () => {
    it('should merge hooks without duplicates', () => {
      const merger = new ComponentMerger();
      const hookGroups = [
        [
          { name: 'hook1.sh', content: '#!/bin/bash\necho "Hook 1"' },
          { name: 'hook2.sh', content: '#!/bin/bash\necho "Hook 2"' },
        ],
        [
          { name: 'hook2.sh', content: '#!/bin/bash\necho "Hook 2 updated"' },
          { name: 'hook3.sh', content: '#!/bin/bash\necho "Hook 3"' },
        ],
      ];

      const merged = merger.mergeHooks(hookGroups);

      expect(merged).toHaveLength(3);
      expect(merged.map(h => h.name)).toContain('hook1.sh');
      expect(merged.map(h => h.name)).toContain('hook2.sh');
      expect(merged.map(h => h.name)).toContain('hook3.sh');

      // Check that hook2 has the updated content
      const hook2 = merged.find(h => h.name === 'hook2.sh');
      expect(hook2?.content).toContain('Hook 2 updated');
    });
  });
});
