import type { CommonWord } from '@/typings/word'

const enum WorkerState {
  Resolve,
  Reject
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WorkerMessage<T = any> = MessageEvent<{
  state: WorkerState
  payload: T
}>

const worker = new Worker(new URL('./parse.worker', import.meta.url))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlers: [(value: any) => void, (reason?: any) => void][] = []

export function encodeWords(list: CommonWord[]) {
  const action = 'words/encode'

  worker.postMessage({
    action,
    payload: list
  })

  return new Promise<Blob>((resolve, reject) => {
    handlers.push([resolve, reject])
  })
}

export function decodeWords(file: File) {
  const action = 'words/decode'

  worker.postMessage({
    action,
    payload: file
  })

  return new Promise<CommonWord[]>((resolve, reject) => {
    handlers.push([resolve, reject])
  })
}

worker.addEventListener('message', (event: WorkerMessage) => {
  const { state, payload } = event.data
  const [resolve, reject] = handlers.shift() || []

  if (state === WorkerState.Resolve) {
    resolve && resolve(payload)
  } else if (state === WorkerState.Reject) {
    reject && reject(payload)
  }
})
