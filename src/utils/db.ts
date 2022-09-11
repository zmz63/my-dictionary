import { dispatch } from '@/store'
import { getWordbooks, setIsError, setIsOpened } from '@/store/slices/wordbook'
import type { Word, Wordbook } from '@/typings/word'
import { allResolved } from '@/utils/common'

export let db: IDBDatabase | undefined

if (!window.indexedDB) {
  console.log('error', 'indexedDB does not exist')
  setIsError(true)
} else {
  const request = window.indexedDB.open('dictionary')

  request.onerror = function (event) {
    console.log('error', event)
    setIsError(true)
  }

  request.onsuccess = function () {
    db = this.result

    dispatch(setIsOpened(true))
    dispatch(getWordbooks())
  }

  request.onupgradeneeded = function () {
    const db = this.result

    if (!db.objectStoreNames.contains('wordbooks')) {
      db.createObjectStore('wordbooks', {
        autoIncrement: true,
        keyPath: 'clientId'
      })
    }

    if (!db.objectStoreNames.contains('words')) {
      const store = db.createObjectStore('words', {
        autoIncrement: true,
        keyPath: '_id'
      })

      store.createIndex('clientId', 'clientId')

      store.createIndex('wordId', ['word', 'clientId'], {
        unique: true
      })
    }
  }
}

/**
 * Wordbooks
 */

export function getWordbooksFromDB() {
  if (!db) return Promise.reject({ message: 'Database does not exist' })

  const transaction = db.transaction(['wordbooks', 'words'], 'readonly')

  return Promise.all([
    new Promise<Wordbook[]>((resolve, reject) => {
      const store = transaction.objectStore('wordbooks')
      const request = store.getAll()

      request.onerror = function (error) {
        reject(error)
      }

      request.onsuccess = function () {
        if (this.result.length === 0) {
          addWordbookToDB('默认单词本').then(data => {
            localStorage.setItem('DEFAULT_WORDBOOK', String(data.clientId))
            resolve([data])
          })
        } else {
          resolve(this.result)
        }
      }
    }),
    new Promise<Word[]>((resolve, reject) => {
      const store = transaction.objectStore('words')
      const request = store.getAll()

      request.onerror = function (error) {
        reject(error)
      }

      request.onsuccess = function () {
        resolve(this.result)
      }
    })
  ])
}

export function addWordbookToDB(name: string) {
  return new Promise<Wordbook>((resolve, reject) => {
    if (!db) return reject({ message: 'Database does not exist' })

    const store = db.transaction(['wordbooks'], 'readwrite').objectStore('wordbooks')
    const data = { name, createdAt: Date.now() }
    const request = store.add(data)

    request.onerror = function (error) {
      reject(error)
    }

    request.onsuccess = function () {
      resolve({ ...data, clientId: this.result as number })
    }
  })
}

export function deleteWordbookFromDB(clientId: number) {
  if (!db) return Promise.reject({ message: 'Database does not exist' })

  const transaction = db.transaction(['wordbooks', 'words'], 'readwrite')

  return Promise.all([
    new Promise<void>((resolve, reject) => {
      const store = transaction.objectStore('wordbooks')
      const request = store.delete(clientId)

      request.onerror = function (error) {
        reject(error)
      }

      request.onsuccess = function () {
        resolve()
      }
    }),
    clearWordsFromDB(clientId, transaction.objectStore('words'))
  ])
}

export function updateWordbookFromDB(data: Wordbook) {
  return new Promise<Wordbook | void>((resolve, reject) => {
    if (!db) return reject({ message: 'Database does not exist' })

    const store = db.transaction(['wordbooks'], 'readwrite').objectStore('wordbooks')
    const request = store.put(data)

    request.onerror = function (error) {
      reject(error)
    }

    request.onsuccess = function () {
      resolve(data)
    }
  })
}

/**
 * Words
 */

export function addWordToDB(wordList: Omit<Word, '_id'>[], single?: boolean) {
  if (!db) return Promise.reject({ message: 'Database does not exist' })

  if (single) {
    const promises: Promise<Word>[] = []

    for (const item of wordList) {
      const transaction = db.transaction(['words'], 'readwrite')
      const store = transaction.objectStore('words')
      const request = store.add(item)

      promises.push(
        new Promise<Word>((resolve, reject) => {
          request.onerror = function (error) {
            reject(error)
          }

          request.onsuccess = function () {
            resolve({ ...item, _id: this.result as number })
          }
        })
      )
    }

    return allResolved(promises)
  } else {
    const transaction = db.transaction(['words'], 'readwrite')
    const store = transaction.objectStore('words')

    return Promise.all(
      wordList.map(
        item =>
          new Promise<Word>((resolve, reject) => {
            const request = store.add(item)

            request.onerror = function (error) {
              reject(error)
            }

            request.onsuccess = function () {
              resolve({ ...item, _id: this.result as number })
            }
          })
      )
    )
  }
}

export function deleteWordFromDB(idList: number[]) {
  if (!db) return Promise.reject({ message: 'Database does not exist' })

  const transaction = db.transaction(['words'], 'readwrite')
  const store = transaction.objectStore('words')

  return Promise.all(
    idList.map(
      _id =>
        new Promise<void>((resolve, reject) => {
          const request = store.delete(_id)

          request.onerror = function (error) {
            reject(error)
          }

          request.onsuccess = function () {
            resolve()
          }
        })
    )
  )
}

export function updateWordFromDB(wordList: Word[]) {
  if (!db) return Promise.reject({ message: 'Database does not exist' })

  const transaction = db.transaction(['words'], 'readwrite')
  const store = transaction.objectStore('words')

  return Promise.all(
    wordList.map(
      item =>
        new Promise<Word>((resolve, reject) => {
          const request = store.put(item)

          request.onerror = function (error) {
            reject(error)
          }

          request.onsuccess = function () {
            resolve(item)
          }
        })
    )
  )
}

export function clearWordsFromDB(clientId: number, store?: IDBObjectStore) {
  return new Promise<void>((resolve, reject) => {
    if (!db) return reject({ message: 'Database does not exist' })

    store = store || db.transaction(['words'], 'readwrite').objectStore('words')
    const index = store.index('clientId')
    const request = index.openCursor(clientId)

    request.onerror = function (error) {
      reject(error)
    }

    request.onsuccess = function () {
      const cursor = this.result
      if (cursor) {
        cursor.delete()
        cursor.continue()
      } else {
        resolve()
      }
    }
  })
}
