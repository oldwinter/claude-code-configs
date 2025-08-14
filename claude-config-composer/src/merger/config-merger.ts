import { ConfigMetadata } from '../registry/config-registry';

interface Section {
  title: string;
  content: string;
  level: number;
  source: string;
  priority: number;
}

export class ConfigMerger {
  private sections: Map<string, Section[]> = new Map();

  parseMarkdown(content: string, source: string, metadata?: ConfigMetadata): Section[] {
    const sections: Section[] = [];
    const lines = content.split('\n');
    
    let currentSection: Section | null = null;
    let contentBuffer: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);

      if (headerMatch) {
        if (currentSection) {
          currentSection.content = contentBuffer.join('\n').trim();
          if (currentSection.content) {
            sections.push(currentSection);
          }
        }

        const level = headerMatch[1].length;
        const title = headerMatch[2].trim();
        
        const sectionMetadata = metadata?.sections?.find(s => 
          s.title.toLowerCase() === title.toLowerCase()
        );

        currentSection = {
          title,
          content: '',
          level,
          source,
          priority: sectionMetadata?.priority ?? 0
        };
        contentBuffer = [];
      } else {
        contentBuffer.push(line);
      }
    }

    if (currentSection) {
      currentSection.content = contentBuffer.join('\n').trim();
      if (currentSection.content) {
        sections.push(currentSection);
      }
    }

    return sections;
  }

  addConfig(content: string, metadata: ConfigMetadata) {
    const sections = this.parseMarkdown(content, metadata.name, metadata);
    
    for (const section of sections) {
      const key = this.normalizeTitle(section.title);
      
      if (!this.sections.has(key)) {
        this.sections.set(key, []);
      }
      
      this.sections.get(key)!.push(section);
    }
  }

  private normalizeTitle(title: string): string {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  merge(configs: Array<{ content: string; metadata: ConfigMetadata }>): string {
    this.sections.clear();

    for (const { content, metadata } of configs) {
      this.addConfig(content, metadata);
    }

    const output: string[] = [];
    const processedSections = new Set<string>();

    output.push(`# Composed Claude Code Configuration`);
    output.push('');
    output.push(`This configuration combines: ${configs.map(c => c.metadata.name).join(', ')}`);
    output.push('');
    output.push('---');
    output.push('');

    const prioritizedSections = this.getPrioritizedSections();

    for (const [key, sections] of prioritizedSections) {
      if (processedSections.has(key)) continue;

      const bestSection = this.selectBestSection(sections);
      
      if (this.shouldMergeSections(sections)) {
        const merged = this.mergeSimilarSections(sections);
        output.push(`${'#'.repeat(Math.min(bestSection.level, 2))} ${bestSection.title}`);
        output.push('');
        output.push(merged);
        output.push('');
      } else {
        output.push(`${'#'.repeat(Math.min(bestSection.level, 2))} ${bestSection.title}`);
        output.push('');
        output.push(bestSection.content);
        output.push('');
      }

      processedSections.add(key);
    }

    this.addMetadata(output, configs);

    return output.join('\n');
  }

  private getPrioritizedSections(): Array<[string, Section[]]> {
    const entries = Array.from(this.sections.entries());
    
    return entries.sort(([keyA, sectionsA], [keyB, sectionsB]) => {
      const maxPriorityA = Math.max(...sectionsA.map(s => s.priority));
      const maxPriorityB = Math.max(...sectionsB.map(s => s.priority));
      
      if (maxPriorityA !== maxPriorityB) {
        return maxPriorityB - maxPriorityA;
      }

      const orderMap: Record<string, number> = {
        'project context': 100,
        'critical': 90,
        'core principles': 85,
        'technology stack': 80,
        'breaking changes': 75,
        'file conventions': 70,
        'patterns': 65,
        'common commands': 60,
        'security': 55,
        'performance': 50,
        'testing': 45,
        'deployment': 40,
        'debugging': 35,
        'resources': 30,
      };

      for (const [pattern, order] of Object.entries(orderMap)) {
        const aMatches = keyA.includes(pattern);
        const bMatches = keyB.includes(pattern);
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        if (aMatches && bMatches) return 0;
      }

      return 0;
    });
  }

  private selectBestSection(sections: Section[]): Section {
    return sections.reduce((best, current) => {
      if (current.priority > best.priority) return current;
      if (current.priority === best.priority && current.content.length > best.content.length) {
        return current;
      }
      return best;
    });
  }

  private shouldMergeSections(sections: Section[]): boolean {
    if (sections.length <= 1) return false;
    
    const titles = sections.map(s => this.normalizeTitle(s.title));
    const uniqueTitles = new Set(titles);
    
    if (uniqueTitles.size > 1) return false;

    const mergeableKeywords = [
      'commands', 'common commands', 'development',
      'testing', 'security', 'performance',
      'project context', 'technology stack',
      'dependencies', 'scripts'
    ];

    const title = titles[0];
    return mergeableKeywords.some(keyword => title.includes(keyword));
  }

  private mergeSimilarSections(sections: Section[]): string {
    const mergedContent: string[] = [];
    const sources = [...new Set(sections.map(s => s.source))];
    
    mergedContent.push(`*Combined from: ${sources.join(', ')}*`);
    mergedContent.push('');

    const contentMap = new Map<string, Set<string>>();
    
    for (const section of sections) {
      const lines = section.content.split('\n');
      let currentSubsection = 'main';
      
      for (const line of lines) {
        if (line.startsWith('###')) {
          currentSubsection = line;
        }
        
        if (!contentMap.has(currentSubsection)) {
          contentMap.set(currentSubsection, new Set());
        }
        
        const normalizedLine = line.trim();
        if (normalizedLine && !normalizedLine.startsWith('*Combined from:')) {
          contentMap.get(currentSubsection)!.add(line);
        }
      }
    }

    for (const [subsection, lines] of contentMap) {
      if (subsection !== 'main') {
        mergedContent.push(subsection);
      }
      mergedContent.push(...Array.from(lines));
    }

    return mergedContent.join('\n');
  }

  private addMetadata(output: string[], configs: Array<{ metadata: ConfigMetadata }>) {
    output.push('');
    output.push('---');
    output.push('');
    output.push('## Configuration Metadata');
    output.push('');
    output.push('### Included Configurations');
    output.push('');
    
    for (const { metadata } of configs) {
      output.push(`- **${metadata.name}** v${metadata.version}: ${metadata.description}`);
    }
    
    output.push('');
    output.push('### Generation Details');
    output.push('');
    output.push(`- Generated: ${new Date().toISOString()}`);
    output.push(`- Generator: Claude Config Composer v1.0.0`);
    output.push('');
    output.push('### Compatibility Notes');
    output.push('');
    output.push('This is a composed configuration. Some features may require additional setup or conflict resolution.');
    output.push('Review the combined configuration carefully and adjust as needed for your specific project.');
  }
}