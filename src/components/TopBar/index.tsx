import { useLocation, useNavigate } from 'react-router-dom'
import LeftSmall from '@/icons/LeftSmall'
import ThemeSwitch from '@/components/ThemeSwitch'
import './index.scss'

function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const backArrow = !(location.pathname === '/')

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        {backArrow ? (
          <span className="button" onClick={() => navigate(-1)}>
            <LeftSmall />
          </span>
        ) : (
          <div></div>
        )}
      </div>
      <div className="top-bar-center"></div>
      <div className="top-bar-right">
        <ThemeSwitch />
      </div>
    </div>
  )
}

export default TopBar
