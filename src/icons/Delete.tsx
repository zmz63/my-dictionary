import { memo } from 'react'
import type { NativeProps } from '@/typings/common'

function Delete(props: NativeProps) {
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
        d="M15 12L16.2 5H31.8L33 12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path d="M6 12H42" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
      <path
        clipRule="evenodd"
        d="M37 12L35 43H13L11 12H37Z"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path d="M19 35H29" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
    </svg>
  )
}

export default memo(Delete)
