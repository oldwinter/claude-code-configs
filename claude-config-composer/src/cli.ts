#!/usr/bin/env node

import { program } from 'commander';
import { checkbox, confirm, select } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import { ConfigRegistry } from './registry/config-registry';
import { ConfigMerger } from './merger/config-merger';
import { ConfigGenerator } from './generator/config-generator';

const CONFIG_CATEGORIES = {
  framework: '🏗️  Framework',
  ui: '🎨  UI/Styling',
  tooling: '⚙️  Tooling',
  testing: '🧪  Testing',
  database: '💾  Database',
  api: '🌐  API'
};

async function ensureDirectory(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(chalk.red(`Failed to create directory: ${dirPath}`));
  }
}

async function interactiveMode() {
  console.log(chalk.cyan.bold('\n🚀 Claude Config Composer\n'));
  console.log(chalk.gray('Generate custom Claude Code configurations for your stack\n'));

  const registry = new ConfigRegistry();
  const spinner = ora('Loading available configurations...').start();
  
  await registry.initialize();
  spinner.succeed('Configurations loaded');

  const mode = await select({
    message: 'How would you like to select your stack?',
    choices: [
      { name: 'Quick presets', value: 'presets' },
      { name: 'Custom selection', value: 'custom' },
      { name: 'By category', value: 'category' }
    ]
  });

  let selectedConfigs: string[] = [];

  if (mode === 'presets') {
    const preset = await select({
      message: 'Choose a preset stack:',
      choices: [
        { name: 'Next.js 15 + shadcn/ui + TypeScript', value: ['nextjs-15', 'shadcn', 'typescript'] },
        { name: 'Next.js 15 + Prisma + tRPC', value: ['nextjs-15', 'prisma', 'trpc', 'typescript'] },
        { name: 'React + shadcn/ui + TanStack', value: ['react-19', 'shadcn', 'tanstack', 'typescript'] },
        { name: 'Full Stack: Next.js + shadcn + Prisma + tRPC', value: ['nextjs-15', 'shadcn', 'prisma', 'trpc', 'typescript'] }
      ]
    });
    selectedConfigs = preset as string[];
  } else if (mode === 'category') {
    for (const [categoryId, categoryName] of Object.entries(CONFIG_CATEGORIES)) {
      const configs = registry.getByCategory(categoryId);
      if (configs.length === 0) continue;

      const selected = await checkbox({
        message: `Select ${categoryName} configurations:`,
        choices: configs.map(c => ({
          name: `${c.name} (v${c.version})`,
          value: c.id,
          checked: false
        }))
      });

      selectedConfigs.push(...selected);
    }
  } else {
    const allConfigs = registry.getAll();
    selectedConfigs = await checkbox({
      message: 'Select configurations to combine:',
      choices: allConfigs.map(c => ({
        name: `${c.name} - ${c.description}`,
        value: c.id,
        checked: false
      })),
      required: true
    });
  }

  const compatibility = registry.validateCompatibility(selectedConfigs);
  
  if (!compatibility.valid) {
    console.log(chalk.yellow('\n⚠️  Compatibility issues detected:\n'));
    
    if (compatibility.conflicts.length > 0) {
      console.log(chalk.red('Conflicts:'));
      compatibility.conflicts.forEach(c => console.log(`  - ${c}`));
    }
    
    if (compatibility.missingDependencies.length > 0) {
      console.log(chalk.yellow('\nMissing dependencies:'));
      compatibility.missingDependencies.forEach(d => console.log(`  - ${d}`));
      
      const addDeps = await confirm({
        message: 'Would you like to add the missing dependencies?',
        default: true
      });
      
      if (addDeps) {
        const deps = compatibility.missingDependencies
          .map(d => d.split(' requires ')[1])
          .filter((d, i, arr) => arr.indexOf(d) === i);
        selectedConfigs.push(...deps);
      }
    }

    if (compatibility.conflicts.length > 0) {
      const proceed = await confirm({
        message: 'There are conflicts. Continue anyway?',
        default: false
      });
      
      if (!proceed) {
        console.log(chalk.gray('\nExiting...'));
        process.exit(0);
      }
    }
  }

  console.log(chalk.cyan('\n📦 Selected configurations:'));
  selectedConfigs.forEach(id => {
    const config = registry.get(id);
    if (config) {
      console.log(`  • ${config.name} (${config.category})`);
    }
  });

  const outputPath = await select({
    message: '\nWhere should the configuration be generated?',
    choices: [
      { name: 'Current directory (.claude/)', value: '.claude' },
      { name: 'Custom directory', value: 'custom' }
    ]
  });

  let targetDir = '.claude';
  if (outputPath === 'custom') {
    console.log(chalk.gray('Enter path relative to current directory'));
    targetDir = 'custom-claude-config';
  }

  const generateSpinner = ora('Generating complete configuration...').start();

  const generator = new ConfigGenerator();
  const configsToGenerate = [];

  for (const id of selectedConfigs) {
    const metadata = registry.get(id);
    if (!metadata) continue;
    configsToGenerate.push({ path: metadata.path, metadata });
  }

  await ensureDirectory(targetDir);
  await generator.generateCompleteConfig(configsToGenerate, targetDir);

  generateSpinner.succeed('Configuration generated successfully!');

  console.log(chalk.green(`\n✅ Complete configuration created at: ${targetDir}/`));
  console.log(chalk.gray('\nStructure created:'));
  console.log(`  📁 ${targetDir}/`);
  console.log(`  ├── 📄 CLAUDE.md`);
  console.log(`  ├── 📁 .claude/`);
  console.log(`  │   ├── ⚙️  settings.json`);
  console.log(`  │   ├── 🤖 agents/`);
  console.log(`  │   ├── 💻 commands/`);
  console.log(`  │   └── 🔧 hooks/`);
  console.log(`  ├── 📄 README.md`);
  console.log(`  └── 📄 package.json`);
  
  console.log(chalk.cyan('\n🎉 Your Claude Code configuration is ready!'));
  console.log(chalk.gray(`\nTo use it, make sure Claude Code can access the ${targetDir}/ directory.`));
}

