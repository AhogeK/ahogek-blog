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
  ]
})
