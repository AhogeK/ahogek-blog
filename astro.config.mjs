/**
 * @file Astro 应用程序的配置文件
 * @author AhogeK ahogek@gmail.com
 * @date 2022-01-16
 */
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import image from '@astrojs/image'
import tailwind from '@astrojs/tailwind'
import addClasses from 'rehype-add-classes'

// https://astro.build/config
export default defineConfig({
  // 网站根地址
  site: 'https://blob.ahogek.com',
  // 整合插件
  integrations: [
    // 生成站点地图
    sitemap(),

    // 支持 React 组件
    react(),

    // 支持图片
    image(),

    // 支持 Tailwind CSS
    tailwind()
  ],
  markdown: {
    rehypePlugins: [
      [
        addClasses,
        {
          h1: 'text-4xl font-bold font-mplus',
          h2: 'text-2xl font-bold font-mplus',
          h3: 'text-xl font-bold font-mplus',
          h4: 'text-lg font-bold font-mplus',
          h5: 'font-bold font-mplus',
          h6: 'font-bold font-mplus',
          img: 'border border-slate-300 dark:border-zinc-700 rounded-xl mb-6',
          p: 'mb-6',
          a: 'underline underline-offset-2 hover:text-orange-500 decoration-orange-500',
          ul: 'list-disc'
        }
      ]
    ]
  }
})
