import { useRef } from 'react'
import type { MouseEventHandler } from 'react'
import { SwipeAction } from 'antd-mobile'
import useVirtualList from '@/hooks/useVirtualList'
import { handleDeleteWord, handleUpdateWord } from '@/utils/wordbook'
import WordItem from '@/components/WordItem'
import type { Word } from '@/typings/word'
import './index.scss'

export type WordListProps = {
  words: Word[]
  editing: boolean
  selectedSet: { values: Set<number> }
  translationVisible: boolean
  onClick: MouseEventHandler<HTMLUListElement>
}

const getRightActions = (item: Word) => {
  const rightActions = []
  if (item.state === 0) {
    rightActions.push({
      key: 'mark',
      text: '标记',
      color: 'primary',
      onClick() {
        const data = { ...item, state: 1 }
        handleUpdateWord([data], false, '标记')
      }
    })
  } else {
    rightActions.push({
      key: 'unmark',
      text: '取消标记',
      color: 'warning',
      onClick() {
        const data = { ...item, state: 0 }
        handleUpdateWord([data], false, '取消标记')
      }
    })
  }
  rightActions.push({
    key: 'delete',
    text: '删除',
    color: 'danger',
    onClick() {
      handleDeleteWord(item.clientId, [item._id])
    }
  })
  return rightActions
}

const itemHeight = 72

function WordList({ words, editing, selectedSet, translationVisible, onClick }: WordListProps) {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)

  const [wordList, start] = useVirtualList(words, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    height: itemHeight
  })

  const offsetTop = start * itemHeight

  return (
    <div className="word-list-container" ref={containerRef}>
      <ul
        className="list"
        onClick={onClick}
        ref={wrapperRef}
        style={{
          marginTop: `${offsetTop}px`,
          height: `${words.length * itemHeight - offsetTop}px`
        }}
      >
        {wordList.map(item =>
          editing ? (
            <WordItem
              editing={editing}
              index={item.index}
              key={item.index}
              selected={selectedSet.values.has(item.data._id)}
              translationVisible={translationVisible}
              wordData={item.data}
            />
          ) : (
            <SwipeAction key={item.index} rightActions={getRightActions(item.data)}>
              <WordItem
                editing={editing}
                index={item.index}
                selected={selectedSet.values.has(item.data._id)}
                translationVisible={translationVisible}
                wordData={item.data}
              />
            </SwipeAction>
          )
        )}
      </ul>
    </div>
  )
}

export default WordList
