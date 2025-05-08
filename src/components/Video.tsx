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

  useEffect(() => {
    if (video.current) {
      if (currentVideoIndex === 0) {
        video.current.volume = 0.3
      } else {
        video.current.volume = 0.7
      }
      if (Hls.isSupported()) {
        let hls = new Hls()
        hls.loadSource(videoList[currentVideoIndex])
        hls.attachMedia(video.current)
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          video.current?.play()
        })
        video.current.onended = function() {
          console.log('end')
          // 视频结束时随机选择下一个视频
          const nextIndex = getRandomVideoIndex(currentVideoIndex, videoList.length - 1)
          setCurrentVideoIndex(nextIndex)
        }
      } else if (video.current.canPlayType('application/vnd.apple.mpegurl')) {
        video.current.src = videoList[currentVideoIndex]
        video.current.addEventListener('canplay', function() {
          video.current?.play()
        })
        video.current.onended = function() {
          console.log('end')
          // 视频结束时随机选择下一个视频
          const nextIndex = getRandomVideoIndex(currentVideoIndex, videoList.length - 1)
          setCurrentVideoIndex(nextIndex)
        }
      }
    }
    setShowVolume(true)
    setHidingTime(3000)
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

    // 清理函数
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