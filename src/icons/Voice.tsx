import { memo } from 'react'
import type { NativeProps } from '@/typings/common'

function Voice(props: NativeProps) {
  return (
    <svg
      {...props}
      fill="none"
      height="1em"
      viewBox="0 0 48 48"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m17.44895,30.57958c1.87976,-1.68379 3.04237,-4.01003 3.04237,-6.57952c0,-2.56949 -1.16261,-4.89572 -3.04237,-6.57965"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="m26.3325,38.15124c3.58428,-3.62161 5.8012,-8.62483 5.8012,-14.15124c0,-5.52641 -2.21692,-10.52963 -5.8012,-14.15124"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  )
}

export default memo(Voice)
