import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Hls from 'hls.js'
import { BsVolumeMute, BsVolumeUp } from 'react-icons/bs'

const Video: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true)
  const [showVolume, setShowVolume] = useState(false)
  // 添加标记，用于跟踪是否已处理触摸事件
  const touchHandled = useRef(false)

  // 使用 ref 管理计时器，避免状态更新问题
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const videoList = useMemo(() => {
    const baseUrl = import.meta.env.PUBLIC_VIDEO_BASE_URL || 'https://ahogek.com'

    const videos = [
      '/uploads/video/20231201/cherry_blossom_tree_artistic_confession/cherry_blossom_tree_artistic_confession.m3u8',
      '/uploads/video/20231029/one-more-time-one-more-chance/one-more-time-one-more-chance.m3u8',
      '/uploads/video/20250512/i_want_to_love_you_endlessly_and_forever/i_want_to_love_you_endlessly_and_forever.m3u8',
      '/uploads/video/20250512/the_process_of_falling_in_love_is_also_a_form_of_love/the_process_of_falling_in_love_is_also_a_form_of_love.m3u8',
      '/uploads/video/20250707/lelouchs_most_ardent_confession/lelouchs_most_ardent_confession.m3u8'
    ]

    return videos.map(path => `${baseUrl}${path}`)
  }, [])

  // 保存 Hls 实例的引用
  const hlsInstance = useRef<Hls | null>(null)

  // 简化的计时器管理函数
  const startHidingTimer = useCallback(() => {
    // 清除旧计时器
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // 显示图标
    setShowVolume(true)

    // 创建新计时器
    timerRef.current = setTimeout(() => {
      setShowVolume(false)
      timerRef.current = null
    }, 3000)
  }, [])

  const clearHidingTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // 获取随机视频索引的函数
  const getRandomVideoIndex = useCallback((currentIndex: number, maxIndex: number) => {
    if (maxIndex === 0) return 0

    // 如果有多个视频，确保随机选择的不是当前正在播放的视频
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * (maxIndex + 1))
    } while (randomIndex === currentIndex && maxIndex > 0)

    return randomIndex
  }, [])

  // 初始化随机视频
  const [currentVideoIndex, setCurrentVideoIndex] = useState(() =>
    getRandomVideoIndex(-1, videoList.length - 1)
  )

  const video = useRef<HTMLVideoElement>(null)

  // 播放下一个视频
  const playNextVideo = useCallback(() => {
    const nextIndex = getRandomVideoIndex(currentVideoIndex, videoList.length - 1)
    setCurrentVideoIndex(nextIndex)
  }, [currentVideoIndex, getRandomVideoIndex, videoList.length])

  // 视频初始化和切换
  useEffect(() => {
    if (!video.current) return

    // 清理旧的 Hls 实例
    if (hlsInstance.current) {
      hlsInstance.current.destroy()
      hlsInstance.current = null
    }

    // 移除所有旧的事件监听器
    const videoElement = video.current
    videoElement.onended = null
    videoElement.oncanplay = null
    videoElement.onerror = null

    // 设置音量
    videoElement.volume = 0.3

    // HLS 支持的浏览器
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 60,     // 推荐: 允许缓冲区最大60秒
        maxMaxBufferLength: 120 // 推荐: 缓冲区上限120秒
      })
      hlsInstance.current = hls

      hls.loadSource(videoList[currentVideoIndex])
      hls.attachMedia(videoElement)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play().catch(err => console.error('Failed to play:', err))
      })

      // HLS 错误处理
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.details === 'bufferStalledError' && !data.fatal) {
          const videoEl = video.current
          if (videoEl && videoEl.buffered.length > 0) {
            // 跳转到缓冲区末尾，触发继续加载
            videoEl.currentTime = videoEl.buffered.end(0) - 0.5
          }
          hls.startLoad() // 强制拉新流
          return  // 避免走 fatal 分支
        }

        // 下面原 fatal 处理方式照旧
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError()
              break
            default:
              hls.destroy()
              playNextVideo()
              break
          }
        }
      })
    }
    // 原生 HLS 支持
    else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = videoList[currentVideoIndex]
    } else {
      console.error('HLS is not supported in this browser')
    }

    // 视频结束事件
    videoElement.onended = playNextVideo
    // 视频错误处理
    videoElement.onerror = playNextVideo

    // 初始显示并启动隐藏计时器
    startHidingTimer()

    // 清理函数
    return () => {
      if (hlsInstance.current) {
        hlsInstance.current.destroy()
        hlsInstance.current = null
      }

      if (videoElement) {
        videoElement.onended = null
        videoElement.oncanplay = null
        videoElement.onerror = null
      }
      clearHidingTimer()
    }
  }, [currentVideoIndex, videoList, playNextVideo, startHidingTimer, clearHidingTimer])

  // 处理音量切换
  const handleVolume = useCallback(() => {
    if (video.current) {
      video.current.muted = !video.current.muted
      setIsMuted(!isMuted)
    }

    // 重新启动隐藏计时器
    startHidingTimer()
  }, [isMuted, startHidingTimer])

  const handleVolumeIcon = useMemo(() => {
    if (isMuted) {
      return (
        <BsVolumeMute
          size={'2rem'}
          className={`${
            showVolume && isMuted ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-500 ease-out`}
        />
      )
    } else {
      return (
        <BsVolumeUp
          size={'2rem'}
          className={`${
            showVolume && !isMuted ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-500 ease-out`}
        />
      )
    }
  }, [isMuted, showVolume])

  return (
    <div
      className='absolute w-full h-full overflow-hidden'
      onClick={startHidingTimer}
    >
      <div className='uppercase text-sm mb-4'>
        <video
          id='video'
          className='absolute h-auto left-1/2 top-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-30'
          autoPlay
          muted
          playsInline
          preload='auto'
          ref={video}
        ></video>
        <button
          onClick={(e) => {
            // 仅在不是由触摸事件触发时处理
            if (!touchHandled.current) {
              e.stopPropagation()
              handleVolume()
            }
            // 重置触摸标记
            touchHandled.current = false
          }}
          onTouchStart={(e) => {
            // 标记为已处理触摸事件
            touchHandled.current = true
          }}
          onTouchEnd={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // 在触摸结束时处理音量切换
            handleVolume()
            // 保持标记，阻止后续的click事件处理
            touchHandled.current = true
            // 200ms后重置标记(确保click事件已经触发)
            setTimeout(() => {
              touchHandled.current = false
            }, 200)
          }}
          onMouseEnter={clearHidingTimer}
          onMouseLeave={startHidingTimer}
          className={`absolute bottom-2 right-2 ${showVolume ? 'cursor-pointer' : 'cursor-default'} pointer-events-auto w-8 h-8 flex items-center justify-center z-10`}
          aria-label={isMuted ? '开启声音' : '静音'}
        >
          {handleVolumeIcon}
        </button>
      </div>
    </div>
  )
}

export default Video