import { useMemo } from 'react'
import { useAppSelector } from '@/store'
import type { Word, Wordbook } from '@/typings/word'

export type Sortord = '0' | '1' | '2' | '3'

export type Filter = '0' | '1' | '2'

function useWordbook(
  clientId: string,
  sortord: Sortord = '0',
  filter: Filter = '0'
): [boolean, Wordbook, Word[], { [key: string]: Word }] {
  const loading = useAppSelector(state => state.wordbook.loading)
  const wordbook = useAppSelector(state => state.wordbook.wordbooks[clientId])
  const wordMap = useAppSelector(state => state.wordbook.words[clientId])

  const words = useMemo(() => Object.values(wordMap || {}), [wordMap])

  const filteredWords = useMemo(() => {
    let list: Word[] = []
    switch (filter) {
      case '0':
        list = Array.from(words)
        break
      case '1':
        words.forEach(item => {
          if (item.state === 0) {
            list.push(item)
          }
        })
        break
      case '2':
        words.forEach(item => {
          if (item.state === 1) {
            list.push(item)
          }
        })
        break
    }

    return list
  }, [words, filter])

  const sortedWords = useMemo(() => {
    const list = Array.from(filteredWords)
    switch (sortord) {
      case '0':
        return list.sort((a, b) => a.createdAt - b.createdAt)
      case '1':
        return list.sort((a, b) => b.createdAt - a.createdAt)
      case '2':
        return list.sort((a, b) => (b.word > a.word ? 1 : -1))
      case '3':
        return list.sort((a, b) => (b.word < a.word ? 1 : -1))
    }
  }, [filteredWords, sortord])

  return [loading, wordbook, sortedWords, wordMap]
}

export default useWordbook
