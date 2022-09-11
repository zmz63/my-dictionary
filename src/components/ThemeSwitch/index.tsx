import { useContext } from 'react'
import { useThrottleFn } from 'ahooks'
import { GlobalContext } from '@/context'
import DarkOutline from '@/icons/Dark'
import LightOutline from '@/icons/Light'
import './index.scss'

function ThemeSwitch() {
  const { theme, setTheme } = useContext(GlobalContext)

  const { run } = useThrottleFn(() => setTheme(theme => (theme === 'light' ? 'dark' : 'light')), {
    wait: 200,
    trailing: false
  })

  return (
    <div className="theme-switch" onClick={run}>
      <div className="theme-switch-handler">
        {theme === 'light' ? <LightOutline /> : <DarkOutline />}
      </div>
    </div>
  )
}

export default ThemeSwitch
