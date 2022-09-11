export interface Wordbook {
  clientId: number
  name: string
  createdAt: number
}

export interface CommonWord {
  word: string
  brief: string
  usPhonogram: string
  ukPhonogram: string
  translations: string[]
  sentence: {
    sentence: string
    origin: string
    translation: string
    source: string
  }
  state: number
}

export interface Word extends CommonWord {
  clientId: number
  _id: number
  createdAt: number
}
