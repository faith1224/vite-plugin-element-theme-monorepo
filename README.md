# vite-plugin-element-theme

适用于 vite 项目，用于实现 element-plus 的主题切换

## 适用场景

- 使用 vite 开发的项目
- ui 框架是 element plus
- 有类似主题切换的需求

## 效果演示
![image](https://github.com/faith1224/vite-plugin-element-theme-monorepo/blob/master/packages/web/src/assets/effect.gif)

## 快速创建一个主题切换的示例项目


```shell
# 安装插件
npm i vite-plugin-element-theme -D

# 通过vite构建一个vue3的基础项目，参考官网
https://v3.cn.vuejs.org/guide/installation.html#%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7-cli

# 在项目中创建style文件夹，并且写入
> element-plus项目模板: 在vue3-element-plus模板基础上, 再加入主题切换功能

# 使用你喜欢的编辑器打开项目, 通过如下命令运行项目
npm run dev

# 运行成功之后，打开浏览
http://localhost:3000/demo/hello

# 选择 `查看ElementPlus示例`

# 点击 `切换到定制主题` 或 `切换回默认主题` 查看主题切换效果
```

## 使用方式

**主题定制**

- 项目根目录创建`themes`文件夹
- `themes`文件夹下创建主题文件,文件名(不包含后缀)既是`主题唯一标识`.如:`custom-theme.scss`
- 主题文件内容大概如下:

```scss
@forward "./common/var.scss" with (
  $colors: (
    "primary": (
      "base": #003261,
    ),
    "success": (
      "base": #21ba45,
    ),
    "warning": (
      "base": #f2711c,
    ),
    "danger": (
      "base": #db2828,
    ),
    "error": (
      "base": #db2828,
    ),
    "info": (
      "base": #42b8dd,
    ),
  ),
  $button-padding-horizontal: (
    "default": 80px,
  )
);
```

**主题切换**

```js
const codeTheme = "主题唯一标识";
const sucCall = () => {
  // TODO 实现对根节点的rerender
};
const failCall = () => {
  // TODO 实现在主题文件加载失败时的处理
};
// changeTheme 函数由主题插件自动注入
window.changeTheme(codeTheme, sucCall, failCall);
```

## 实现原理

看官方有个示例项目, 可以在开发时调整主题, 修改原理是, 根据 sass 变量值可以被覆盖的的特点, 进行主题变量值覆盖. https://github.com/element-plus/unplugin-element-plus/blob/main/examples/vite/src/styles/element/index.scss

我这个插件的实现思路, 也是使用 sass 变量值覆盖的特点.

1. 读取用户配置的主题变量覆盖文件的内容
2. 读取`/项目根目录/node_modules/element-plus/theme-chalk/src/index.scss`文件内容
3. 将 **步骤 1** 中读取的内容,追加到 **步骤 2** 的内容之前, 进行 sass 变量覆盖.
4. 使用 sass 编译最终的 sass 文件内容, 生成对应主题的 css
5. 项目中进行主题切换时, 引入不同的主题 css 即可

上面是主题样式全量打包的实现思路, 按需打包的实现思路也类似

## 特点

- 支持使用原生 sass 语法进行样式变量定制
- 次级颜色自动计算
- 根据配置的不同, 主题样式支持按需和全量两种方式打包

## 注意点

不知道从 element-plus 的哪个版本开始，element-plus 内部使用主题变量的方式已经改变，必须在主题样式引入之成功后，对根节点进行一次 rerender 才能真正实现主题切换,sucCall 的回调函数就是用来给用户自行实现根节点的 rerender 的
