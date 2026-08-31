import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import RegisterForm from '../components/RegisterForm'

function RegisterPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b border-gray-100 bg-white px-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="رجوع"
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
        >
          <ArrowRight size={26} />
        </button>

        <div className="flex flex-1 justify-center">
          <span className="text-3xl font-bold tracking-tight text-black">
            Souqia
          </span>
        </div>

        <div className="h-10 w-10" />
      </header>

      <main className="mx-auto w-full max-w-2xl px-5 pb-12 pt-8">
        <div className="mb-6 text-right">
          <h1 className="text-2xl font-bold text-primary">
            اعمل حساب جديد
          </h1>

          <p className="mt-2 text-base text-text-muted">
            يلا نبدأ! 🛒
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center">
          <p className="text-base text-text-muted">
            عندك حساب؟{' '}
            <Link
              to="/login"
              className="font-bold text-primary hover:underline"
            >
              سجل دخول
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage