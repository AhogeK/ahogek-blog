import React, { useEffect, useMemo, useRef, useState } from 'react'
import Hls from 'hls.js'
import { BsVolumeMute, BsVolumeUp } from 'react-icons/bs'

const Video: React.FC = () => {
  const [hidingTime, setHidingTime] = useState<number | null>(3000)
  const [isMuted, setIsMuted] = useState(true)
  const [showVolume, setShowVolume] = useState(false)
  const [nodeJSTimeout, setNodeJSTimeout] = useState<NodeJS.Timeout>()
  const videoList = useMemo(
    () => [
      'https://ahogek.com/uploads/video/20231201/cherry_blossom_tree_artistic_confession/cherry_blossom_tree_artistic_confession.m3u8',
      'https://ahogek.com/uploads/video/20231029/one-more-time-one-more-chance/one-more-time-one-more-chance.m3u8'
    ],
    []
  )

  // 保存 Hls 实例的引用，用于正确清理
  const hlsInstance = useRef<Hls | null>(null)

  // 获取随机视频索引的函数
  const getRandomVideoIndex = (currentIndex: number, maxIndex: number) => {
    // 如果只有一个视频，就返回 0
    if (maxIndex === 0) return 0

    // 如果有多个视频，确保随机选择的不是当前正在播放的视频
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * (maxIndex + 1))
    } while (randomIndex === currentIndex && maxIndex > 0)

    return randomIndex
  }

  // 初始化时随机选择一个视频
  const [currentVideoIndex, setCurrentVideoIndex] = useState(() =>
    getRandomVideoIndex(-1, videoList.length - 1)
  )

  const video = useRef<HTMLVideoElement>(null)

  // 播放下一个视频的函数
  const playNextVideo = () => {
    console.log('Playing next video')
    const nextIndex = getRandomVideoIndex(currentVideoIndex, videoList.length - 1)
    console.log(`Current index: ${currentVideoIndex}, Next index: ${nextIndex}`)
    setCurrentVideoIndex(nextIndex)
  }

  useEffect(() => {
    // 每次 currentVideoIndex 变化时都会执行这个 effect
    console.log(`Setting up video with index: ${currentVideoIndex}`)

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
    if (currentVideoIndex === 0) {
      videoElement.volume = 0.3
    } else {
      videoElement.volume = 0.7
    }

    // HLS 支持的浏览器
    if (Hls.isSupported()) {
      const hls = new Hls()
      hlsInstance.current = hls

      hls.loadSource(videoList[currentVideoIndex])
      hls.attachMedia(videoElement)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play().catch(err => console.error('Failed to play:', err))
      })

      // 处理 HLS 错误
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data)
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // 尝试恢复网络错误
              console.log('Network error, trying to recover')
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              // 尝试恢复媒体错误
              console.log('Media error, trying to recover')
              hls.recoverMediaError()
              break
            default:
              // 无法恢复，销毁实例
              console.error('Fatal error, cannot recover')
              hls.destroy()
              // 播放下一个视频
              playNextVideo()
              break
          }
        }
      })
    }
    // 原生 HLS 支持（如 Safari）
    else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = videoList[currentVideoIndex]
    } else {
      console.error('HLS is not supported in this browser')
    }

    // 设置视频结束事件
    videoElement.onended = () => {
      console.log('Video ended naturally')
      playNextVideo()
    }

    // 处理视频错误
    videoElement.onerror = () => {
      console.error('Video error occurred')
      playNextVideo()
    }

    setShowVolume(true)
    setHidingTime(3000)

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
    }
  }, [currentVideoIndex, videoList])

  useEffect(() => {
    if (hidingTime) {
      clearTimeout(nodeJSTimeout)
      setNodeJSTimeout(
        setTimeout(() => {
          setShowVolume(false)
          setHidingTime(null)
        }, hidingTime)
      )
    }

    return () => {
      if (nodeJSTimeout) {
        clearTimeout(nodeJSTimeout)
      }
    }
  }, [hidingTime])

  function handleVolume() {
    if (video.current) {
      video.current.muted = !video.current.muted
      setIsMuted(!isMuted)
    }
  }

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

  // 暂停倒计时
  const pauseHidingTimer = () => {
    if (showVolume) { // 只有当图标可见时才暂停计时器
      clearTimeout(nodeJSTimeout)
      setHidingTime(null)
    }
  }

  // 重启倒计时
  const restartHidingTimer = () => {
    if (showVolume) { // 只有当图标可见时才重启计时器
      setHidingTime(3000)
    }
  }

  // 点击事件处理函数
  const handleVolumeClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 防止触发容器的点击事件
    if (showVolume) { // 只有当图标可见时才处理点击事件
      handleVolume()
    }
  }

  // 统一的容器点击事件处理函数
  const handleContainerClick = () => {
    setShowVolume(true)
    setHidingTime(null) // 清除当前计时器
    setHidingTime(3000) // 设置新的隐藏时间
  }

  return (
    <div
      className='absolute w-full h-full overflow-hidden'
      onClick={handleContainerClick}
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
          onClick={handleVolumeClick}
          onMouseEnter={pauseHidingTimer}
          onMouseLeave={restartHidingTimer}
          className={`absolute bottom-2 right-2 ${showVolume ? 'cursor-pointer' : 'cursor-default'} pointer-events-auto w-8 h-8 flex items-center justify-center`}
          aria-label={isMuted ? '开启声音' : '静音'}
        >
          {handleVolumeIcon}
        </button>
      </div>
    </div>
  )
}

export default Video