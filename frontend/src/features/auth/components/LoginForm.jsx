import { useState } from 'react'
import { Link } from 'react-router-dom'

import TextField from '../../../components/ui/TextField'
import PasswordField from '../../../components/ui/PasswordField'

import { validateLogin } from '../validation/loginValidation'
import { showSuccess } from '../../../lib/toast'

const initialFormData = {
  identifier: '',
  password: '',
}

function LoginForm() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    const updatedFormData = {
      ...formData,
      [name]: value,
    }

    setFormData(updatedFormData)

    if (touched[name]) {
      const validationErrors = validateLogin(updatedFormData)

      setErrors((current) => ({
        ...current,
        [name]: validationErrors[name],
      }))
    }
  }

  const handleBlur = (event) => {
    const { name } = event.target

    setTouched((current) => ({
      ...current,
      [name]: true,
    }))

    const validationErrors = validateLogin(formData)

    setErrors((current) => ({
      ...current,
      [name]: validationErrors[name],
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationErrors = validateLogin(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)

      setTouched({
        identifier: true,
        password: true,
      })

      return
    }

    setIsSubmitting(true)

    try {
      // مؤقت فقط لحد ما نوصل الـ Backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      showSuccess('تم تسجيل الدخول بنجاح')

      console.log('Login data:', formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
    >
      <TextField
        label="رقم الموبايل أو الإيميل"
        id="identifier"
        value={formData.identifier}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="أدخل رقم الموبايل أو الإيميل"
        autoComplete="username"
        error={errors.identifier}
        disabled={isSubmitting}
      />

      <div>
        <PasswordField
          label="الباسورد"
          id="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="أدخل الباسورد"
          autoComplete="current-password"
          error={errors.password}
          disabled={isSubmitting}
        />

        <div className="mt-2">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-secondary transition hover:underline"
          >
            نسيت الباسورد؟
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          mt-3 w-full rounded-xl bg-secondary py-4
          text-xl font-semibold text-white
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          transition
          hover:opacity-90
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-60
          disabled:active:scale-100
        "
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            جاري الدخول...
          </span>
        ) : (
          'دخول'
        )}
      </button>
    </form>
  )
}

export default LoginForm