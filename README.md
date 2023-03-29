# AhogeK Blog
> 这是我通过学习 [@devlife](https://www.youtube.com/@devaslife) 的
> [How to create a 'What I Use' blog with Astro and Tailwind CSS (at a hotel lounge)](https://www.youtube.com/watch?v=3_JE76PKBWE&t=2013s)
> 编写的以 [Astro](doc/ASTRO.md) 为主要框架的个人博客

## 技术点

| 名称          | 描述                         |
|:------------|:---------------------------|
| Astro       | 静态网站框架                     |
| Tailwind    | CSS 框架                     |
| React       | JS 的以组件概念为基础的 UI 框架        |
| Headless UI | React 的 UI 组件库 (无样式设置交互组件) |
| React Icons | React 的图标库                 |


## 项目结构

```
.
├── README.md             # 项目的说明文档
├── astro.config.mjs      # 使用 Astro 的配置文件
├── package.json          # 项目的依赖和脚本配置
├── public                # 存放静态资源的目录，其中包括站点的图标和占位图
├── src                   # 存放项目的源代码的目录
│ ├── components          # 存放可重用的 UI 组件的目录
│ ├── config.ts           # 存放项目的配置文件
│ ├── env.d.ts            # 存放类型声明文件，用于描述环境变量的类型
│ ├── layouts             # 存放页面布局组件的目录
│ ├── pages               # 存放页面组件的目录
│ └── styles              # 存放项目的 CSS 样式文件的目录
├── tailwind.config.cjs   # 使用 Tailwind CSS 的配置文件
├── tsconfig.json         # 存放 TypeScript 的编译选项的配置文件
└── yarn.lock             # 存放 Yarn 锁定文件，用于确保项目的依赖版本的稳定性
```

## 什么是 Astro 框架

Astro 是一种 Web 开发框架，它使用了现代前端技术栈，如 React、Vue 和 Svelte。
它可以帮助开发人员更轻松地构建高性能、易于维护的 Web 应用程序和静态站点。Astro
还提供了许多有用的功能和集成，如预渲染、动态数据、路由和布局系统，可以帮助开发人员
更轻松地构建现代化的 Web 应用程序和静态站点。

* [Astro 官网](https://astro.build/)

## MDX

MDX 是一种可以在 Markdown 文件中嵌入 JSX 代码的格式。它可以让我们在 Markdown
文件中使用 React 组件，从而可以在 Markdown 文件中使用 JSX 代码。

* [MDX 相关文档](https://docs.astro.build/en/guides/markdown-content/)

**但本项目中暂不使用该技术，相关依赖是被移除的，默认生成的 Astro 默认是带着 MDX 的依赖**

## Prettier

Prettier 是一个代码格式化工具，它可以帮助我们统一代码的风格，从而让代码更加易于阅读和维护。

* [Prettier 官网](https://prettier.io/)

### 本项目中的配置

[.prettierrc](.prettierrc)

```prettier
# arrowParens: 'avoid'：表示如果箭头函数只有一个参数，并且没有默认值，那么不使用括号；
# 否则使用括号。例如，x => x * 2 不使用括号，而 (x, y) => x + y 使用括号。
arrowParens: 'avoid'

# singleQuote: true：定义是否使用单引号作为字符串的标识符。如果该属性为 true，
# 则使用单引号作为字符串的标识符，例如：const str = 'hello world';。
# 否则使用双引号作为字符串的标识符，例如：const str = "hello world";。
singleQuote: true

# bracketSpacing: true：定义是否在对象字面量的属性之间使用空格。如果该属性为 true，
# 则在对象字面量的属性之间使用空格, 例如：{foo: 'bar'}。否则不使用空格，例如：{ foo: 'bar' }。
bracketSpacing: true

# endOfLine: 'lf'：定义换行符的类型。如果该属性为 'lf'，则使用 LF 换行符。否则使用 CRLF 换行符。
endOfLine: 'lf'

# semi: false：定义是否在语句结尾使用分号。如果该属性为 false，则不使用分号，
# 例如：console.log('hello world')。
# 否则使用分号，例如：console.log('hello world');。
semi: false

tabWidth: 2

# trailingComma: 'none'：定义是否在多行结尾添加逗号。如果该属性为 'none'，则不添加逗号，
# 例如：const arr = [1, 2, 3]。否则在多行结尾添加逗号，例如：const arr = [1, 2, 3,]。
trailingComma: 'none'
```

## ESLint

ESLint 是一个代码检查工具，它可以帮助我们检查代码中的错误和不规范的地方，从而让代码更加易于阅读和维护。

[.eslintrc.yml](.eslintrc.yml)

```yml
# 这个配置文件的作用是让 ESLint 可以对 TypeScript 代码和 Astro 组件文件进行语法检查，
# 并使用 Astro 推荐的代码规范来对代码进行格式化。通过配置 ESLint，可以帮助开发人员
# 在开发过程中更加规范地编写代码，提高代码的质量和可维护性。
root: true
parser: '@typescript-eslint/parser' # 使用 @typescript-eslint/parser 解析器解析 TypeScript 代码。
extends:
  - plugin:astro/recommended # 扩展了名为 astro/recommended 的推荐规则集。
overrides:
  - files:
      - "*.astro" # 对 Astro 组件文件（后缀名为 .astro）进行特殊处理。
    parser: astro-eslint-parser # 使用 astro-eslint-parser 解析器解析 Astro 组件文件。
    parserOptions:
      # 使用 @typescript-eslint/parser 解析器解析 TypeScript 代码。
      parser: "@typescript-eslint/parser"
      extraFileExtensions:
        # 允许使用 .astro 扩展名的文件，以便 ESLint 在 Astro 组件文件中使用 
        # @typescript-eslint/parser 解析 TypeScript 代码。 
        - ".astro" 
```

* [ESLint 官网](https://eslint.org/)

### 关于 ESLint 的相关指令

* `yarn lint`：检查代码中的错误和不规范的地方。
* `yarn lint:fix`：检查代码中的错误和不规范的地方，并尝试自动修复。
* `yarn lint:check`：检查代码中的错误和不规范的地方，并将检查结果输出到控制台。
* `yarn lint:watch`：检查代码中的错误和不规范的地方，并在检查到代码有变化时重新检查。

## TypeScript

TypeScript 是一种由微软开发的自由和开源的编程语言。它是 JavaScript 的一个超集，
并且本质上向这门语言添加了可选的静态类型和基于类的面向对象编程。

* [TypeScript 官网](https://www.typescriptlang.org/)

[tsconfig.json](tsconfig.json)

```json5
{
  /*
   * 继承了另一个 TypeScript 配置文件 astro/tsconfigs/strict，
   * 这个配置文件中定义了一些常用的严格编译选项，如开启 strict 模式、
   * 启用 ES6 模块等，可以帮助开发人员编写更加安全和规范的 TypeScript 代码
   */
  "extends": "astro/tsconfigs/strict",
  /* 表示编译器的选项和特性 */
  "compilerOptions": {
    /* 使用哪种 JSX 编译器。在这里设置为 react，表示使用 React 的 JSX 编译器。*/
    "jsx": "react",
    /*
     * 要包含在编译中的 TypeScript 类型声明文件。在这里，使用了 Astro 内置的 
     * @astrojs/image/client 类型声明文件，表示要在编译中包含该文件，
     * 以便在 Astro 项目中使用 @astrojs/image 插件时能够获得类型检查和提示。
     */
    "types": [
      "@astrojs/image/client"
    ]
  }
}
```

### TS 的常用指令

* `yarn tsc`：编译 TypeScript 代码。
* `yarn tsc:watch`：编译 TypeScript 代码，并在检查到代码有变化时重新编译。
* `yarn tsc:check`：编译 TypeScript 代码，并将编译结果输出到控制台。
* `yarn tsc:clean`：清除编译后的 JavaScript 代码。
* `yarn tsc:build`：编译 TypeScript 代码，并清除编译后的 JavaScript 代码。
