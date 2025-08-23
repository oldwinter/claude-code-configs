import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { ErrorHandler, FileSystemError } from '../../utils/error-handler';
import { isFileNotFoundError, getErrorMessage } from '../../types/errors.js';

/**
 * Backup utilities for existing configurations
 */
export class BackupUtils {
  /**
   * Backup existing .claude directory with timestamp
   */
  static async backupExistingConfig(targetDir: string): Promise<void> {
    return ErrorHandler.wrapAsync(async () => {
      // Always backup the .claude directory specifically
      const claudeDir = targetDir === '.' ? '.claude' : path.join(targetDir, '.claude');

      try {
        await fs.access(claudeDir);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const backupDir = `${claudeDir}.backup-${timestamp}`;

        console.log(chalk.yellow(`📦 Backing up existing configuration to ${backupDir}`));
        await fs.rename(claudeDir, backupDir);

        console.log(chalk.green(`✅ Backup created: ${backupDir}`));
      } catch (error: unknown) {
        if (isFileNotFoundError(error)) {
          // Directory doesn't exist, no backup needed
          return;
        }
        throw new FileSystemError(
          `Failed to backup existing configuration: ${getErrorMessage(error)}`,
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }, 'backup');
  }

  /**
   * Ensure directory is added to .gitignore
   */
  static async ensureGitignored(dirName: string): Promise<void> {
    return ErrorHandler.wrapAsync(
      async () => {
        try {
          // Use relative path to avoid process.cwd() issues in CI
          const gitignorePath = '.gitignore';
          let gitignoreContent = '';

          try {
            gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
          } catch (error: unknown) {
            if (!isFileNotFoundError(error)) {
              throw error;
            }
            // .gitignore doesn't exist yet, that's fine
          }

          const patterns = [dirName, `${dirName}/`];
          const needsUpdate = patterns.some(pattern => !gitignoreContent.includes(pattern));

          if (needsUpdate) {
            const addition = gitignoreContent.endsWith('\n') || !gitignoreContent ? '' : '\n';
            gitignoreContent += `${addition}# Generated Claude Code configurations\n${dirName}/\n`;
            await fs.writeFile(gitignorePath, gitignoreContent);
            console.log(chalk.green(`✅ Added ${dirName}/ to .gitignore`));
          }
        } catch (error: unknown) {
          // Non-fatal error for gitignore - just warn
          console.warn(chalk.yellow(`⚠️  Could not update .gitignore: ${getErrorMessage(error)}`));
        }
      },
      'gitignore-update',
      undefined
    ); // undefined fallback means continue on error
  }

  /**
   * Check if directory exists and has content
   */
  static async hasExistingConfig(targetDir: string): Promise<boolean> {
    return ErrorHandler.wrapAsync(
      async () => {
        const claudeDir = targetDir === '.' ? '.claude' : path.join(targetDir, '.claude');

        try {
          const stats = await fs.stat(claudeDir);
          if (!stats.isDirectory()) {
            return false;
          }

          // Check if directory has any content
          const files = await fs.readdir(claudeDir);
          return files.length > 0;
        } catch (error: unknown) {
          if (isFileNotFoundError(error)) {
            return false;
          }
          throw new FileSystemError(
            `Failed to check existing configuration: ${getErrorMessage(error)}`,
            error instanceof Error ? error : undefined
          );
        }
      },
      'config-check',
      false
    );
  }

  /**
   * Get backup directory pattern for cleanup or listing
   */
  static getBackupPattern(targetDir: string): string {
    const claudeDir = targetDir === '.' ? '.claude' : path.join(targetDir, '.claude');
    return `${claudeDir}.backup-*`;
  }

  /**
   * List existing backup directories
   */
  static async listBackups(targetDir: string): Promise<string[]> {
    return ErrorHandler.wrapAsync(
      async () => {
        const baseDir = targetDir === '.' ? '.' : targetDir;
        const claudeDirName = '.claude';

        try {
          const files = await fs.readdir(baseDir);
          return files
            .filter(file => file.startsWith(`${claudeDirName}.backup-`))
            .sort()
            .reverse(); // Most recent first
        } catch (error: unknown) {
          throw new FileSystemError(`Failed to list backups: ${getErrorMessage(error)}`, error instanceof Error ? error : undefined);
        }
      },
      'backup-list',
      []
    );
  }

  /**
   * Clean up old backups (keep only the most recent N)
   */
  static async cleanupOldBackups(targetDir: string, keepCount: number = 5): Promise<void> {
    return ErrorHandler.wrapAsync(
      async () => {
        const backups = await BackupUtils.listBackups(targetDir);

        if (backups.length <= keepCount) {
          return; // Nothing to clean up
        }

        const toDelete = backups.slice(keepCount);
        const baseDir = targetDir === '.' ? '.' : targetDir;

        for (const backup of toDelete) {
          const backupPath = path.join(baseDir, backup);
          try {
            await fs.rm(backupPath, { recursive: true, force: true });
            console.log(chalk.gray(`🗑️  Cleaned up old backup: ${backup}`));
          } catch (error: unknown) {
            console.warn(chalk.yellow(`⚠️  Could not remove backup ${backup}: ${getErrorMessage(error)}`));
          }
        }
      },
      'backup-cleanup',
      undefined
    );
  }

  /**
   * Restore from a specific backup
   */
  static async restoreFromBackup(targetDir: string, backupName?: string): Promise<void> {
    return ErrorHandler.wrapAsync(async () => {
      const backups = await BackupUtils.listBackups(targetDir);

      if (backups.length === 0) {
        throw new FileSystemError('No backups found to restore from');
      }

      const backupToRestore = backupName || backups[0]; // Use most recent if not specified

      if (!backups.includes(backupToRestore)) {
        throw new FileSystemError(`Backup not found: ${backupToRestore}`);
      }

      const baseDir = targetDir === '.' ? '.' : targetDir;
      const claudeDir = path.join(baseDir, '.claude');
      const backupPath = path.join(baseDir, backupToRestore);

      // Remove current configuration if it exists
      try {
        await fs.rm(claudeDir, { recursive: true, force: true });
      } catch (error: unknown) {
        // Ignore if doesn't exist
        if (!isFileNotFoundError(error)) {
          throw error;
        }
      }

      // Restore from backup
      await fs.rename(backupPath, claudeDir);
      console.log(chalk.green(`✅ Restored configuration from ${backupToRestore}`));
    }, 'backup-restore');
  }
}
