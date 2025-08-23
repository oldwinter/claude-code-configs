/**
 * Helper to load ESM-only packages in CommonJS context
 * This works around TypeScript's transformation of dynamic imports
 */
export async function loadEsmModule<T = any>(moduleName: string): Promise<T> {
  // Use Function constructor to prevent TypeScript from transforming the import
  const dynamicImport = new Function('moduleName', 'return import(moduleName)');
  const module = await dynamicImport(moduleName);
  return module.default || module;
}