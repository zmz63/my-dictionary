import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useLocalStorageState } from 'ahooks'
import { Mask, SpinLoading } from 'antd-mobile'
import { GlobalContext } from './context'
import './utils/db'
import './workers'
import Layout from './layout'
import Home from './pages/home'

const Search = lazy(() => import('./pages/search'))
const Result = lazy(() => import('./pages/result'))
const Create = lazy(() => import('./pages/create'))
const Wordbook = lazy(() => import('./pages/wordbook'))
const Cards = lazy(() => import('./pages/cards'))

function changeTheme(theme: string) {
  if (theme === 'dark') document.documentElement.setAttribute('theme', 'dark')
  else document.documentElement.removeAttribute('theme')
}

function App() {
  const [theme, setTheme] = useLocalStorageState('THEME', { defaultValue: 'light' })

  useEffect(() => {
    changeTheme(theme)
  }, [theme])

  const contextValue = { theme, setTheme }

  return (
    <div className="app">
      <GlobalContext.Provider value={contextValue}>
        <BrowserRouter>
          <Suspense
            fallback={
              <Mask className="mask-container" opacity={0}>
                <SpinLoading color="primary" />
              </Mask>
            }
          >
            <Routes>
              <Route element={<Layout />} path="/">
                <Route element={<Home />} index />
                <Route element={<Search />} path="search" />
                <Route element={<Result />} path="result" />
                <Route element={<Create />} path="create" />
                <Route element={<Wordbook />} path="wordbook/:id" />
                <Route element={<Cards />} path="cards/:id" />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </GlobalContext.Provider>
    </div>
  )
}

export default App
