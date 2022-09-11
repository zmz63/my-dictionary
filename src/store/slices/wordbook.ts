import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getWordbooksFromDB } from '@/utils/db'
import type { Wordbook as CommonWordbook, Word } from '@/typings/word'

type Wordbook = CommonWordbook & {
  count: number
}

type Words = {
  [key: string]: {
    [key: string]: Word
  }
}

type Wordbooks = {
  [key: string]: Wordbook
}

type WordbookState = {
  error: boolean
  opened: boolean
  loading: boolean
  wordbooks: Wordbooks
  words: Words
}

const initialState: WordbookState = {
  error: false,
  opened: false,
  loading: true,
  wordbooks: {},
  words: {}
}

export const getWordbooks = createAsyncThunk(
  'wordbook/getWordbooks',
  async () => await getWordbooksFromDB()
)

const wordbookSlice = createSlice({
  name: 'wordbook',
  initialState,
  reducers: {
    setIsError(state, action: PayloadAction<boolean>) {
      state.error = action.payload
    },
    setIsOpened(state, action: PayloadAction<boolean>) {
      state.opened = action.payload
    },
    addWordbook(state, action: PayloadAction<Wordbook>) {
      const wordbook = action.payload
      state.wordbooks[wordbook.clientId] = wordbook
      state.words[wordbook.clientId] = {}
    },
    deleteWordbook(state, action: PayloadAction<number>) {
      const clientId = action.payload
      delete state.wordbooks[clientId]
      delete state.words[clientId]
    },
    updateWordbook(state, action: PayloadAction<CommonWordbook>) {
      const { clientId } = action.payload
      state.wordbooks[clientId] = { ...state.wordbooks[clientId], ...action.payload }
    },
    addWord(state, action: PayloadAction<Word[]>) {
      const wordList = action.payload
      wordList.forEach(word => {
        state.wordbooks[word.clientId].count++
        state.words[word.clientId][word._id] = word
      })
    },
    deleteWord(state, action: PayloadAction<{ clientId: number; idList: number[] }>) {
      const { clientId, idList } = action.payload
      idList.forEach(_id => {
        state.wordbooks[clientId].count--
        delete state.words[clientId][_id]
      })
    },
    updateWord(state, action: PayloadAction<Word[]>) {
      const wordList = action.payload
      wordList.forEach(word => {
        state.words[word.clientId][word._id] = word
      })
    }
  },
  extraReducers(builder) {
    builder.addCase(getWordbooks.fulfilled, (state, action) => {
      const [rawWordbooks, rawWords] = action.payload
      const words: Words = {}
      for (const wordbook of rawWordbooks) {
        const { clientId, name, createdAt } = wordbook
        state.wordbooks[clientId] = {
          clientId,
          name,
          createdAt,
          count: 0
        }
        words[clientId] = {}
      }
      for (const word of rawWords) {
        const { _id, clientId } = word
        state.wordbooks[clientId].count++
        words[clientId][_id] = word
      }
      state.words = words
      state.loading = false
    })
  }
})

export const {
  setIsError,
  setIsOpened,
  addWordbook,
  deleteWordbook,
  updateWordbook,
  addWord,
  deleteWord,
  updateWord
} = wordbookSlice.actions

export default wordbookSlice
