/* eslint-disable camelcase */
import request from '@/utils/request'

export type SuggestResult = {
  entries: {
    entry: string
    explain: string
  }[]
  language: string
}

export function reqGetSuggest(keyword: string, number?: number) {
  return request<SuggestResult>({
    method: 'GET',
    url: '/word/suggest',
    params: {
      keyword,
      number
    }
  }).then(data => {
    if (data.language === 'en') {
      return data.entries
    } else {
      return []
    }
  })
}

export type SearchResult = {
  word: string
  usPhonogram?: string
  ukPhonogram?: string
  translations: string[]
  words: {
    text: string
    translation: string
  }[]
  examType: string[]
  wordforms: {
    wordform: string
    value: string
  }[]
  sentences: {
    sentence: string
    origin: string
    translation: string
    source: string
  }[]
  phrases: {
    phrase: string
    translation: string
  }[]
  synonyms: {
    pos: string
    translation: string
    words: string[]
  }[]
  language: string
}

export function reqGetSearchResult(keyword: string) {
  return request<SearchResult>({
    method: 'GET',
    url: '/word/search',
    params: {
      keyword
    }
  })
}
