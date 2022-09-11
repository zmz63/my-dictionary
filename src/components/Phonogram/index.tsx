import { memo, useRef } from 'react'
import Voice from '@/icons/Voice'
import './index.scss'

export type PhonogramProps = {
  word: string
  phonogram: string
  type?: number
}

function Phonogram({ word, phonogram, type }: PhonogramProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  const typeText = type === 1 ? '英' : type === 2 ? '美' : ''

  return (
    <button className="phonogram-item button" onClick={() => audioRef.current?.play()}>
      <audio
        preload="none"
        ref={audioRef}
        src={`https://dict.youdao.com/dictvoice?audio=${word}&type=${type}`}
      />
      {typeText && <span className="text">{typeText}</span>}
      <span className="phonogram">/{phonogram}/</span>
      <div className="voice">
        <Voice />
      </div>
    </button>
  )
}

export default memo(Phonogram)
