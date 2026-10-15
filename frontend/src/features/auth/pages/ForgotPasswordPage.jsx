import { ArrowRight, TriangleAlert } from 'lucide-react'
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
            مع فريق الدعم لمساعدتك بخصوص الحساب.
          </p>
        </div>

        <div
          className="
            mb-6
            rounded-2xl
            border
            border-amber-200
            bg-amber-50
            p-4
          "
        >
          <div className="flex items-start gap-3">
            <TriangleAlert
              size={22}
              className="mt-0.5 shrink-0 text-amber-700"
            />

            <div>
              <p className="font-bold text-amber-950">
                قبل ما تتواصل مع الدعم
              </p>

              <p className="mt-2 text-sm leading-7 text-amber-950/80">
                فريق الدعم لا يقدر يشوف أو يرجع الباسورد الحالي.
                بعد التحقق من ملكية الحساب، الحساب القديم سيتم حذفه بالكامل
                عن طريق الدعم، وبعدها تقدر تعمل حساب جديد.
              </p>
            </div>
          </div>
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