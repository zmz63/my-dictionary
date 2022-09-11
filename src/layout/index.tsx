import { Outlet } from 'react-router-dom'
import TopBar from '@/components/TopBar'
import './index.scss'

function Layout() {
  return (
    <div className="layout">
      <TopBar />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
