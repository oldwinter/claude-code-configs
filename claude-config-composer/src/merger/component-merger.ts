import { Agent, Command, Hook, Settings } from '../parser/config-parser';
import yaml from 'js-yaml';

export class ComponentMerger {
  mergeAgents(agentGroups: Agent[][]): Agent[] {
    const mergedAgents = new Map<string, Agent>();
    
    for (const agents of agentGroups) {
      for (const agent of agents) {
        const key = this.normalizeKey(agent.name);
        
        if (!mergedAgents.has(key)) {
          mergedAgents.set(key, agent);
        } else {
          // Merge similar agents by combining their content
          const existing = mergedAgents.get(key)!;
          const merged = this.mergeAgent(existing, agent);
          mergedAgents.set(key, merged);
        }
      }
    }
    
    return Array.from(mergedAgents.values());
  }

  private mergeAgent(agent1: Agent, agent2: Agent): Agent {
    // Combine tools from both agents
    const tools = new Set([...(agent1.tools || []), ...(agent2.tools || [])]);
    
    // Combine content with source attribution
    const content = [
      `# ${agent1.name}`,
      '',
      agent1.description || agent2.description,
      '',
      '## Combined expertise from multiple configurations',
      '',
      `### From ${agent1.source}:`,
      agent1.content,
      '',
      `### From ${agent2.source}:`,
      agent2.content
    ].join('\n');
    
    return {
      name: agent1.name,
      description: agent1.description || agent2.description,
      tools: Array.from(tools),
      content,
      source: `${agent1.source} + ${agent2.source}`
    };
  }

  mergeCommands(commandGroups: Command[][]): Command[] {
    const mergedCommands = new Map<string, Command>();
    
    for (const commands of commandGroups) {
      for (const command of commands) {
        const key = this.normalizeKey(command.name);
        
        if (!mergedCommands.has(key)) {
          mergedCommands.set(key, command);
        } else {
          // For duplicate commands, keep the more comprehensive one
          const existing = mergedCommands.get(key)!;
          if (command.content.length > existing.content.length) {
            mergedCommands.set(key, command);
          }
        }
      }
    }
    
    return Array.from(mergedCommands.values());
  }

  mergeHooks(hookGroups: Hook[][]): Hook[] {
    const mergedHooks = new Map<string, Hook>();
    
    for (const hooks of hookGroups) {
      for (const hook of hooks) {
        const key = hook.name;
        
        if (!mergedHooks.has(key)) {
          mergedHooks.set(key, hook);
        } else if (hook.type === 'script') {
          // For scripts, combine them
          const existing = mergedHooks.get(key)!;
          const merged = this.mergeScriptHooks(existing, hook);
          mergedHooks.set(key, merged);
        }
      }
    }
    
    return Array.from(mergedHooks.values());
  }

  private mergeScriptHooks(hook1: Hook, hook2: Hook): Hook {
    const content = [
      '#!/bin/bash',
      '',
      `# Combined hook from ${hook1.source} and ${hook2.source}`,
      '',
      `# From ${hook1.source}:`,
      hook1.content.replace(/^#!.*\n/, ''),
      '',
      `# From ${hook2.source}:`,
      hook2.content.replace(/^#!.*\n/, '')
    ].join('\n');
    
    return {
      name: hook1.name,
      type: 'script',
      content,
      source: `${hook1.source} + ${hook2.source}`
    };
  }

  mergeSettings(settingsArray: (Settings | null)[]): Settings {
    const merged: Settings = {};
    
    for (const settings of settingsArray) {
      if (!settings) continue;
      
      // Merge allow/deny arrays
      if (settings.allow) {
        merged.allow = [...(merged.allow || []), ...settings.allow];
      }
      if (settings.deny) {
        merged.deny = [...(merged.deny || []), ...settings.deny];
      }
      
      // Merge environment variables
      if (settings.env) {
        merged.env = { ...(merged.env || {}), ...settings.env };
      }
      
      // Merge hooks (complex merge)
      if (settings.hooks) {
        merged.hooks = this.mergeHooksConfig(merged.hooks || {}, settings.hooks);
      }
      
      // Merge status line
      if (settings.statusLine) {
        merged.statusLine = this.mergeStatusLine(merged.statusLine, settings.statusLine);
      }
      
      // Merge other properties
      const otherProps = ['codeRules', 'componentPatterns', 'importOrder', 'testingFramework', 'buildTools'];
      for (const prop of otherProps) {
        if (settings[prop]) {
          merged[prop] = this.deepMerge(merged[prop] || {}, settings[prop]);
        }
      }
    }
    
    // Deduplicate arrays
    if (merged.allow) {
      merged.allow = [...new Set(merged.allow)];
    }
    if (merged.deny) {
      merged.deny = [...new Set(merged.deny)];
    }
    
    return merged;
  }

  private mergeHooksConfig(hooks1: any, hooks2: any): any {
    const merged: any = {};
    
    const hookTypes = ['preToolUse', 'postToolUse', 'stop'];
    for (const type of hookTypes) {
      if (hooks1[type] || hooks2[type]) {
        const items1 = Array.isArray(hooks1[type]) ? hooks1[type] : (hooks1[type] ? [hooks1[type]] : []);
        const items2 = Array.isArray(hooks2[type]) ? hooks2[type] : (hooks2[type] ? [hooks2[type]] : []);
        
        const combined = [...items1, ...items2];
        if (combined.length === 1) {
          merged[type] = combined[0];
        } else if (combined.length > 1) {
          merged[type] = combined;
        }
      }
    }
    
    return merged;
  }

  private mergeStatusLine(status1: any, status2: any): any {
    if (!status1) return status2;
    if (!status2) return status1;
    
    return {
      template: status1.template || status2.template,
      variables: { ...(status1.variables || {}), ...(status2.variables || {}) }
    };
  }

  private deepMerge(obj1: any, obj2: any): any {
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      return [...obj1, ...obj2];
    }
    
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
      const merged: any = { ...obj1 };
      
      for (const key in obj2) {
        if (key in merged) {
          merged[key] = this.deepMerge(merged[key], obj2[key]);
        } else {
          merged[key] = obj2[key];
        }
      }
      
      return merged;
    }
    
    return obj2;
  }

  private normalizeKey(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  generateAgentFile(agent: Agent): string {
    const frontmatter = {
      name: agent.name,
      description: agent.description,
      tools: agent.tools
    };
    
    return [
      '---',
      yaml.dump(frontmatter).trim(),
      '---',
      '',
      agent.content
    ].join('\n');
  }

  generateCommandFile(command: Command): string {
    const frontmatter: any = {
      name: command.name,
      description: command.description
    };
    
    if (command.allowedTools?.length) {
      frontmatter['allowed-tools'] = command.allowedTools;
    }
    
    if (command.argumentHint) {
      frontmatter['argument-hint'] = command.argumentHint;
    }
    
    return [
      '---',
      yaml.dump(frontmatter).trim(),
      '---',
      '',
      command.content
    ].join('\n');
  }
}