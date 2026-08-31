import { Outlet } from 'react-router-dom'

function AuthLayout({ children }) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {children || <Outlet />}
      </div>
    </main>
  )
}

export default AuthLayout