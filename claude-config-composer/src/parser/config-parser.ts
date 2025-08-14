import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

export interface Agent {
  name: string;
  description: string;
  tools?: string[];
  content: string;
  source: string;
}

export interface Command {
  name: string;
  description: string;
  allowedTools?: string[];
  argumentHint?: string;
  content: string;
  source: string;
}

export interface Hook {
  name: string;
  type: 'script' | 'config';
  content: string;
  source: string;
}

export interface Settings {
  allow?: string[];
  deny?: string[];
  env?: Record<string, string>;
  hooks?: Record<string, any>;
  statusLine?: any;
  codeRules?: any;
  componentPatterns?: any;
  importOrder?: any;
  testingFramework?: any;
  buildTools?: any;
  [key: string]: any;
}

export class ConfigParser {
  async parseConfigDirectory(configPath: string): Promise<{
    agents: Agent[];
    commands: Command[];
    hooks: Hook[];
    settings: Settings | null;
    claudeMd: string | null;
  }> {
    const agents: Agent[] = [];
    const commands: Command[] = [];
    const hooks: Hook[] = [];
    let settings: Settings | null = null;
    let claudeMd: string | null = null;

    // Parse CLAUDE.md
    try {
      claudeMd = await fs.readFile(path.join(configPath, 'CLAUDE.md'), 'utf-8');
    } catch (e) {
      // CLAUDE.md might not exist
    }

    const claudeDir = path.join(configPath, '.claude');
    
    try {
      await fs.access(claudeDir);
    } catch {
      // No .claude directory
      return { agents, commands, hooks, settings, claudeMd };
    }

    // Parse settings.json
    try {
      const settingsContent = await fs.readFile(path.join(claudeDir, 'settings.json'), 'utf-8');
      settings = JSON.parse(settingsContent);
    } catch (e) {
      // settings.json might not exist
    }

    // Parse agents
    const agentsDir = path.join(claudeDir, 'agents');
    try {
      const agentFiles = await fs.readdir(agentsDir);
      for (const file of agentFiles) {
        if (!file.endsWith('.md')) continue;
        
        const content = await fs.readFile(path.join(agentsDir, file), 'utf-8');
        const agent = this.parseAgent(content, file, configPath);
        if (agent) agents.push(agent);
      }
    } catch (e) {
      // No agents directory
    }

    // Parse commands
    const commandsDir = path.join(claudeDir, 'commands');
    try {
      const commandFiles = await fs.readdir(commandsDir);
      for (const file of commandFiles) {
        if (!file.endsWith('.md')) continue;
        
        const content = await fs.readFile(path.join(commandsDir, file), 'utf-8');
        const command = this.parseCommand(content, file, configPath);
        if (command) commands.push(command);
      }
    } catch (e) {
      // No commands directory
    }

    // Parse hooks
    const hooksDir = path.join(claudeDir, 'hooks');
    try {
      const hookFiles = await fs.readdir(hooksDir);
      for (const file of hookFiles) {
        const content = await fs.readFile(path.join(hooksDir, file), 'utf-8');
        
        if (file.endsWith('.json')) {
          hooks.push({
            name: file,
            type: 'config',
            content,
            source: configPath
          });
        } else if (file.endsWith('.sh') || file.endsWith('.js')) {
          hooks.push({
            name: file,
            type: 'script',
            content,
            source: configPath
          });
        }
      }
    } catch (e) {
      // No hooks directory
    }

    return { agents, commands, hooks, settings, claudeMd };
  }

  private parseAgent(content: string, filename: string, source: string): Agent | null {
    try {
      const lines = content.split('\n');
      let frontmatterEnd = -1;
      
      // Find YAML frontmatter
      if (lines[0] === '---') {
        for (let i = 1; i < lines.length; i++) {
          if (lines[i] === '---') {
            frontmatterEnd = i;
            break;
          }
        }
      }

      let metadata: any = {};
      let bodyContent = content;

      if (frontmatterEnd > 0) {
        const frontmatter = lines.slice(1, frontmatterEnd).join('\n');
        metadata = yaml.load(frontmatter) as any;
        bodyContent = lines.slice(frontmatterEnd + 1).join('\n');
      }

      return {
        name: metadata.name || filename.replace('.md', ''),
        description: metadata.description || '',
        tools: metadata.tools || [],
        content: bodyContent.trim(),
        source
      };
    } catch (e) {
      console.error(`Error parsing agent ${filename}:`, e);
      return null;
    }
  }

  private parseCommand(content: string, filename: string, source: string): Command | null {
    try {
      const lines = content.split('\n');
      let frontmatterEnd = -1;
      
      // Find YAML frontmatter
      if (lines[0] === '---') {
        for (let i = 1; i < lines.length; i++) {
          if (lines[i] === '---') {
            frontmatterEnd = i;
            break;
          }
        }
      }

      let metadata: any = {};
      let bodyContent = content;

      if (frontmatterEnd > 0) {
        const frontmatter = lines.slice(1, frontmatterEnd).join('\n');
        metadata = yaml.load(frontmatter) as any;
        bodyContent = lines.slice(frontmatterEnd + 1).join('\n');
      }

      return {
        name: metadata.name || filename.replace('.md', ''),
        description: metadata.description || '',
        allowedTools: metadata['allowed-tools'] || [],
        argumentHint: metadata['argument-hint'] || '',
        content: bodyContent.trim(),
        source
      };
    } catch (e) {
      console.error(`Error parsing command ${filename}:`, e);
      return null;
    }
  }
}