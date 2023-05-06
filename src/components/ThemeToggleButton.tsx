import React, { useEffect, useState } from 'react'
import { IoSunny, IoMoon } from 'react-icons/io5/index.js'

// 定义所有的主题
const themes = ['light', 'dark']

export default function ThemeToggle() {
    // 定义两个 state，一个用于标记是否 mounted，一个用于存储当前主题
    const [isMounted, setIsMounted] = useState(false)
    /*
     * 检查是否在 SSR 环境中，如果不是则尝试从本地存储中获取主题设置，
     * 如果不存在则根据浏览器的 prefers-color-scheme 设置来决定默认主题
     */
    const [theme, setTheme] = useState(() => {
        /*
         * SSR 环境下返回 undefined
         * SSR（Server-Side Rendering，服务器端渲染）是指在服务器端将
         * React 组件渲染成 HTML 字符串，然后将其发送到客户端进行展示。
         * 相比于传统的 SPA（Single Page Application，单页面应用）模式，
         * 在 SSR 中，页面内容可以在服务器端被处理成完整的 HTML 文档，
         * 这使得搜索引擎可以更好地理解和索引页面的内容，同时也可以提高页面的加载速度和用户体验。
         * 在 SSR 环境中，React 组件在服务器端被渲染成 HTML 字符串，
         * 然后通过 HTTP 协议发送给客户端，客户端再将其转换为真实的页面进行展示。
         * 与 SPA 不同，SSR 需要依赖服务器的性能来处理和渲染组件，
         * 因此在某些情况下可能会对服务器产生较大的压力。此外，在 SSR 环境中，
         * 一些浏览器端的特性和 API 可能无法使用，需要通过一些特殊的手段来解决。
         */
        if (import.meta.env.SSR) {
            return undefined
        }
        // 如果本地存储中已有 theme，则返回本地存储的 theme
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme')
        }
        /*
         * 如果浏览器的 prefers-color-scheme 是 dark，则返回 dark
         *
         * prefers-color-scheme 是一个 Media Query，用于检测用户设备的首选颜色方案（light 或 dark）。
         * 浏览器会根据用户的系统设置来确定当前的颜色方案，然后将该信息发送给网页，
         * 使其可以根据用户的设备设置来选择合适的颜色方案。
         * 例如，如果用户的系统设置为 Dark Mode，则浏览器会将 prefers-color-scheme 设置为 dark。
         * 如果用户在浏览器中打开一个网页，而该网页使用了 prefers-color-scheme 进行样式设置，
         * 则浏览器会自动应用与用户首选颜色方案相匹配的样式。
         * 通过 prefers-color-scheme，网页可以根据用户的设备设置自动切换颜色方案，这可以提高用户体验和可用性。
         * 例如，在夜间使用浅色主题可能会造成不适，而使用暗色主题则更为舒适和适宜。
         */
        return window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    })

    /*
     * 切换主题的回调函数，在按钮点击时会被调用。它首先根据当前主题的值来计算出新的主题，
     * 然后调用 setTheme 来更新主题状态，并将新的主题值保存到本地存储中。
     */
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    /*
     * 在主题发生变化时修改根元素的 classList。如果主题为 'light'，
     * 则从根元素的 classList 中删除 'dark'，否则将 'dark' 添加到 classList 中。
     */
    useEffect(() => {
        const root = document.documentElement
        if (theme === 'light') {
            root.classList.remove('dark')
        } else {
            root.classList.add('dark')
        }
    }, [theme])

    /*
     * 用于在组件挂载时标记组件已经 mounted。这是因为在组件挂载之前，
     *无法使用 document.documentElement，所以需要等待组件挂载完成后才能开始操作根元素。
     */
    useEffect(() => {
        setIsMounted(true)
    }, [])

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
        <div className="inline-flex items-center p-[1px] rounded-3xl bg-orange-300 dark:bg-zinc-600">
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
                        className={`${checked ? 'bg-white text-black' : ''
                            } cursor-pointer rounded-3xl p-2`}
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {t === 'light' ? <IoSunny /> : <IoMoon />}
                    </button>
                )
            })}
        </div>
    ) : (
        <div />
    )
}
