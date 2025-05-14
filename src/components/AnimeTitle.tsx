import React, { type JSX, useEffect, useRef } from 'react'
import { animate } from 'animejs'

const AnimeTitle = (): JSX.Element => {
  const groupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (groupRef.current) {
      const spans = groupRef.current.querySelectorAll('span')
      animate(spans, {
        // Property keyframes
        y: [
          { to: '-2.75rem', ease: 'outExpo', duration: 600 },
          { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
        ],
        // Property specific parameters
        rotate: {
          from: '-1turn',
          delay: 0
        },
        delay: (_, i) => i * 50, // Function based value
        ease: 'inOutCirc',
        loopDelay: 1000,
        loop: true
      })
    }
  }, [])

  return (
    <div
      ref={groupRef}
      className='large grid grid-flow-col centered square-grid text-9xl'
    >
      <span className='bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-500'>4</span>
      <span>&nbsp;</span>
      <span className='bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-400'>0</span>
      <span>&nbsp;</span>
      <span className='bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-rose-500'>4</span>
    </div>
  )
}

export default AnimeTitle