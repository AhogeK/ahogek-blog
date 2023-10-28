import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BsVolumeMute, BsVolumeUp } from 'react-icons/bs/index.js'
import Hls from 'hls.js'
import { isMobile } from 'react-device-detect'

const Video: React.FC = () => {

  const [hidingTime, setHidingTime] = useState<number | null>(3000)
  const [isMuted, setIsMuted] = useState(true)
  const [showVolume, setShowVolume] = useState(false)
  const [nodeJSTimeout, setNodeJSTimeout] = useState<NodeJS.Timeout>()

  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (video.current) {
      video.current.volume = 0.7
      if (Hls.isSupported()) {
        let hls = new Hls()
        hls.loadSource(
          'https://ahogek.com/uploads/video/20231029/one-more-time-one-more-chance/one-more-time-one-more-chance.m3u8'
        )
        hls.attachMedia(video.current)
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          video.current?.play()
        })
      } else if (video.current.canPlayType('application/vnd.apple.mpegurl')) {
        video.current.src =
          'https://ahogek.com/uploads/video/20231029/one-more-time-one-more-chance/one-more-time-one-more-chance.m3u8'
        video.current.addEventListener('canplay', function() {
          video.current?.play()
        })
      }
    }
    setShowVolume(true)
  }, [])

  useEffect(() => {
    if (hidingTime) {
      clearTimeout(nodeJSTimeout)
      setNodeJSTimeout(setTimeout(() => {
        setShowVolume(false)
        setHidingTime(null)
      }, hidingTime))
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
      return <BsVolumeMute size={'2rem'}
                           className={`${showVolume && isMuted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 easy-out`} />
    } else {
      return <BsVolumeUp size={'2rem'}
                         className={`${showVolume && !isMuted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 easy-out`} />
    }
  }, [isMuted, showVolume])

  return (
    <>
      <div className='absolute w-full h-full overflow-hidden'
           onMouseEnter={() => {
             if (!isMobile) {
               setShowVolume(true)
               clearTimeout(nodeJSTimeout)
               setHidingTime(null)
             }
           }}
           onMouseLeave={() => {
             if (!isMobile)
               setHidingTime(1000)
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
            loop
            muted
            playsInline
            preload='auto'
            ref={video}

          ></video>
          <div onClick={handleVolume} className='absolute bottom-2 right-2'>
            {handleVolumeIcon}
          </div>
        </div>
      </div>
    </>
  )
}

export default Video