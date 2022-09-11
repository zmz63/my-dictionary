import { memo } from 'react'
import type { NativeProps } from '@/typings/common'

function Tag(props: NativeProps) {
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
        d="M8 44L8 6C8 4.89543 8.89543 4 10 4H38C39.1046 4 40 4.89543 40 6V44L24 35.7273L8 44Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  )
}

export default memo(Tag)
