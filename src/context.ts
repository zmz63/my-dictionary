import { createContext } from 'react'
import { IFuncUpdater } from 'ahooks/lib/createUseStorageState'

type ContextValue = {
  theme: string
  setTheme: (value: string | IFuncUpdater<string>) => void
}

export const GlobalContext = createContext<ContextValue>(undefined as unknown as ContextValue)
