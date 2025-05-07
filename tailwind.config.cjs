/**
 * Tailwind CSS 的配置文件，定义了如何定制 Tailwind CSS 的样式
 *
 * content：指定哪些文件包含了需要构建样式的样式代码。在这个例子中，
 * 它指定了 src 目录下的所有 .astro、.html、.js、.jsx、.md、.mdx、
 * .svelte、.ts、.tsx、.vue 文件都包含需要构建的样式代码。
 * darkMode：指定深色模式的样式变化方式。在这个例子中，它设置为 "class"，
 * 表示使用一个 CSS 类来切换深色模式的样式。
 * theme：定义样式主题相关的配置。在这个例子中，它包括了一个 extend 属性，
 * 用来扩展已有的样式主题。其中，mplus 属性定义了一个自定义的字体族，
 * 包括三个字体名称，分别为 'M PLUS Rounded 1c'、'Verdana'、'sans-serif'。
 * 这样，我们就可以在样式中使用这个字体族了。
 * plugins：用于定义 Tailwind CSS 插件相关的配置，例如自定义样式、
 * 响应式变化等。
 *
 * @type {import('tailwindcss').Config}
 **/
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'mplus': ['M PLUS Rounded 1c', 'Verdana', 'sans-serif']
      },
      mplus: [
        'M PLUS Rounded 1c',
        'Verdana',
        'sans-serif'
      ]
    }
  },
  plugins: [
    require('@headlessui/tailwindcss')
  ]
}
