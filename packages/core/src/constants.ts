import path from 'path'
import { normalizePath } from 'vite'

// client存放目录
export const VITE_PLUGIN_THEME_CLIENT_ENTRY = normalizePath(
  path.resolve(process.cwd(), 'node_modules/vite-plugin-element-theme/es/'),
)

export const CLIENT_PUBLIC_PATH = `/${VITE_PLUGIN_THEME_CLIENT_ENTRY}/client.js`

// 获取项目根目录
export const PROJECT_ROOT_DIR = process.cwd()
// 插件的css文件存放临时目录
export const PLUGIN_TEMP_DIR = normalizePath(
  path.resolve(path.join(PROJECT_ROOT_DIR, 'node_modules', '.plugin-theme')),
)
// element-plus的scss文件所在目录
export const ELEMENT_PLUS_THEME_DIR = normalizePath(
  path.resolve(
    path.join(
      PROJECT_ROOT_DIR,
      'node_modules',
      'element-plus',
      'theme-chalk',
      'src',
    ),
  ),
)
