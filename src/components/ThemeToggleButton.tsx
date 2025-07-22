import React, { useEffect, useState } from 'react'
import { IoMoon, IoSunny } from 'react-icons/io5'
import { TbCircleHalf2 } from 'react-icons/tb'

// 定义所有的主题
const themes = ['light', 'dark', 'auto'] as const
type Theme = typeof themes[number]

export default function ThemeToggle() {
  // 定义两个 state，一个用于标记是否 mounted，一个用于存储当前主题
  const [isMounted, setIsMounted] = useState(false)
  /*
   * 检查是否在 SSR 环境中，如果不是则尝试从本地存储中获取主题设置，
   * 如果不存在则根据浏览器的 prefers-color-scheme 设置来决定默认主题
   */
  const [theme, setTheme] = useState(() => {
    if (import.meta.env.SSR) {
      return undefined
    }
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme && themes.includes(storedTheme as Theme)) {
      return storedTheme as Theme
    }
    return 'auto'
  })

  const [systemTheme, setSystemTheme] = useState('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    }
    updateSystemTheme()
    mediaQuery.addEventListener('change', updateSystemTheme)
    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [])

  const resolvedTheme = theme === 'auto' ? systemTheme : theme

  useEffect(() => {
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolvedTheme])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const themeIcons = {
    light: <IoSunny />,
    dark: <IoMoon />,
    auto: <TbCircleHalf2 />
  }

  // 如果组件已经 mounted，渲染一个按钮，否则渲染一个空 div
  return isMounted ? (
    /*
     * inline-flex: 设置 display 属性为 inline-flex，使元素呈现为内联的弹性盒子。
     * items-center: 设置 align-items 属性为 center，使元素的子元素在交叉轴上居中对齐。
     * p-[1px]: 设置 padding 属性为 1px，使元素的内边距为 1px。
     * rounded-3xl: 设置 border-radius 属性为 3xl，使元素的圆角程度较大。
     * bg-orange-300: 设置背景色为 orange-300，使元素的背景色为橙色。
     * dark:bg-zinc-600: 设置 dark 模式下的背景色为 zinc-600，使元素的背景色为灰色。
     */
    <div className='inline-flex items-center p-[1px] rounded-3xl bg-orange-300 dark:bg-zinc-600'>
      {themes.map(t => {
        const checked = t === theme
        return (
          <button
            key={t}
            /*
             * bg-white: 设置背景色为 white，使元素的背景色为白色。
             * text-black: 设置文本颜色为 black，使元素的文本颜色为黑色。
             * cursor-pointer: 设置鼠标指针为 pointer，使元素的鼠标指针呈现为手形。
             * rounded-3xl: 设置 border-radius 属性为 3xl，使元素的圆角程度较大。
             */
            className={`${
              checked ? 'bg-white text-black' : ''
            } cursor-pointer rounded-3xl p-2`}
            onClick={() => handleThemeChange(t)}
            aria-label={`Switch to ${t} theme`}
          >
            {themeIcons[t]}
          </button>
        )
      })}
    </div>
  ) : (
    <div />
  )
}
