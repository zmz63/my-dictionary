import { memo } from 'react'
import Check from '@/icons/Check'
import './index.scss'

type CheckIconProps = {
  checked?: boolean
}

function CheckIcon({ checked = false }: CheckIconProps) {
  return <div className={`check-icon${checked ? ' check' : ''}`}>{checked && <Check />}</div>
}

export default memo(CheckIcon)
