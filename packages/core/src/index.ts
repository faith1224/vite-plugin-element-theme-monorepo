import type { Plugin, ResolvedConfig } from 'vite'
import type { ImportSpecifier } from 'es-module-lexer'
import {
  ThemeOptions,
  VitePluginOptions,
  LibraryNameChangeCase,
  ChangeCaseType,
} from './typing'

import { CLIENT_PUBLIC_PATH } from './constants'

import { normalizePath } from 'vite'
import { init, parse } from 'es-module-lexer'
import { createFilter } from '@rollup/pluginutils'
import * as changeCase from 'change-case'
import paths from 'path'
import path from 'pathe'
import fs from 'fs-extra'
import serveStatic from 'serve-static'

const sass = require('sass')
const postcss = require('postcss')
const cssnano = require('cssnano')
// import { extractVariable } from "./utils";
// import consola from 'consola'

// consola.wrapConsole()
const asRE = /\s+as\s+\w+,?/g

export default function viteThemePlugin(options: VitePluginOptions): Plugin {
  let config: ResolvedConfig
  let isServer = false
  const importName = new Set<string>()
  const {
    include = ['**/*.vue', '**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'],
    exclude = 'node_modules/**',
    themes = [],
  } = options
  // 获取项目根目录
  const projectRootDir = process.cwd()
  // 插件的css文件存放临时目录
  const pluginTempDir = path.resolve(
    path.join(projectRootDir, 'node_modules', '.plugin-theme'),
  )
  // element-plus的scss文件所在目录
  const elementPlusThemeDir = path.resolve(
    path.join(
      projectRootDir,
      'node_modules',
      'element-plus',
      'theme-chalk',
      'src',
    ),
  )

  // 主题文件夹目录名
  const themeDirName = '_theme'

  const filter = createFilter(include, exclude)
  return {
    name: 'vite-plugin-element-theme',
    enforce: 'post',
    // apply: 'serve',
    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig
      isServer = resolvedConfig.command === 'serve'
    },
    /**
     * vite独有钩子. 这里用于在开发时根据配置生成主题css文件
     * @param server
     */
    configureServer(server) {
      const compList = []
      const pluginTmpThemeDir = path.resolve(
        path.join(pluginTempDir, themeDirName),
      )
      // 如果相关目录不存在创建相关目录
      !fs.existsSync(pluginTempDir) && fs.mkdirSync(pluginTempDir)
      !fs.existsSync(pluginTmpThemeDir) && fs.mkdirSync(pluginTmpThemeDir)

      for (const themeConfig of themes) {
        compileSass2Css(
          projectRootDir,
          themeConfig,
          elementPlusThemeDir,
          compList,
          `${pluginTempDir}/${themeDirName}`,
        )
      }
      server.middlewares.use(serveStatic(pluginTempDir))
    },

    async transform(code, id) {
      // console.log()
      if (!code || !filter(id)) {
        return null
      }
      await init

      let imports: readonly ImportSpecifier[] = []
      try {
        imports = parse(code)[0]
      } catch (e) {
        // consola.error(e)
      }
      if (!imports.length) {
        return null
      }
      for (let index = 0; index < imports.length; index++) {
        const { n, se, ss } = imports[index]
        if (!n) continue

        const importStr = code.slice(ss, se)
        const importVariables = transformImportVar(importStr)
        const nameArr = transformComponentName(importVariables)
        for (let index = 0; index < nameArr.length; index++) {
          importName.add(nameArr[index])
        }
      }

      return null
    },
    transformIndexHtml(html) {
      // 如果在build模式模式下，直接返回html
      if (!isServer) {
        return html
      }
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              src: paths.posix.join(CLIENT_PUBLIC_PATH),
            },
            injectTo: 'head',
          },
        ],
      }
    },
    generateBundle() {
      const compList = Array.from(importName).map((item) => {
        return item.replace('el-', '')
      })
      if (options && options.themes && options.themes.length > 0) {
        const { outDir } = config.build
        // 获取打包文件的物理输出目录
        const outputPath = outDir
        // 在这个目录指定一个theme文件夹
        const themeOutputPath = normalizePath(
          path.resolve(path.join(outputPath, themeDirName)),
        )
        !fs.existsSync(themeOutputPath) && fs.mkdirSync(themeOutputPath)
        for (const themeConfig of themes) {
          compileSass2Css(
            projectRootDir,
            themeConfig,
            elementPlusThemeDir,
            compList,
            themeOutputPath,
            true,
          )
        }
      }
    },
  }
}

// 提取导入的变量
export function transformImportVar(importStr: string) {
  const reg = /element-plus/
  if (!importStr || !reg.test(importStr)) {
    return []
  }
  // 将import替换为export，删除as选项
  const exportStr = importStr.replace('import', 'export').replace(asRE, ',')
  let importVariables: readonly string[] = []
  try {
    importVariables = parse(exportStr)[1]
  } catch (error) {
    console.log(error)
  }
  return importVariables
}

// export function filterImportVariables() {}

/**
 * 将sass内容编译为css内容
 * @param projectRootDir 项目根目录的绝对路径
 * @param themeConfig 主题配置信息
 * @param elementPlusThemeDir element plus样式scss所在根目录
 * @param compList 按需打包的组件样式(为空或null则进行全量打包)
 * @param cssDestDir css文件存放目录
 * @param compress 是否将css进行压缩. 默认:false
 */

function compileSass2Css(
  projectRootDir: string,
  themeConfig: ThemeOptions,
  elementPlusThemeDir: string,
  compList: string[],
  cssDestDir: string,
  compress = false,
) {
  const themeVar = fs
    .readFileSync(`${projectRootDir}/${themeConfig.themeVarFilePath}`, 'utf-8')
    .toString()

  let themeStyleContent = `
    ${themeVar}
      `
  if (compList && compList.length > 0) {
    // 样式按需打包
    for (const compName of compList) {
      themeStyleContent += `
          @use './${compName}.scss';
          `
    }
  } else {
    // 样式全量打包
    themeStyleContent += `
          @use './index.scss';
          `
  }
  themeStyleContent = sass
    .renderSync({
      data: themeStyleContent,
      includePaths: [elementPlusThemeDir],
    })
    .css.toString()
  const destFileFullPath = `${cssDestDir}/${themeConfig.code}.css`
  if (compress) {
    postcss([cssnano])
      .process(themeStyleContent, { from: destFileFullPath })
      .then((result: any) => {
        fs.writeFileSync(destFileFullPath, result.css)
      })
  } else {
    fs.writeFileSync(destFileFullPath, themeStyleContent)
  }
}

function transformComponentName(importVariables: readonly string[]) {
  const set = new Set<string>()
  for (let index = 0; index < importVariables.length; index++) {
    const name = getChangeCaseFileName(importVariables[index], 'paramCase')
    set.add(name)
  }
  return Array.from(set)
}

// File name conversion style
export function getChangeCaseFileName(
  importedName: string,
  libraryNameChangeCase: LibraryNameChangeCase,
) {
  try {
    return changeCase[libraryNameChangeCase as ChangeCaseType](importedName)
  } catch (error) {
    return importedName
  }
}
