import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import DropdownMenuItem from './DropdownMenuItem'
import DropdownMenuIcon from './icons/dropdown-menu-icon'

interface Props {
  tags: string[]
}

export default function DropdownMenu({ tags }: Props) {
  const [isFocused, setIsFocused] = useState(false)

  const handleButtonFocus = () => {
    console.log(1)
    const animOpenTop = document.getElementById(
      'globalnav-anim-menutrigger-bread-top-open'
    )
    const animOpenBottom = document.getElementById(
      'globalnav-anim-menutrigger-bread-bottom-open'
    )

    // If the menu is not focused, start the open animations
    if (!isFocused) {
      if (animOpenTop instanceof SVGAnimateElement) {
        animOpenTop.beginElement()
      }
      if (animOpenBottom instanceof SVGAnimateElement) {
        animOpenBottom.beginElement()
      }
      // Set the menu state to focused
      setIsFocused(true)
    }
  }

  const handleButtonBlur = (close: any) => {
    console.log(2)
    const animCloseTop = document.getElementById(
      'globalnav-anim-menutrigger-bread-top-close'
    )
    const animCloseBottom = document.getElementById(
      'globalnav-anim-menutrigger-bread-bottom-close'
    )

    // If the menu is focused, start the close animations
    if (isFocused) {
      if (animCloseTop instanceof SVGAnimateElement) {
        animCloseTop.beginElement()
      }
      if (animCloseBottom instanceof SVGAnimateElement) {
        animCloseBottom.beginElement()
      }
      close()
      // Set the menu state to not focused
      setIsFocused(false)
    }
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ close }) => (
        <>
          <div>
            <Menu.Button
              onMouseDown={event => event.preventDefault()}
              className="inline-flex justify-center rounded-md border border-zinc-400 dark:border-zinc-700 px-2 py-2 text-sm font-medium shadow-sm ui-open:bg-orange-200 dark:ui-open:bg-zinc-800 ui-open:outline-none focus:outline-none hover:outline-none ui-open:ring-2 ui-open:ring-indigo-500 ui-open:ring-offset-2 ui-open:ring-offset-gray-100 transition-all"
              aria-label="menu"
            >
              <DropdownMenuIcon />
            </Menu.Button>
          </div>
          <div
            onFocus={handleButtonFocus}
            onBlur={() => handleButtonBlur(close)}
          >
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md border border-zinc-400 dark:border-zinc-700 bg-orange-50 dark:bg-zinc-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none divide-zinc-400 dark:divide-zinc-700">
                <div className="py-1">
                  <div className="px-3 py-2 uppercase font-bold text-base">
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
              </Menu.Items>
            </Transition>
          </div>
        </>
      )}
    </Menu>
  )
}
