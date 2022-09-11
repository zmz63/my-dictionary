import { memo } from 'react'
import CheckIcon from '@/components/CheckIcon'
import type { Word } from '@/typings/word'
import Tag from '@/icons/Tag'
import './index.scss'

export type WordItemProps = {
  wordData: Word
  index: number
  editing: boolean
  selected: boolean
  translationVisible: boolean
}

function WordItem({ wordData, index, editing, selected, translationVisible }: WordItemProps) {
  return (
    <li className="word-item button" data-id={wordData._id} data-index={index}>
      {editing && <CheckIcon checked={selected} />}
      {wordData.state === 1 && <Tag className="tag" />}
      <div className="item">
        <div className="word">{wordData.word}</div>
        <div className="translation">
          {translationVisible ? (
            <div className="text">{wordData.brief}</div>
          ) : (
            <div className="line"></div>
          )}
        </div>
      </div>
    </li>
  )
}

export default memo(WordItem)
