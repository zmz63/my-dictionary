import { useEffect, useState } from 'react'
import type { MouseEventHandler } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMemoizedFn } from 'ahooks'
import { Button, Mask, Picker, SpinLoading } from 'antd-mobile'
import useWordbook from '@/hooks/useWordbook'
import { handleDeleteWord, handleUpdateWord } from '@/utils/wordbook'
import { exportWords, importWords } from '@/utils/file'
import WordList from '@/components/WordList'
import Bubble from '@/components/Bubble'
import type { Filter, Sortord } from '@/hooks/useWordbook'
import './index.scss'

const basicColumns = [
  [
    { label: '按时间降序', value: '0' },
    { label: '按时间升序', value: '1' },
    { label: '按字母降序', value: '2' },
    { label: '按字母升序', value: '3' }
  ],
  [
    { label: '显示全部', value: '0' },
    { label: '显示未标记', value: '1' },
    { label: '显示已标记', value: '2' }
  ]
]

function Wordbook() {
  const navigate = useNavigate()

  const { id: clientId } = useParams()

  const location = useLocation()

  const { sortord: currentSortord, filter: currentFilter } =
    (location.state as {
      sortord: Sortord
      filter: Filter
    }) || {}

  const [sortord, setSortord] = useState<Sortord>(currentSortord || '0')
  const [filter, setFilter] = useState<Filter>(currentFilter || '0')
  const [editing, setEditing] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [selectedSet, setSelectedSet] = useState<{ values: Set<number> }>({ values: new Set() })
  const [translationVisible, setTranslationVisible] = useState(true)
  const [pickerVisible, setPickerVisible] = useState(false)
  const [markState, setMarkState] = useState(false)

  const [loading, wordbook, words, wordMap] = useWordbook(clientId || '', sortord, filter)

  useEffect(() => {
    navigate(`/wordbook/${clientId}`, {
      replace: true,
      state: {
        sortord,
        filter
      }
    })
  }, [clientId, sortord, filter, navigate])

  useEffect(() => {
    if (!loading && !wordbook) {
      navigate('/')
    }
  }, [loading, wordbook, navigate])

  useEffect(() => {
    if (!editing) {
      setSelectedSet(selectedSet => {
        selectedSet.values.clear()
        return { ...selectedSet }
      })
      setMarkState(false)
    }
  }, [editing])

  const handleClickItem: MouseEventHandler<HTMLUListElement> = useMemoizedFn(event => {
    const item = event.target as HTMLElement
    const { id, index } = item.dataset
    if (id && index) {
      const _id = Number(id)
      if (!editing) {
        navigate(`/cards/${clientId}`, {
          state: {
            index: Number(index),
            sortord,
            filter
          }
        })
      } else {
        if (selectedSet.values.has(Number(_id))) {
          selectedSet.values.delete(_id)
          setMarkState(false)
          for (const id of Array.from(selectedSet.values)) {
            if (wordMap[id].state === 0) {
              setMarkState(true)
              break
            }
          }
        } else {
          selectedSet.values.add(_id)
          if (words[Number(index)].state === 0) {
            setMarkState(true)
          }
        }
        setSelectedSet(selectedSet => ({ ...selectedSet }))
      }
    }
  })

  const selectedAll = () => {
    if (selectedSet.values.size === words.length) {
      setMarkState(false)
      selectedSet.values.clear()
    } else {
      setMarkState(false)
      words.forEach(item => {
        if (item.state === 0) {
          setMarkState(true)
        }
        selectedSet.values.add(item._id)
      })
    }
    setSelectedSet(selectedSet => ({ ...selectedSet }))
  }

  return (
    <>
      {(loading || waiting) && (
        <Mask className="mask-container" opacity={0}>
          <SpinLoading color="primary" />
        </Mask>
      )}
      {wordbook && (
        <>
          <Bubble />
          <div className="wordbook-container">
            <div className="wordbook-header">
              <div className="top-wrapper">
                <div className="left">
                  <span>{wordbook.name}</span>
                </div>
                <div className="right">
                  <Button
                    className="filter"
                    color="primary"
                    disabled={editing || words.length === 0}
                    onClick={() => setPickerVisible(true)}
                    shape="rounded"
                    size="small"
                  >
                    <span>筛选</span>
                    <span className="triangle"></span>
                  </Button>
                </div>
              </div>
              <div className="bottom-wrapper">
                <div className="left">
                  <span className="count">{`${words.length}词`}</span>
                </div>
                <div className="right">
                  {!editing && (
                    <>
                      <span className="button" onClick={() => importWords(Number(clientId))}>
                        导入单词
                      </span>
                      {words.length > 0 && (
                        <span className="button" onClick={() => exportWords(words)}>
                          导出单词
                        </span>
                      )}
                    </>
                  )}
                  {editing && (
                    <span className="button" onClick={selectedAll}>
                      {selectedSet.values.size !== words.length ? '全选' : '取消全选'}
                    </span>
                  )}
                  {words.length > 0 && (
                    <span className="button" onClick={() => setEditing(!editing)}>
                      {editing ? '完成' : '编辑'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {words.length > 0 ? (
              <>
                {!editing && (
                  <div className="fixed-buttons right">
                    <Button
                      color="primary"
                      disabled={editing}
                      onClick={() => setTranslationVisible(!translationVisible)}
                      shape="rounded"
                    >
                      {`${translationVisible ? '隐藏' : '显示'}释义`}
                    </Button>
                  </div>
                )}
                {editing && (
                  <div className="fixed-buttons between">
                    <Button
                      block
                      disabled={selectedSet.values.size === 0}
                      onClick={() => {
                        const wordList = Array.from(selectedSet.values).map(key => ({
                          ...wordMap[key],
                          state: markState ? 1 : 0
                        }))
                        setWaiting(true)
                        handleUpdateWord(wordList, false, `${markState ? '' : '取消'}标记`)
                          .then(() => setEditing(false))
                          .finally(() => setWaiting(false))
                      }}
                    >
                      {`${markState ? '' : '取消'}标记`}
                    </Button>
                    <div className="divider"></div>
                    <Button
                      block
                      disabled={selectedSet.values.size === 0}
                      onClick={() => {
                        const idList = Array.from(selectedSet.values)
                        setWaiting(true)
                        handleDeleteWord(Number(clientId), idList)
                          .then(() => setEditing(false))
                          .finally(() => setWaiting(false))
                      }}
                    >
                      删除
                    </Button>
                  </div>
                )}
                <WordList
                  editing={editing}
                  onClick={handleClickItem}
                  selectedSet={selectedSet}
                  translationVisible={translationVisible}
                  words={words}
                />
              </>
            ) : (
              <div className="blank">
                <div className="notice-main">
                  <span>你还没有添加过单词哦~</span>
                </div>
                <div className="notice">
                  <span>可以在单词释义页点击"加入单词本"按钮即可添加单词</span>
                  <span>也可以选择通过右上角按钮导入单词</span>
                </div>
              </div>
            )}
          </div>
          <Picker
            columns={basicColumns}
            onClose={() => {
              setPickerVisible(false)
            }}
            onConfirm={([sortord, filter]) => {
              setSortord(sortord as Sortord)
              setFilter(filter as Filter)
            }}
            style={{
              touchAction: 'none'
            }}
            value={[sortord, filter]}
            visible={pickerVisible}
          />
        </>
      )}
    </>
  )
}

export default Wordbook
