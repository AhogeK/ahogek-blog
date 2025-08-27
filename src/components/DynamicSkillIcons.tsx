import React, { useEffect, useState } from 'react'

// 定义组件的 props 类型
interface SkillIconsProps {
  skills: string;      // 必传的技能列表，例如 'react,ts,tailwind'
  perLine?: string;    // 可选，每行显示的图标数量
}

const SKILL_ICONS_BASE_URL = 'https://skillicons.dev/icons'

const DynamicSkillIcons: React.FC<SkillIconsProps> = ({ skills, perLine }) => {
  // isMounted 状态，用于确保只在客户端渲染，避免 SSR 问题
  const [isMounted, setIsMounted] = useState(false)
  // themeMode 状态，用于存储当前的主题 ('light' 或 'dark')
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light')
  // imageUrl 状态，存储最终生成的图片 URL
  const [imageUrl, setImageUrl] = useState('')

  // 这个 useEffect 负责在客户端挂载后，检测并监听全局主题变化
  useEffect(() => {
    // 定义一个函数来获取当前主题
    const getThemeMode = () =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'

    // 首次挂载时设置主题和 isMounted 状态
    setThemeMode(getThemeMode())
    setIsMounted(true)

    // 使用 MutationObserver 监听 <html> 元素 class 属性的变化
    const observer = new MutationObserver(() => {
      setThemeMode(getThemeMode())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // 组件卸载时，断开观察者
    return () => {
      observer.disconnect()
    }
  }, []) // 空依赖数组，确保这个 effect 只运行一次

  // 这个 useEffect 会在 props (skills, perLine) 或 themeMode 变化时重新运行
  useEffect(() => {
    // 确保 skills 存在才构建 URL
    if (skills) {
      const params = new URLSearchParams({
        i: skills,
        theme: themeMode // 关键：使用动态的 themeMode
      })

      // 如果 perLine prop 存在，则添加到 URL 参数中
      if (perLine) {
        params.append('perline', perLine)
      }

      setImageUrl(`${SKILL_ICONS_BASE_URL}?${params.toString()}`)
    }
  }, [skills, perLine, themeMode]) // 依赖项：当这些值变化时，URL 会自动更新

  // 在客户端挂载完成前，可以显示一个占位符，避免内容闪烁
  if (!isMounted) {
    return <div className='w-full h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md'
                style={{ maxWidth: '300px' }} />
  }

  // 渲染最终的图片
  return (
    <a href='https://github.com/tandpfun/skill-icons' target='_blank' rel='noopener noreferrer'>
      {imageUrl && (
        <img
          src={imageUrl}
          alt='My Skill Icons'
          loading='lazy' // 使用懒加载优化性能
          className='h-7 w-auto'
        />
      )}
    </a>
  )
}

export default DynamicSkillIcons