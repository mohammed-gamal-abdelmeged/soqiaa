import { Link } from 'react-router-dom'

import AuthHeader from '../components/AuthHeader'
import RegisterForm from '../components/RegisterForm'

function RegisterPage() {
  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden
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

      <main
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[calc(100vh-4rem)]
          w-full
          max-w-md
          flex-col
          justify-center
          py-4
        "
      >
        <AuthHeader
          title="اعمل حساب جديد"
          subtitle="يلا بينا!"
          animateTitle
        />

        <RegisterForm />

        <div
          className="
            mt-5
            text-center
          "
        >
          <p
            className="
              text-sm
              text-text-muted
            "
          >
            عندك حساب؟{' '}

            <Link
              to="/login"
              className="
                font-bold
                text-primary
                transition
                hover:underline
              "
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