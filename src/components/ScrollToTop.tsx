import React, { useEffect, useState } from 'react'
import { IoArrowUp } from 'react-icons/io5'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const toggleVisibility = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // 当滚动到距离底部 200px 以内时显示按钮
      const scrollBottom = documentHeight - (scrollTop + windowHeight)
      setIsVisible(scrollBottom < 200)
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    toggleVisibility()

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isMounted) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed right-6 bottom-6 z-50
        flex items-center justify-center
        w-12 h-12
        rounded-full
        bg-white/80 hover:bg-white
        dark:bg-zinc-800/80 dark:hover:bg-zinc-700
        text-zinc-600 hover:text-orange-500
        dark:text-zinc-400 dark:hover:text-orange-400
        border border-zinc-200/50 hover:border-orange-300
        dark:border-zinc-700/50 dark:hover:border-orange-500/50
        shadow-lg shadow-zinc-200/50 dark:shadow-black/30
        hover:shadow-xl hover:shadow-orange-200/50 dark:hover:shadow-orange-900/20
        backdrop-blur-md
        transform transition-all duration-300 ease-out
        hover:scale-110 hover:-translate-y-1
        active:scale-95
        cursor-pointer
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
      aria-label='回到顶部'
    >
      <IoArrowUp className='w-5 h-5' />
    </button>
  )
}
