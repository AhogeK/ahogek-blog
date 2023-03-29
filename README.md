# AhogeK Blog
> 这是我通过学习 [@devlife](https://www.youtube.com/@devaslife) 的
> [How to create a 'What I Use' blog with Astro and Tailwind CSS (at a hotel lounge)](https://www.youtube.com/watch?v=3_JE76PKBWE&t=2013s)
> 编写的以 [Astro](doc/ASTRO.md) 为主要框架的个人博客

## 技术点

1. Astro - 静态网站框架
2. Tailwind CSS - CSS 框架
3. React - JS 的以组件概念为基础的 UI 框架
4. Headless UI - React 的 UI 组件库 (无样式设置交互组件)
5. React Icons - React 的图标库

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
