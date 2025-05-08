import React, { useEffect, useMemo, useRef, useState } from 'react'
import Hls from 'hls.js'
import { isMobile } from 'react-device-detect'
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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

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
          setCurrentVideoIndex((currentVideoIndex + 1) % videoList.length)
        }
      } else if (video.current.canPlayType('application/vnd.apple.mpegurl')) {
        video.current.src = videoList[currentVideoIndex]
        video.current.addEventListener('canplay', function() {
          video.current?.play()
        })
        video.current.onended = function() {
          console.log('end')
          setCurrentVideoIndex((currentVideoIndex + 1) % videoList.length)
        }
      }
    }
    setShowVolume(true)
    setHidingTime(3000)
  }, [currentVideoIndex])

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
          } transition-opacity duration-500 easy-out`}
        />
      )
    } else {
      return (
        <BsVolumeUp
          size={'2rem'}
          className={`${
            showVolume && !isMuted ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-500 easy-out`}
        />
      )
    }
  }, [isMuted, showVolume])

  return (
    <div
      className='absolute w-full h-full overflow-hidden'
      onMouseEnter={() => {
        if (!isMobile) {
          setShowVolume(true)
          clearTimeout(nodeJSTimeout)
          setHidingTime(null)
        }
      }}
      onMouseLeave={() => {
        if (!isMobile) setHidingTime(1000)
      }}
      onClick={() => {
        if (isMobile) {
          if (!showVolume) {
            setShowVolume(true)
          }
          setHidingTime(null)
          setHidingTime(3000)
        }
      }}
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
          onClick={handleVolume}
          className='absolute bottom-2 right-2 cursor-pointer'
        >
          {handleVolumeIcon}
        </button>
      </div>
    </div>
  )
}

export default Video
