// 用于创建一个 Astro 配置对象，可以用来配置 Astro 应用程序的各种选项和插件。
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import image from '@astrojs/image'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  // 网站根地址
  site: 'http://blob.ahogek.com',
  /*
   * 整合插件
   * sitemap：生成站点地图
   * react：支持 React 组件
   * image：支持图片
   * tailwind：支持 Tailwind CSS
   */
  integrations: [sitemap(), react(), image(), tailwind()]
});
