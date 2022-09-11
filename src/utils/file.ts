import { handleAddWord } from './wordbook'
import { decodeWords, encodeWords } from '@/workers'
import { Toast } from 'antd-mobile'
import type { CommonWord, Word } from '@/typings/word'

export function importWords(clientId: number) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.words'
  input.onchange = event => {
    const files = (event.target as HTMLInputElement).files
    if (files) {
      decodeWords(files[0])
        .then(words => {
          handleAddWord(
            words.map(item => ({ ...item, clientId, createdAt: Date.now() })),
            true,
            true
          ).then(data => {
            if (typeof data === 'number') {
              Toast.show({
                content: `导入${data}个单词${
                  data === words.length ? '' : `,${words.length - data}个词重复`
                }`,
                position: 'top'
              })
            }
          })
        })
        .catch(() =>
          Toast.show({
            content: '文件异常,导入失败',
            position: 'top'
          })
        )
    }
  }
  input.click()
}

export function exportWords(wordList: Word[]) {
  const list: CommonWord[] = wordList.map(item => {
    const { word, brief, usPhonogram, ukPhonogram, translations, sentence, state } = item
    return { word, brief, usPhonogram, ukPhonogram, translations, sentence, state }
  })

  encodeWords(list)
    .then(data => {
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.download = 'wordList.words'
      a.href = url
      a.click()
    })
    .catch(() =>
      Toast.show({
        content: '导出失败',
        position: 'top'
      })
    )
}
