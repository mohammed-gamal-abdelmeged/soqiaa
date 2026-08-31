import { Bell, Menu } from 'lucide-react'

function StoreHeader() {
  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-gray-100 bg-white
        shadow-[0_4px_20px_rgba(0,27,61,0.05)]
      "
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-5">

        {/* Bell */}
       

        {/* Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <img
            src="/src/assets/images/logo.png"
            alt="Souqia Logo"
            className="h-16 w-16 rounded-full object-cover border border-gray-100"
          />
        </div>

        {/* Menu */}
       

      </div>
    </header>
  )
}

export default StoreHeader