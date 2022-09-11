import { memo } from 'react'
import type { NativeProps } from '@/typings/common'

function Close(props: NativeProps) {
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
        d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="M29.6567 18.3432L18.343 29.6569"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="M18.3433 18.3432L29.657 29.6569"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  )
}

export default memo(Close)
