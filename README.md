# vite-plugin-element-theme

适用于 vite 项目，用于实现 element-plus 的主题切换

## 适用场景

- 使用 vite 开发的项目
- ui 框架是 element plus
- 有类似主题切换的需求

## 效果演示
![image](https://github.com/faith1224/vite-plugin-element-theme-monorepo/blob/master/packages/web/src/assets/effect.gif)


## 项目演示
项目的packages/web下通过workspace引入了该插件，可以运行项目直接查看效果
```shell
克隆该项目，项目采用的是pnpm的workspace，安装依赖，node版本>=12
pnpm install
pnpm --filter vite-plugin-element-theme-web install
pnpm --filter vite-plugin-element-theme install

然后执行packages/web下的脚本 
pnpm run dev
```
## 使用方式

**主题定制**

- 项目根目录创建`style`文件夹(可以自定义文件夹)
- `style`文件夹下创建主题文件,文件名(不包含后缀)既是`主题唯一标识`.如:`test.scss`
- 主题文件内容大概如下:

```scss
$--colors: (
  'primary': (
    'base': black,
  ),
  'success': (
    'base': #f3d19e,
  ),
  'warning': (
    'base': #c45656,
  ),
  'danger': (
    'base': #73767a,
  ),
  'error': (
    'base': #529b2e,
  ),
  'info': (
    'base': #303133,
  ),
);

// You should use them in scss, because we calculate it by sass.
// comment next lines to use default color
@forward './common/var.scss' with (
  $colors: $--colors,
  $button-padding-horizontal: (
    'default': 80px,
  )
);
```

```shell
# 安装插件
npm i vite-plugin-element-theme -D

> 在vite.config.ts中引入插件
import viteThemePlugin from 'vite-plugin-element-theme'
然后使用该插件
plugins: [
    viteThemePlugin({
      themes: [
        {
          // 主题名称，后续在动态切换主题是会用到
          code: 'default',
          // 对应的sass文件路径
          themeVarFilePath: 'src/style/index.scss',
        },
        {
          code: 'test',
          themeVarFilePath: 'src/style/test.scss',
        },
      ],
    }),
  ],

# 通过命令运行项目
npm run dev

# 运行成功之后，引入element-plus组件

```

**主题切换**

```js
# 在项目中需要切换主题的文件中引入
import { changeTheme } from 'vite-plugin-element-theme/es/client.js'
该函数有3个参数，其中themeKey为主题名称必填，succCall为切换成功的回调函数，failCall为切换失败的回调函数
# 使用
function handleClick() {
  changeTheme('default')
}
```

## 实现原理

该插件的主要思路借鉴项目 https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40pzy915%2Fvite-plugin-element-plus-theme 我自己做了部分修改，该变了主题切换的方式，生产环境下实现自动按需打包

看官方有个示例项目, 可以在开发时调整主题, 修改原理是, 根据 sass 变量值可以被覆盖的的特点, 进行主题变量值覆盖. https://github.com/element-plus/unplugin-element-plus/blob/main/examples/vite/src/styles/element/index.scss

插件的实现思路, 也是使用 sass 变量值覆盖的特点.

1. 读取用户配置的主题变量覆盖文件的内容
2. 读取`/项目根目录/node_modules/element-plus/theme-chalk/src/index.scss`文件内容
3. 将 **步骤 1** 中读取的内容,追加到 **步骤 2** 的内容之前, 进行 sass 变量覆盖.
4. 使用 sass 编译最终的 sass 文件内容, 生成对应主题的 css
5. 项目中进行主题切换时, 引入不同的主题 css 即可

上面是主题样式全量打包的实现思路, 按需打包的实现思路也类似

## 特点

- 支持使用原生 sass 语法进行样式变量定制
- 次级颜色自动计算
- 开发环境全量打包，生产环境按需打包

## 参考项目
[vite-plugin-element-plus-theme](https://juejin.cn/post/7031404130128101384)
[vite-plugin-style-import](https://github.com/anncwb/vite-plugin-style-import)
