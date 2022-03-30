import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { resolve } from 'path'
import viteThemePlugin from 'vite-plugin-element-theme'

// import ElementPlusThemePlugin from '@pzy915/vite-plugin-element-plus-theme'
// import fs from 'fs-extra'

// const themeVar = fs.readFileSync('./index.sass').toString()
// console.log('themeVar', themeVar)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteThemePlugin({
      themes: [
        {
          code: 'default',
          themeVarFilePath: 'src/style/index.scss',
        },
        {
          code: 'test',
          themeVarFilePath: 'src/style/test.scss',
        },
      ],
    }),
  ],
  // server: {
  //   watch: {
  //     ignored: ['!**/node_modules/your-package-name/**']
  //   }
  // },
  // resolve: {
  //   // 别名
  //   alias: {
  //     "@": resolve(__dirname, "src"),
  //     sty: resolve(__dirname, "styles"),
  //     pkg: resolve(__dirname, "packages"),
  //   },
  // },
})
