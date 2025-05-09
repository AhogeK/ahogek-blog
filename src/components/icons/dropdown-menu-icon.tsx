import React from 'react'

export default function DropdownMenuIcon() {
  return (
    <svg width='18' height='18' viewBox='0 0 18 18'>
      <polyline
        id='globalnav-menutrigger-bread-bottom'
        className='globalnav-menutrigger-bread globalnav-menutrigger-bread-bottom'
        fill='none'
        stroke='var(--icon-stroke-color)' // 使用CSS变量
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
        points='2 12, 16 12'
      >
        <animate
          id='globalnav-anim-menutrigger-bread-bottom-open'
          attributeName='points'
          keyTimes='0;0.5;1'
          dur='0.24s'
          begin='indefinite'
          fill='freeze'
          calcMode='spline'
          keySplines='0.42, 0, 1, 1;0, 0, 0.58, 1'
          values=' 2 12, 16 12; 2 9, 16 9; 3.5 15, 15 3.5'
        ></animate>
        <animate
          id='globalnav-anim-menutrigger-bread-bottom-close'
          attributeName='points'
          keyTimes='0;0.5;1'
          dur='0.24s'
          begin='indefinite'
          fill='freeze'
          calcMode='spline'
          keySplines='0.42, 0, 1, 1;0, 0, 0.58, 1'
          values=' 3.5 15, 15 3.5; 2 9, 16 9; 2 12, 16 12'
        ></animate>
      </polyline>
      <polyline
        id='globalnav-menutrigger-bread-top'
        className='globalnav-menutrigger-bread globalnav-menutrigger-bread-top'
        fill='none'
        stroke='var(--icon-stroke-color)' // 使用CSS变量
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
        points='2 5, 16 5'
      >
        <animate
          id='globalnav-anim-menutrigger-bread-top-open'
          attributeName='points'
          keyTimes='0;0.5;1'
          dur='0.24s'
          begin='indefinite'
          fill='freeze'
          calcMode='spline'
          keySplines='0.42, 0, 1, 1;0, 0, 0.58, 1'
          values=' 2 5, 16 5; 2 9, 16 9; 3.5 3.5, 15 15'
        ></animate>
        <animate
          id='globalnav-anim-menutrigger-bread-top-close'
          attributeName='points'
          keyTimes='0;0.5;1'
          dur='0.24s'
          begin='indefinite'
          fill='freeze'
          calcMode='spline'
          keySplines='0.42, 0, 1, 1;0, 0, 0.58, 1'
          values=' 3.5 3.5, 15 15; 2 9, 16 9; 2 5, 16 5'
        ></animate>
      </polyline>
    </svg>
  )
}
