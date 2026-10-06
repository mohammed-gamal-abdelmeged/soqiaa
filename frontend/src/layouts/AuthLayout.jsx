import { Outlet } from 'react-router-dom'

function AuthLayout({ children }) {
  return (
    <main
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-white
        px-5
        py-8
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-72
          bg-gradient-to-b
          from-secondary/10
          via-secondary/5
          to-transparent
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[calc(100vh-4rem)]
          w-full
          max-w-md
          -translate-y-8
          flex-col
          justify-center
        "
      >
        {children || <Outlet />}
      </div>
    </main>
  )
}

export default AuthLayout