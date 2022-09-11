import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorageState, useMemoizedFn, useRequest } from 'ahooks'
import { debounce } from 'lodash'
import { Button, Input, Toast } from 'antd-mobile'
import { reqGetSuggest } from '@/api'
import Delete from '@/icons/Delete'
import Right from '@/icons/Right'
import './index.scss'

type SuggestItem = {
  entry: string
  explain: string
}

type History = SuggestItem[]

function addHistory(history: History, item: SuggestItem) {
  for (let index = history.length - 1; index >= 0; index--) {
    if (history[index].entry === item.entry) {
      const temp = history[index]
      history.splice(index, 1)
      history.unshift(temp)
      localStorage.setItem('SEARCH_HISTORY', JSON.stringify(history))
      return
    }
  }
  if (history.length >= 5) {
    history.pop()
  }
  history.unshift(item)
  localStorage.setItem('SEARCH_HISTORY', JSON.stringify(history))
}

function Search() {
  const navigate = useNavigate()

  const [history, setHistory] = useLocalStorageState<History>('SEARCH_HISTORY', {
    defaultValue: []
  })

  const composingRef = useRef(false)
  const keyword = useRef('')

  const { data, run, mutate } = useRequest(reqGetSuggest, {
    manual: true
  })

  const getSuggest = useMemoizedFn(
    debounce((value: string) => {
      value = value.trim()
      if (!value) {
        mutate([])
        return
      }
      keyword.current = value
      run(value)
    }, 300)
  )

  const goSearch = (isButton: boolean, item?: SuggestItem) => {
    if (item) {
      addHistory(history, item)
      navigate(`/result?keyword=${item.entry}`)
      return
    }
    if (composingRef.current && !isButton) return
    if (!keyword.current) {
      Toast.show({
        content: '请输入搜索内容',
        position: 'top'
      })
      return
    }
    addHistory(history, { entry: keyword.current, explain: '' })
    navigate(`/result?keyword=${keyword.current}`)
  }

  return (
    <div className="search-container">
      <Input
        autoFocus
        className="search-box"
        clearable
        onChange={getSuggest}
        onCompositionEnd={() => {
          composingRef.current = false
        }}
        onCompositionStart={() => {
          composingRef.current = true
        }}
        onEnterPress={() => goSearch(false)}
        placeholder="请输入要搜索的单词"
      />
      {data && data.length > 0 ? (
        <ul className="search-list">
          {data.map((item, index) => (
            <li className="button" key={index} onClick={() => goSearch(false, item)}>
              <span className="entry">{item.entry}</span>
              <span className="explain">{item.explain}</span>
            </li>
          ))}
        </ul>
      ) : (
        history.length > 0 && (
          <>
            <div className="history-bar">
              <span>最近搜索</span>
              <span className="button" onClick={() => setHistory([])}>
                <Delete />
              </span>
            </div>
            <ul className="search-list">
              {history.map((item, index) => (
                <li className="button" key={index} onClick={() => goSearch(false, item)}>
                  <span className="entry">{item.entry}</span>
                  <span className="explain">{item.explain}</span>
                </li>
              ))}
            </ul>
          </>
        )
      )}
      <Button className="fixed" color="primary" onClick={() => goSearch(true)} shape="rounded">
        <span>搜索</span>
        <Right />
      </Button>
    </div>
  )
}

export default Search
