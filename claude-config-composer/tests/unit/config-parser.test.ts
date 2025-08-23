import fs from 'fs/promises';
import path from 'path';
import { beforeEach, describe, expect, it } from 'vitest';
import { ConfigParser } from '../../src/parser/config-parser';

describe('ConfigParser Unit Tests', () => {
  let configParser: ConfigParser;
  const testConfigPath = path.resolve(__dirname, '../../../configurations/frameworks/nextjs-15');

  beforeEach(() => {
    configParser = new ConfigParser();
  });

  describe('CLAUDE.md Parsing', () => {
    it('should parse Next.js configuration correctly', async () => {
      const config = await configParser.parseConfigDirectory(testConfigPath);

      expect(config).toBeDefined();
      expect(config.claudeMd).toBeDefined();
      expect(config.claudeMd).not.toBeNull();
      expect(config.claudeMd!.length).toBeGreaterThan(1000);

      // Should contain expected Next.js content
      expect(config.claudeMd).toContain('Next.js 15');
      expect(config.claudeMd).toContain('App Router');
    });

    it('should extract content from CLAUDE.md', async () => {
      const config = await configParser.parseConfigDirectory(testConfigPath);

      expect(config.claudeMd).toBeDefined();
      expect(config.claudeMd).not.toBeNull();
      expect(config.claudeMd).toContain('Next.js');
    });

    it('should handle configurations without specific structure', async () => {
      // Test parsing a simpler configuration
      const tailwindConfigPath = path.resolve(__dirname, '../../../configurations/ui/tailwindcss');

      const config = await configParser.parseConfigDirectory(tailwindConfigPath);

      expect(config).toBeDefined();
      expect(config.claudeMd).toBeDefined();
      if (config.claudeMd) {
        expect(config.claudeMd).toContain('Tailwind');
      }
    });
  });

  describe('Agent Parsing', () => {
    it('should parse agents from Next.js configuration', async () => {
      const config = await configParser.parseConfigDirectory(testConfigPath);

      expect(config.agents).toBeDefined();
      expect(Array.isArray(config.agents)).toBe(true);
      expect(config.agents.length).toBeGreaterThan(0);

      // Check agent structure
      const firstAgent = config.agents[0];
      expect(firstAgent.name).toBeDefined();
      expect(firstAgent.description).toBeDefined();
      expect(firstAgent.content).toBeDefined();
    });

    it('should parse agent metadata correctly', async () => {
      const config = await configParser.parseConfigDirectory(testConfigPath);

      for (const agent of config.agents) {
        expect(typeof agent.name).toBe('string');
        expect(typeof agent.description).toBe('string');
        expect(typeof agent.content).toBe('string');

        if (agent.tools) {
          expect(Array.isArray(agent.tools)).toBe(true);
        }
      }
    });

    it('should handle agents with different YAML frontmatter', async () => {
      const shadcnConfigPath = path.resolve(__dirname, '../../../configurations/ui/shadcn');
      const config = await configParser.parseConfigDirectory(shadcnConfigPath);

      expect(config.agents.length).toBeGreaterThan(0);

      // Check for shadcn-specific agents
      const agentNames = config.agents.map(a => a.name);
      expect(agentNames.some(name => name.includes('component'))).toBe(true);
    });
  });

  describe('Command Parsing', () => {
    it('should parse commands from configuration', async () => {
      const config = await configParser.parseConfigDirectory(testConfigPath);

      expect(config.commands).toBeDefined();
      expect(Array.isArray(config.commands)).toBe(true);
      expect(config.commands.length).toBeGreaterThan(0);
    });

    it('should parse command metadata with valid YAML', async () => {
      const config = await configParser.parseConfigDirectory(testConfigPath);

      for (const command of config.commands) {
        expect(command.name).toBeDefined();
        expect(command.description).toBeDefined();
        expect(command.content).toBeDefined();

        // Should have valid allowed-tools
        if (command.allowedTools) {
          expect(Array.isArray(command.allowedTools)).toBe(true);
          expect(command.allowedTools.length).toBeGreaterThan(0);
        }
      }
    });

    it('should handle commands with argument hints', async () => {
      const config = await configParser.parseConfigDirectory(testConfigPath);

      const commandsWithArgs = config.commands.filter(cmd => cmd.argumentHint);
      expect(commandsWithArgs.length).toBeGreaterThan(0);

      for (const command of commandsWithArgs) {
        expect(typeof command.argumentHint).toBe('string');
        expect(command.argumentHint!.length).toBeGreaterThan(0);
      }
    });

    it('should properly parse fixed YAML frontmatter', async () => {
      // Test that our YAML fixes worked
      const config = await configParser.parseConfigDirectory(testConfigPath);

      // Should not throw errors during parsing
      expect(config.commands.length).toBeGreaterThan(0);

      // All commands should have parsed successfully
      for (const command of config.commands) {
        expect(command.name).toBeDefined();
        expect(command.description).toBeDefined();
      }
    });
  });

  describe('Hooks Parsing', () => {
    it('should parse hooks when present', async () => {
      const config = await configParser.parseConfigDirectory(testConfigPath);

      // Next.js config should have hooks
      expect(config.hooks).toBeDefined();
      expect(Array.isArray(config.hooks)).toBe(true);
    });

    it('should handle missing hooks gracefully', async () => {
      // Some configs might not have hooks
      const config = await configParser.parseConfigDirectory(testConfigPath);

      if (config.hooks.length === 0) {
        expect(config.hooks).toEqual([]);
      } else {
        for (const hook of config.hooks) {
          expect(hook.name).toBeDefined();
          expect(hook.content).toBeDefined();
        }
      }
    });
  });

  describe('Settings Parsing', () => {
    it('should parse settings.json when present', async () => {
      const config = await configParser.parseConfigDirectory(testConfigPath);

      if (config.settings) {
        expect(typeof config.settings).toBe('object');

        // Should have permissions structure
        if (config.settings.permissions) {
          expect(config.settings.permissions.allow).toBeDefined();
          expect(Array.isArray(config.settings.permissions.allow)).toBe(true);
        }

        // Should have hooks structure
        if (config.settings.hooks) {
          expect(typeof config.settings.hooks).toBe('object');
        }
      }
    });

    it('should parse valid JSON settings', async () => {
      const shadcnConfigPath = path.resolve(__dirname, '../../../configurations/ui/shadcn');
      const config = await configParser.parseConfigDirectory(shadcnConfigPath);

      if (config.settings) {
        // Should be valid JSON-parseable object
        expect(() => JSON.stringify(config.settings)).not.toThrow();
      }
    });

    it('should handle configurations without settings', async () => {
      // Some configs might not have settings.json
      const config = await configParser.parseConfigDirectory(testConfigPath);

      // Should not fail if settings is undefined
      expect(config).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing CLAUDE.md file gracefully', async () => {
      // Create a temporary directory without CLAUDE.md
      const tempDir = path.join(__dirname, '../temp-no-claude');
      
      try {
        await fs.mkdir(tempDir, { recursive: true });

        const result = await configParser.parseConfigDirectory(tempDir);
        expect(result).toBeDefined();
        expect(result.claudeMd).toBeNull();
        expect(result.agents).toEqual([]);
        expect(result.commands).toEqual([]);
        expect(result.hooks).toEqual([]);
        expect(result.settings).toBeNull();
      } finally {
        // Cleanup
        try {
          await fs.rmdir(tempDir, { recursive: true });
        } catch {
          // Ignore cleanup errors
        }
      }
    });

    it('should handle malformed YAML frontmatter', async () => {
      // Create a temporary file with bad YAML
      const tempDir = path.join(__dirname, '../temp');
      const tempFile = path.join(tempDir, 'bad-yaml.md');

      try {
        await fs.mkdir(tempDir, { recursive: true });
        await fs.writeFile(
          tempFile,
          `---
description: This is bad YAML
argument-hint: [unclosed bracket
---

Content here`
        );

        const content = await fs.readFile(tempFile, 'utf-8');
        const result = configParser['parseCommand'](content, 'bad-yaml.md', tempDir);

        // Should handle gracefully - either return null or return with defaults
        expect(result).toBeNull();
      } finally {
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    });

    it('should handle empty configuration directories', async () => {
      const tempDir = path.join(__dirname, '../temp-empty');

      try {
        await fs.mkdir(tempDir, { recursive: true });

        const result = await configParser.parseConfigDirectory(tempDir);
        expect(result).toBeDefined();
        expect(result.claudeMd).toBeNull();
        expect(result.agents).toEqual([]);
        expect(result.commands).toEqual([]);
        expect(result.hooks).toEqual([]);
        expect(result.settings).toBeNull();
      } finally {
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    });
  });

  describe('Content Quality', () => {
    it('should preserve markdown formatting', async () => {
      const config = await configParser.parseConfigDirectory(testConfigPath);

      expect(config.claudeMd).toBeDefined();
      expect(config.claudeMd).not.toBeNull();

      const content = config.claudeMd!;
      // Should contain markdown headers
      expect(content).toMatch(/^#\s+/m);
      expect(content).toMatch(/^##\s+/m);

      // Should contain code blocks
      expect(content).toMatch(/```\w+/);

      // Should contain list items
      expect(content).toMatch(/^[-*]\s+/m);
    });

    it('should handle special characters correctly', async () => {
      const config = await configParser.parseConfigDirectory(testConfigPath);

      expect(config.claudeMd).toBeDefined();
      expect(config.claudeMd).not.toBeNull();

      const content = config.claudeMd!;
      // Should not have encoding issues
      expect(content).not.toContain('â€™'); // Common encoding issue
      expect(content).not.toContain('Ã'); // Another encoding issue

      // Should preserve intentional special characters
      if (content.includes('⚠️')) {
        expect(content).toContain('⚠️');
      }
    });

    it('should maintain consistent line endings', async () => {
      const config = await configParser.parseConfigDirectory(testConfigPath);

      expect(config.claudeMd).toBeDefined();
      expect(config.claudeMd).not.toBeNull();

      const content = config.claudeMd!;
      // Should use consistent line endings (Unix-style)
      expect(content).not.toContain('\r\n');

      // Should not have excessive empty lines
      expect(content).not.toMatch(/\n\n\n\n+/);
    });
  });
});
