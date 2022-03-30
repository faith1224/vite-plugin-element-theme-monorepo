import { changeTheme } from 'vite-plugin-element-theme/es/client'
export async function updateDarkTheme(code: string) {
  changeTheme(code)
}