async function generatePreset(preset: string) {
  const presets: Record<string, string[]> = {
    'nextjs-shadcn': ['nextjs-15', 'shadcn', 'typescript'],
    'nextjs-fullstack': ['nextjs-15', 'shadcn', 'prisma', 'trpc', 'typescript'],
    'react-shadcn': ['react-19', 'shadcn', 'tanstack', 'typescript']
  };

  if (!presets[preset]) {
    console.error(chalk.red(`Unknown preset: ${preset}`));
    console.log(chalk.gray('Available presets: ' + Object.keys(presets).join(', ')));
    process.exit(1);
  }

  const registry = new ConfigRegistry();
  await registry.initialize();

  const selectedConfigs = presets[preset];
  const generator = new ConfigGenerator();
  const configsToGenerate = [];

  for (const id of selectedConfigs) {
    const metadata = registry.get(id);
    if (!metadata) continue;
    configsToGenerate.push({ path: metadata.path, metadata });
  }

  const targetDir = `.claude-${preset}`;
  await ensureDirectory(targetDir);
  await generator.generateCompleteConfig(configsToGenerate, targetDir);

  console.log(chalk.green(`✅ Complete configuration generated at: ${targetDir}/`));
}

program
  .name('claude-compose')
  .description('Generate custom Claude Code configurations for your development stack')
  .version('1.0.0');

program
  .command('interactive')
  .alias('i')
  .description('Interactive mode to select and compose configurations')
  .action(interactiveMode);

program
  .command('generate <preset>')
  .alias('g')
  .description('Generate a preset configuration')
  .action(generatePreset);

program
  .command('list')
  .alias('ls')
  .description('List available configurations')
  .action(async () => {
    const registry = new ConfigRegistry();
    await registry.initialize();
    
    console.log(chalk.cyan.bold('\n📚 Available Configurations\n'));
    
    for (const [categoryId, categoryName] of Object.entries(CONFIG_CATEGORIES)) {
      const configs = registry.getByCategory(categoryId);
      if (configs.length === 0) continue;
      
      console.log(chalk.yellow(`\n${categoryName}`));
      configs.forEach(c => {
        console.log(`  • ${chalk.white(c.name)} ${chalk.gray(`v${c.version}`)} - ${chalk.dim(c.description)}`);
      });
    }
  });

program.action(interactiveMode);

program.parse();