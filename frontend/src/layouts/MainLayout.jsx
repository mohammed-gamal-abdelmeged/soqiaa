import { Outlet } from 'react-router-dom'

import StoreHeader from '../components/layout/StoreHeader'
import BottomNav from '../components/layout/BottomNav'

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-text-main">
      <StoreHeader />

      <main className="pb-24">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}

export default MainLayout