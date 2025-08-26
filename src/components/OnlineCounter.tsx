import React, { useEffect, useState } from 'react'

const socketUrl = import.meta.env.PUBLIC_WEBSOCKET_URL + '/online'

const OnlineCounter: React.FC = () => {
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    let ws: WebSocket | null = null
    const connect = () => {
      ws = new WebSocket(socketUrl)
      ws.onopen = () => {
        console.log('成功连接到在线人数统计服务器')
      }
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data && typeof data.count === 'number') {
            setUserCount(data.count)
          }
        } catch (error) {
          console.error('解析消息失败:', error)
        }
      }
      ws.onclose = () => {
        console.log('与服务器的连接已断开，将在 5 秒后尝试重连...')
        setUserCount(0)
        setTimeout(connect, 5000)
      }
      ws.onerror = (error) => {
        console.error('WebSocket 发生错误:', error)
        ws?.close()
      }
    }
    connect()

    return () => {
      if (ws) {
        ws.onclose = null
        ws.close()
      }
    }
  }, [])

  return (
    <div className='online-counter-nav'>
      <div className='green-dot'></div>
      <span>{userCount}</span>
    </div>
  )
}

export default OnlineCounter