import { Link } from 'react-router-dom'
import AuthLayout from '../../../layouts/AuthLayout'
import AuthHeader from '../components/AuthHeader'
import LoginForm from '../components/LoginForm'

function LoginPage() {
  return (
    <AuthLayout>
      <AuthHeader
        title="أهلاً بيك تاني 👋"
        subtitle="سجل دخولك عشان تكمّل"
      />

      <LoginForm />

      <div className="mt-6 text-center">
        <p className="text-base text-text-muted">
          لسه معملتش حساب؟{' '}
          <Link
            to="/register"
            className="font-bold text-primary transition hover:underline"
          >
            اعمل حساب
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default LoginPage