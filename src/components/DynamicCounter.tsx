import React, { useEffect, useState } from 'react'

interface CounterConfig {
  name?: string;
  theme?: string;
  padding?: string;
  offset?: string;
  align?: string;
  scale?: string;
  pixelated?: string;
}

const socketUrl = import.meta.env.PUBLIC_WEBSOCKET_URL + '/visit-count'
const COUNTER_BASE_URL = 'https://count.getloli.com'

const DynamicCounter: React.FC<CounterConfig> = ({
                                                   name = 'ahogek',
                                                   theme = 'rule34',
                                                   padding = '7',
                                                   offset = '0',
                                                   align = 'top',
                                                   scale = '1',
                                                   pixelated = '1'
                                                 }) => {
  const [count, setCount] = useState(0)
  const [counterUrl, setCounterUrl] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('light')

  // websocket部分，只负责获取count
  useEffect(() => {
    let ws: WebSocket | null = null
    let timer: NodeJS.Timeout | null = null

    const connect = () => {
      ws = new WebSocket(socketUrl)
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data && typeof data.count === 'number') {
            setCount(data.count)
          }
        } catch {
        }
      }
      ws.onclose = () => {
        setIsLoading(true)
        timer = setTimeout(connect, 5000)
      }
      ws.onerror = () => {
        ws?.close()
      }
    }
    connect()

    return () => {
      if (ws) {
        ws.onclose = null
        ws.close()
      }
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [])

  // 只维护一个主题状态
  useEffect(() => {
    const getThemeMode = () =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    setThemeMode(getThemeMode())
    setIsMounted(true)

    const observer = new MutationObserver(() => {
      setThemeMode(getThemeMode())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  // 只用本地唯一 themeMode 和 count 构建URL
  useEffect(() => {
    const params = new URLSearchParams({
      name,
      theme,
      padding,
      offset,
      align,
      scale,
      pixelated,
      darkmode: themeMode === 'dark' ? '1' : '0',
      num: count.toString()
    })
    setCounterUrl(`${COUNTER_BASE_URL}/@${name}?${params.toString()}`)
    setIsLoading(true)
  }, [count, themeMode, name, theme, padding, offset, align, scale, pixelated])

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setIsLoading(false)
    const img = e.target as HTMLImageElement
    img.src =
      'data:image/svg+xml;base64,' +
      btoa(`
      <svg width='200' height='50' xmlns='http://www.w3.org/2000/svg'>
        <rect width='200' height='50' fill='#f3f4f6' stroke='#d1d5db'/>
        <text x='100' y='30' text-anchor='middle' font-size='12' fill='#6b7280'>
          Counter Service Offline
        </text>
      </svg>
    `)
  }

  if (!isMounted) {
    return (
      <div className='flex justify-center'>
        <div className='w-48 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded' />
      </div>
    )
  }

  return (
    <div className='flex justify-center relative'>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded'>
          <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
        </div>
      )}
      {counterUrl && (
        <img
          src={counterUrl}
          alt={`${name} 的访问计数器`}
          className={`max-w-full h-auto transition-all duration-200 ${
            isLoading ? 'opacity-50' : 'opacity-100'
          } hover:scale-105`}
          loading='eager'
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            maxHeight: '60px',
            objectFit: 'contain'
          }}
        />
      )}
    </div>
  )
}

export default DynamicCounter