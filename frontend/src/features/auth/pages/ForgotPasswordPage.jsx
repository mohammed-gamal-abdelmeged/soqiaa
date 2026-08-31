import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import ForgotPasswordForm from '../components/ForgotPasswordForm'

function ForgotPasswordPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <header className="flex h-16 items-center border-b border-gray-100 px-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="رجوع"
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full transition hover:bg-gray-100
          "
        >
          <ArrowRight size={26} />
        </button>

        <div className="flex flex-1 justify-center">
          <span className="text-3xl font-bold tracking-tight">
            Souqia
          </span>
        </div>

        <div className="h-10 w-10" />
      </header>

      <main className="mx-auto w-full max-w-md px-5 pb-12 pt-10">
        <div className="mb-8 text-right">
          <h1 className="text-2xl font-bold text-primary">
            نسيت الباسورد؟
          </h1>

          <p className="mt-2 leading-7 text-text-muted">
            اكتب رقم الموبايل المسجل على حسابك، وهتقدر تتواصل مباشرة
            مع فريق الدعم لمساعدتك في استعادة الحساب.
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            الرجوع لتسجيل الدخول
          </Link>
        </div>
      </main>
    </div>
  )
}

export default ForgotPasswordPage