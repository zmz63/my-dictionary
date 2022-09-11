import { memo } from 'react'
import type { NativeProps } from '@/typings/common'

function Check(props: NativeProps) {
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
        d="M10 24L20 34L40 14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  )
}

export default memo(Check)
