import path from 'pathe'
import { normalizePath } from 'vite'
import { createRequire } from 'module'

export function resolveNodeModules(libName: string, ...dir: string[]) {
  const esRequire = createRequire(import.meta.url)
  let modulePath = ''
  try {
    modulePath = normalizePath(esRequire.resolve(libName))
  } catch (error) {
    modulePath = normalizePath(require.resolve(libName))
  }
  const lastIndex = modulePath.lastIndexOf(libName)
  return normalizePath(path.resolve(modulePath.substring(0, lastIndex), ...dir))
}
