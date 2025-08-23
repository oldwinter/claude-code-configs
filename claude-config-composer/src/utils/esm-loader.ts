/**
 * Helper to load ESM-only packages in CommonJS context
 * This works around TypeScript's transformation of dynamic imports
 */
export async function loadEsmModule<T = any>(moduleName: string): Promise<T> {
  try {
    // Use eval to preserve the import() expression
    // This prevents TypeScript/bundlers from transforming it
    // We escape single quotes to prevent injection
    const module = await eval(`import('${moduleName.replace(/'/g, "\\'")}')`);
    return module.default || module;
  } catch (error: any) {
    // If import fails, provide helpful error message
    throw new Error(
      `Failed to load ESM module '${moduleName}': ${error?.message || 'Unknown error'}`
    );
  }
}