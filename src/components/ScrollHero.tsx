import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'

interface ScrollHeroProps {
  children: ReactNode
}

/**
 * ScrollHero - Timeline Based
 * * Strategy:
 * Instead of switching CSS positions (sticky -> relative), we keep the container
 * sticky for the entire duration. We define a "Timeline" based on scroll pixels.
 * * 0px ------------------ 500px ------------------ 1200px ----------------> End
 * [    Entry Animation    ] [    Locked / Unlock    ] [ Natural Scroll Away ]
 */
export default function ScrollHero({ children }: ScrollHeroProps) {
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Configuration: Definition of the "Timeline"
  const TIMELINE = {
    ENTRY_END: 500,     // 0-500px: Avatar fades out, Content rises
    UNLOCK_START: 500,  // 500px: Content hits center, unlocking starts
    UNLOCK_END: 1000,   // 1000px: Unlock complete (500px distance to unlock)
    TOTAL_HEIGHT: 2000 // Total height of the scrollable track
  }

  useEffect(() => {
    const handleScroll = () => {
      // Direct update is performant enough for this logic
      setScrollY(window.scrollY)
    }

    // Use passive listener for performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initialize
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ---------------------------------------------------------------------------
  // Math & Interpolation (Pure Calculation)
  // ---------------------------------------------------------------------------

  const anim = useMemo(() => {
    // Helper: Clamp value between min and max
    const clamp = (val: number, min: number, max: number) =>
      Math.min(Math.max(val, min), max)

    // Helper: Map range [inMin, inMax] to [outMin, outMax]
    const map =
      (val: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
        const progress = (clamp(val, inMin, inMax) - inMin) / (inMax - inMin)
        return outMin + progress * (outMax - outMin)
      }

    // Avatar Animation (Parallax Exit)
    // Starts at 0, fully gone by 400px
    // Behavior: Moves UP (-50px) and Fades OUT
    const avatarOpacity = map(scrollY, 0, 300, 1, 0)
    const avatarTranslate = map(scrollY, 0, 300, 0, -50) // Moves up slightly

    // Content Entry Animation (Rising)
    // Starts entering at 0px (overlapping with avatar), settles at center by 500px
    // Behavior: Moves from 100vh to 50vh (Center)
    // Note: We clamp it so it stops exactly at center during the 'Unlock' phase
    let contentY: number // Start at 100vh
    let contentOpacity: number

    if (scrollY < TIMELINE.UNLOCK_START) {
      // Entry Phase
      contentY = map(scrollY, 0, TIMELINE.UNLOCK_START, 100, 50)
      contentOpacity = map(scrollY, 100, TIMELINE.UNLOCK_START, 0, 1) // Fade in faster
    } else {
      // Locked Phase (Visual Lock)
      // We simply hold the value at 50vh. No "snapping" because the map function above ends at 50.
      contentY = 50
      contentOpacity = 1
    }

    // Unlock Progress (The Dots)
    // Only counts scroll distance between UNLOCK_START and UNLOCK_END
    const rawProgress = (scrollY - TIMELINE.UNLOCK_START) / (TIMELINE.UNLOCK_END - TIMELINE.UNLOCK_START)
    const unlockProgress = clamp(rawProgress, 0, 1)

    // Final Layout Logic
    // When do we let the content scroll away?
    // In Sticky mode, this happens naturally when the parent container ends.
    // We just need to know if we are "done" to hide the sticky content layer if needed,
    // but usually CSS handles the exit.

    return {
      avatarOpacity,
      avatarTransform: `translateY(${avatarTranslate}px)`,
      contentOpacity,
      contentTransform: `translateY(${contentY}vh) translateY(-50%)`,
      unlockProgress,
      isLocked: scrollY >= TIMELINE.UNLOCK_START && scrollY < TIMELINE.UNLOCK_END,
      isComplete: scrollY >= TIMELINE.UNLOCK_END
    }
  }, [scrollY])

  return (
    // Track: The tall container that creates the scroll space
    <div
      ref={containerRef}
      className='relative w-full'
      style={{ height: `${TIMELINE.TOTAL_HEIGHT}px` }}
    >
      {/* Sticky Window
          This stays fixed to the viewport top until the parent (Track) is scrolled past.
          No JS layout switching needed!
      */}
      <div className='sticky top-0 left-0 w-full h-screen overflow-hidden'>

        {/* Background Layer (Video/Image) */}
        <div className='absolute inset-0 w-full h-full -z-10'>
          {children}
        </div>

        {/* --- Layer 1: Avatar (Hero) --- */}
        {/* Moves up and fades out */}
        <div
          className='absolute inset-0 flex items-center justify-center pointer-events-none'
          style={{
            opacity: anim.avatarOpacity,
            transform: anim.avatarTransform,
            willChange: 'opacity, transform'
          }}
        >
          <div className='text-center px-8 drop-shadow-lg shadow-black pointer-events-auto'>
            <div className='flex flex-col items-center'>
              {/* Avatar Circle */}
              <div className='mb-6 relative'>
                <div className='absolute inset-0 w-28 h-28 -translate-x-2 -translate-y-2'>
                  <div
                    className='w-full h-full rounded-full bg-linear-to-r from-orange-400 via-rose-500
                    to-purple-600 animate-spin opacity-30'
                    style={{ animationDuration: '3s' }} />
                </div>
                <img src='/avatar.jpeg' alt='AhogeK Avatar'
                     className='relative w-24 h-24 rounded-full border-2 border-white/50 object-cover shadow-2xl
                     hover:scale-110 transition-all duration-500 hover:border-orange-400' />
                <div
                  className='absolute inset-0 w-24 h-24 rounded-full bg-linear-to-r from-orange-400 to-rose-500
                  opacity-0 hover:opacity-20 transition-opacity duration-300' />
              </div>
              {/* Text */}
              <div className='text-4xl font-bold text-white'>
                AhogeK 的 <span
                className='text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-rose-500'>个人博客</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Layer 2: Main Content --- */}
        {/* Rises from bottom, settles at center, then holds */}
        <div
          className='absolute inset-0 flex items-start justify-center pointer-events-none'
          style={{
            opacity: anim.contentOpacity,
            zIndex: 20
          }}
        >
          <div
            className='w-full max-w-4xl px-8 pointer-events-auto'
            style={{
              transform: anim.contentTransform,
              // Use strictly linear transition or none to sync perfectly with scroll
              // Adding transition here causes the "lag/floaty" feel.
              // For scroll-driven anims, no transition is usually better!
              transition: 'none'
            }}
          >
            {/* The Card */}
            <div
              className='text-5xl md:text-6xl font-semibold text-center p-8 md:p-10 border-4 border-dashed
              border-white/40 rounded-xl backdrop-blur-sm bg-black/10 text-white'>
              <div className='animate-pulse'>
                网站开发中
                <span className='inline-block animate-bounce delay-75'>.</span>
                <span className='inline-block animate-bounce delay-150'>.</span>
                <span className='inline-block animate-bounce delay-300'>.</span>
              </div>
            </div>

            {/* Unlock Indicator (The Dots) */}
            {/* Show during entry AND lock phase, hide when complete */}
            <div
              className='mt-8 text-center transition-opacity duration-500'
              style={{ opacity: anim.isComplete ? 0 : 1 }}
            >
              {/* Helper Text */}
              <div
                className={`text-sm text-white/90 font-medium mb-2 transition-opacity duration-300 
                ${anim.isLocked ? 'opacity-100' : 'opacity-0'}`}>
                {anim.unlockProgress >= 0.99 ? '解锁成功' : '继续向下滚动解锁'}
              </div>

              {/* Dots Container */}
              <div className='flex justify-center gap-2'>
                {[0, 1, 2].map((i) => {
                  // 3 dots, distribute progress 0-1 across them
                  // Dot 0: 0.00 - 0.33
                  // Dot 1: 0.33 - 0.66
                  // Dot 2: 0.66 - 1.00
                  const dotThreshold = (i + 1) * 0.33
                  // Add a small buffer so they don't flicker off immediately
                  const isActive = anim.unlockProgress > (dotThreshold - 0.1)

                  return (
                    <div
                      key={i}
                      className='w-3 h-3 rounded-full transition-all duration-200'
                      style={{
                        backgroundColor: isActive ? '#fb923c' : 'rgba(255,255,255,0.3)',
                        transform: isActive ? 'scale(1.3)' : 'scale(1)',
                        boxShadow: isActive ? '0 0 10px rgba(251, 146, 60, 0.5)' : 'none'
                      }}
                    />
                  )
                })}
              </div>

              {/* Optional Arrow Hint */}
              <svg
                className={`w-6 h-6 mx-auto mt-4 text-white/50 animate-bounce transition-opacity 
                duration-300 ${anim.isLocked ? 'opacity-100' : 'opacity-0'}`}
                fill='none' viewBox='0 0 24 24' stroke='currentColor'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
              </svg>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}