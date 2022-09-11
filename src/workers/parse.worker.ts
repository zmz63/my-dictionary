import type { CommonWord } from '@/typings/word'

const enum WorkerState {
  Resolve,
  Reject
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WorkerMessage<T = any> = MessageEvent<{
  action: string
  payload: T
}>

// eslint-disable-next-line no-restricted-globals
const worker = self as DedicatedWorkerGlobalScope

function pushUint8(blobParts: (Blob | ArrayBuffer)[], data: number) {
  const buffer = new ArrayBuffer(1)
  const typedArray = new Uint8Array(buffer)
  typedArray[0] = data
  blobParts.push(buffer)
}

function pushUint16(blobParts: (Blob | ArrayBuffer)[], data: number) {
  const buffer = new ArrayBuffer(2)
  const typedArray = new Uint16Array(buffer)
  typedArray[0] = data
  blobParts.push(buffer)
}

function pushUint32(blobParts: (Blob | ArrayBuffer)[], data: number) {
  const buffer = new ArrayBuffer(4)
  const typedArray = new Uint32Array(buffer)
  typedArray[0] = data
  blobParts.push(buffer)
}

function pushString(blobParts: (Blob | ArrayBuffer)[], data: string) {
  if (data.length === 0) {
    pushUint16(blobParts, 0)
    return
  }
  const blob = new Blob([data])
  pushUint16(blobParts, blob.size)
  blobParts.push(blob)
}

function packData(data: CommonWord[]): Blob {
  const blobParts: (Blob | ArrayBuffer)[] = []
  blobParts.push(new Blob(['WORDS']))
  pushUint32(blobParts, data.length)
  for (const item of data) {
    pushString(blobParts, item.word)
    pushString(blobParts, item.brief)
    pushString(blobParts, item.usPhonogram)
    pushString(blobParts, item.ukPhonogram)
    pushString(blobParts, item.sentence.sentence)
    pushString(blobParts, item.sentence.origin)
    pushString(blobParts, item.sentence.translation)
    pushString(blobParts, item.sentence.source)
    pushUint8(blobParts, item.translations.length)
    for (const translation of item.translations) {
      pushString(blobParts, translation)
    }
    pushUint8(blobParts, item.state)
  }
  return new Blob(blobParts, { type: 'application/binary' })
}

function encodeWords(payload: CommonWord[]) {
  const blob = packData(payload)
  worker.postMessage({
    state: WorkerState.Resolve,
    payload: blob
  })
}

// function decodeWords(payload: File) {
//   const reader = new FileReader()
//   reader.readAsText(payload)
//   reader.onload = event => {
//     const data = event.target?.result
//     if (data) {
//       try {
//         const words = JSON.parse(data as string)
//         worker.postMessage({
//           state: WorkerState.Resolve,
//           payload: words
//         })
//       } catch (error) {
//         worker.postMessage({
//           state: WorkerState.Reject,
//           payload: error
//         })
//       }
//     }
//   }
// }

function getString(
  data: ArrayBuffer,
  dataView: DataView,
  textDecoder: TextDecoder,
  offset: { value: number }
): string {
  const length = dataView.getUint16(offset.value, true)
  offset.value += 2
  if (length === 0) return ''
  const typedArray = new Uint8Array(data, offset.value, length)
  offset.value += length
  return textDecoder.decode(typedArray)
}

function unpackData(data: ArrayBuffer): CommonWord[] {
  const words: CommonWord[] = []
  const textDecoder = new TextDecoder()
  const dataView = new DataView(data)
  const offset = {
    value: 0
  }
  const typedArray = new Uint8Array(data, offset.value, 5)
  const header = textDecoder.decode(typedArray)
  if (header !== 'WORDS') throw new Error('File Error')
  offset.value += 5
  const wordsLength = dataView.getUint32(offset.value, true)
  offset.value += 4
  for (let i = 0; i < wordsLength; i++) {
    const word = getString(data, dataView, textDecoder, offset)
    const brief = getString(data, dataView, textDecoder, offset)
    const usPhonogram = getString(data, dataView, textDecoder, offset)
    const ukPhonogram = getString(data, dataView, textDecoder, offset)
    const sentence = getString(data, dataView, textDecoder, offset)
    const origin = getString(data, dataView, textDecoder, offset)
    const translation = getString(data, dataView, textDecoder, offset)
    const source = getString(data, dataView, textDecoder, offset)
    const translationsLength = dataView.getUint8(offset.value)
    offset.value += 1
    const translations: string[] = []
    for (let j = 0; j < translationsLength; j++) {
      translations.push(getString(data, dataView, textDecoder, offset))
    }
    const state = dataView.getUint8(offset.value)
    offset.value += 1
    words.push({
      word,
      brief,
      usPhonogram,
      ukPhonogram,
      translations,
      sentence: {
        sentence,
        origin,
        translation,
        source
      },
      state
    })
  }
  return words
}

function decodeWords(payload: File) {
  const reader = new FileReader()
  reader.readAsArrayBuffer(payload)
  reader.onload = event => {
    const data = event.target?.result as ArrayBuffer
    if (data) {
      try {
        const words = unpackData(data)
        worker.postMessage({
          state: WorkerState.Resolve,
          payload: words
        })
      } catch (error) {
        worker.postMessage({
          state: WorkerState.Reject,
          payload: error
        })
      }
    }
  }
}

worker.addEventListener('message', (event: WorkerMessage) => {
  const { action, payload } = event.data

  if (action === 'words/encode') {
    encodeWords(payload)
  } else if (action === 'words/decode') {
    decodeWords(payload)
  }
})

export {}
