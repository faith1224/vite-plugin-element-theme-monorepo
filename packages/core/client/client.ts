export const globalField = '__VITE_THEME__'
export const styleTagId = '__VITE_PLUGIN_THEME__'
// 主题文件夹目录名
export const THEME_NAME_PATH = '_theme'
export type InjectTo = 'head' | 'body' | 'body-prepend'

export interface SuccCall {
  (): void
}
export interface FailCall {
  (): void
}
export interface GlobalConfig {
  changeTheme: (
    themeKey: string,
    succCall: SuccCall,
    failCall: FailCall,
  ) => void
  appended?: boolean
}

declare global {
  interface Window {
    [globalField]: GlobalConfig
  }
}
;(() => {
  if (!window[globalField]) {
    window[globalField] = {} as any
  }
  setGlobalOptions('changeTheme', changeTheme)
})()

export async function changeTheme(
  themeKey: string,
  succCall?,
  failCall?,
): Promise<void> {
  const tmpThemeKey = themeKey ? themeKey : 'default'
  const styleDom = getStyleDom(styleTagId)
  const url =
    window.location.origin + `/${THEME_NAME_PATH}/` + tmpThemeKey + '.css'
  console.log(1111, url)
  try {
    const cssText = await fetchCss(url)
    appendCssToDom(styleDom, cssText, 'head')
    succCall && succCall()
  } catch (e) {
    console.log(2222, e)
    failCall && failCall()
  }
}

export function getStyleDom(id: string) {
  let style = document.getElementById(id)
  if (!style) {
    style = document.createElement('style')
    style.setAttribute('id', id)
  }
  return style
}

function fetchCss(fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const append = getGlobalOptions('appended')
    if (append) {
      setGlobalOptions('appended', false)
      resolve('')
      return
    }

    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText)
        } else {
          reject(xhr.status)
        }
      }
    }
    xhr.onerror = function (e) {
      reject(e)
    }
    xhr.ontimeout = function (e) {
      reject(e)
    }
    xhr.open('GET', fileName, true)
    xhr.send()
  })
}

export async function appendCssToDom(
  styleDom: HTMLElement,
  cssText: string,
  appendTo: InjectTo = 'body',
) {
  styleDom.innerHTML = cssText
  if (appendTo === 'head') {
    document.head.appendChild(styleDom)
  } else if (appendTo === 'body') {
    document.body.appendChild(styleDom)
  } else if (appendTo === 'body-prepend') {
    const firstChildren = document.body.firstChild
    document.body.insertBefore(styleDom, firstChildren)
  }
}

export function setGlobalOptions<T extends keyof GlobalConfig = any>(
  key: T,
  value: GlobalConfig[T],
) {
  window[globalField][key] = value
}

export function getGlobalOptions<T extends keyof GlobalConfig = any>(
  key: T,
): GlobalConfig[T] {
  return window[globalField][key]
}
