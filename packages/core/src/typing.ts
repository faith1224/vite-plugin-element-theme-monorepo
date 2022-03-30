export type RegOptions =
  | string
  | RegExp
  | (string | RegExp)[]
  | null
  | undefined

export interface ThemeOptions {
  // 主题唯一标识
  code: string
  // 主题sass变量文件路径(路径必须以/开头表示项目根目录)
  themeVarFilePath: string
}

export interface VitePluginOptions {
  include?: RegOptions
  exclude?: RegOptions
  themes?: ThemeOptions[]
  // /**
  //  * @default process.cwd()
  //  * @deprecated 1.2.0 is obsolete
  //  */
  // root?: string
  // libs?: Lib[]
  // resolves?: Lib[]
}

export type LibraryNameChangeCase = ChangeCaseType | ((name: string) => string)

export type ChangeCaseType =
  | 'camelCase'
  | 'capitalCase'
  | 'constantCase'
  | 'dotCase'
  | 'headerCase'
  | 'noCase'
  | 'paramCase'
  | 'pascalCase'
  | 'pathCase'
  | 'sentenceCase'
  | 'snakeCase'
