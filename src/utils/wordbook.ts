import { Toast } from 'antd-mobile'
import { dispatch } from '@/store'
import {
  addWord,
  addWordbook,
  deleteWord,
  deleteWordbook,
  updateWord,
  updateWordbook
} from '@/store/slices/wordbook'
import {
  addWordToDB,
  addWordbookToDB,
  deleteWordFromDB,
  deleteWordbookFromDB,
  updateWordFromDB,
  updateWordbookFromDB
} from './db'
import type { Word, Wordbook } from '@/typings/word'

const showToast = (text: string) => [
  () => {
    Toast.show({
      content: `${text}成功`,
      position: 'top'
    })
  },
  () => {
    Toast.show({
      content: `${text}失败`,
      position: 'top'
    })
  }
]

export function handleAddWordbook(
  name: string,
  isDefault: boolean,
  noShow?: boolean,
  text = '创建'
) {
  const p = addWordbookToDB(name)
    .then(wordbook => {
      dispatch(addWordbook({ ...wordbook, count: 0 }))
      if (isDefault) {
        localStorage.setItem('DEFAULT_WORDBOOK', wordbook.clientId.toString())
      }
    })
    .catch(error => {
      console.log(error)
      return Promise.reject()
    })
  return noShow ? p : p.then(...showToast(text))
}

export function handleDeleteWordbook(clientId: number, noShow?: boolean, text = '删除') {
  const p = deleteWordbookFromDB(clientId)
    .then(() => {
      dispatch(deleteWordbook(clientId))
    })
    .catch(error => {
      console.log(error)
      return Promise.reject()
    })
  return noShow ? p : p.then(...showToast(text))
}

export function handleUpdateWordbook(wordbook: Wordbook, noShow?: boolean, text = '修改') {
  const p = updateWordbookFromDB(wordbook)
    .then(() => {
      dispatch(updateWordbook(wordbook))
    })
    .catch(error => {
      console.log(error)
      return Promise.reject()
    })
  return noShow ? p : p.then(...showToast(text))
}

export function handleAddWord(
  wordList: Omit<Word, '_id'>[],
  noShow?: boolean,
  single?: boolean,
  text = '添加'
) {
  const p = addWordToDB(wordList, single)
    .then(data => {
      dispatch(addWord(data))
      return data.length
    })
    .catch(error => {
      console.log(error)
      return Promise.reject()
    })
  return noShow ? p : p.then(...showToast(text))
}

export function handleDeleteWord(
  clientId: number,
  idList: number[],
  noShow?: boolean,
  text = '删除'
) {
  const p = deleteWordFromDB(idList)
    .then(() => {
      dispatch(
        deleteWord({
          clientId,
          idList
        })
      )
    })
    .catch(error => {
      console.log(error)
      return Promise.reject()
    })
  return noShow ? p : p.then(...showToast(text))
}

export function handleUpdateWord(wordList: Word[], noShow?: boolean, text = '修改') {
  const p = updateWordFromDB(wordList)
    .then(() => {
      dispatch(updateWord(wordList))
    })
    .catch(error => {
      console.log(error)
      return Promise.reject()
    })
  return noShow ? p : p.then(...showToast(text))
}
