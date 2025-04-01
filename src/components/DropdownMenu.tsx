import { Menu, MenuButton, MenuItems, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useRef } from 'react'
import DropdownMenuItem from './DropdownMenuItem'
import DropdownMenuIcon from './icons/dropdown-menu-icon'

interface Props {
  tags: string[]
}

export default function DropdownMenu({ tags }: Readonly<Props>) {
  // 使用ref跟踪之前的open状态
  const prevOpenState = useRef<boolean | null>(null)

  // 播放动画的函数
  const playAnimation = (isOpen: boolean) => {
    if (isOpen) {
      // 播放打开动画
      const animOpenTop = document.getElementById(
        'globalnav-anim-menutrigger-bread-top-open'
      )
      const animOpenBottom = document.getElementById(
        'globalnav-anim-menutrigger-bread-bottom-open'
      )

      if (animOpenTop instanceof SVGAnimateElement) {
        animOpenTop.beginElement()
      }
      if (animOpenBottom instanceof SVGAnimateElement) {
        animOpenBottom.beginElement()
      }
    } else {
      // 播放关闭动画
      const animCloseTop = document.getElementById(
        'globalnav-anim-menutrigger-bread-top-close'
      )
      const animCloseBottom = document.getElementById(
        'globalnav-anim-menutrigger-bread-bottom-close'
      )

      if (animCloseTop instanceof SVGAnimateElement) {
        animCloseTop.beginElement()
      }
      if (animCloseBottom instanceof SVGAnimateElement) {
        animCloseBottom.beginElement()
      }
    }
  }

  return (
    <Menu as='div' className='relative inline-block text-left'>
      {({ open }) => {
        // 监听open状态变化，但避免首次渲染触发动画
        useEffect(() => {
          // 如果是首次渲染，只记录状态不播放动画
          if (prevOpenState.current === null) {
            prevOpenState.current = open
            return
          }

          // 如果状态真的变化了，才播放动画
          if (prevOpenState.current !== open) {
            playAnimation(open)
            prevOpenState.current = open
          }
        }, [open])

        return (
          <>
            <div>
              <MenuButton
                className='inline-flex justify-center rounded-md border border-zinc-400 dark:border-zinc-700 px-2 py-2 text-sm font-medium
               shadow-sm ui-open:bg-orange-200 dark:ui-open:bg-zinc-800 ui-open:outline-none focus:outline-none ui-open:ring-2
               ui-open:ring-indigo-500 ui-open:ring-offset-2 ui-open:ring-offset-gray-100
               /* 精确控制哪些属性有过渡效果 */
               transition-colors'
                aria-label='menu'
              >
                <DropdownMenuIcon />
              </MenuButton>
            </div>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <MenuItems
                className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md border
               border-zinc-400 dark:border-zinc-700 bg-orange-50 dark:bg-zinc-800 shadow-xl ring-1
               ring-black ring-opacity-5 focus:outline-none divide-zinc-400 dark:divide-zinc-700'
              >
                <div className='py-1'>
                  <div className='px-3 py-2 uppercase font-bold text-base'>
                    标签
                  </div>
                  {tags.map(tag => {
                    return (
                      <DropdownMenuItem
                        key={tag}
                        href={`/categories/${tag.toLowerCase()}`}
                      >
                        {tag}
                      </DropdownMenuItem>
                    )
                  })}
                </div>
              </MenuItems>
            </Transition>
          </>
        )
      }}
    </Menu>
  )
}