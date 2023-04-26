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

export default defineConfig({
  site: 'https://blob.ahogek.com', // 网站根地址
  integrations: [
    // 整合插件
    sitemap(), // 生成站点地图
    react(), // 支持 React 组件
    image(), // 支持图片
    tailwind() // 支持 Tailwind CSS
  ]
})
