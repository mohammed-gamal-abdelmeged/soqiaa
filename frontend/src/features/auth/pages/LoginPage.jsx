import { Link } from 'react-router-dom'

import AuthLayout from '../../../layouts/AuthLayout'
import AuthHeader from '../components/AuthHeader'
import LoginForm from '../components/LoginForm'

function LoginPage() {
  return (
    <AuthLayout>
      <AuthHeader
        title="أهلاً بيك في سوقيا"
        subtitle="سجل دخولك عشان تكمّل"
        animateTitle
      />

      <LoginForm />

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
          لسه معملتش حساب؟{' '}

          <Link
            to="/register"
            className="
              font-bold
              text-primary
              transition
              hover:underline
            "
          >
            اعمل حساب
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default LoginPage