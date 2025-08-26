import React, { useEffect, useState } from 'react'

interface CounterConfig {
  name?: string
  theme?: string
  padding?: string
  offset?: string
  align?: string
  scale?: string
  pixelated?: string
  darkmode?: string | boolean
}

const socketUrl = import.meta.env.PUBLIC_WEBSOCKET_URL + '/visit-count'

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
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    let ws: WebSocket | null = null
    let timer: NodeJS.Timeout | null = null

    const connect = () => {
      ws = new WebSocket(socketUrl)
      ws.onopen = () => {
        setIsLoading(false)
      }
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

  if (!isMounted) {
    return (
      <div className='flex justify-center'>
        <div className='w-48 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded' />
      </div>
    )
  }

  const COUNTER_BASE_URL = 'https://count.getloli.com'
  // 新增 num 字段作为实时 socket 计数
  const params = new URLSearchParams({
    name: name,
    theme,
    padding,
    offset,
    align,
    scale,
    pixelated,
    darkmode: '0',
    num: count.toString()
  })
  const counterUrl = `${COUNTER_BASE_URL}/@${name}?${params.toString()}`

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