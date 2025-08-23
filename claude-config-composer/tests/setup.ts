import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterAll, beforeAll, beforeEach } from 'vitest';

export const TEST_TEMP_DIR = path.join(os.tmpdir(), 'claude-config-test');

// Global test setup
beforeAll(async () => {
  // Ensure CLI is built before running tests
  const { execSync } = require('child_process');
  const cliPath = path.resolve(__dirname, '../dist/cli.js');

  if (!require('fs').existsSync(cliPath)) {
    console.log('Building CLI for tests...');
    execSync('npm run build', {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
    });
  }

  // Create temp directory for tests
  await fs.mkdir(TEST_TEMP_DIR, { recursive: true });
});

// No global cleanup in beforeEach to avoid conflicts in parallel tests
// Each test should use unique directories instead

// Global test cleanup
afterAll(async () => {
  // Clean up temp directories
  try {
    await fs.rm(TEST_TEMP_DIR, { recursive: true, force: true });
  } catch (error) {
    // Ignore cleanup errors
  }
});
