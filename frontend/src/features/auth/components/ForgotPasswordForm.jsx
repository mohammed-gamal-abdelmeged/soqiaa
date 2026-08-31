import { useState } from 'react'
import { Smartphone, MessageCircle } from 'lucide-react'

import TextField from '../../../components/ui/TextField'
import { validateForgotPassword } from '../validation/forgotPasswordValidation'

const initialFormData = {
  mobileNumber: '',
}

function ForgotPasswordForm() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    const updatedFormData = {
      ...formData,
      [name]: value,
    }

    setFormData(updatedFormData)

    if (touched[name]) {
      const validationErrors = validateForgotPassword(updatedFormData)

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

    const validationErrors = validateForgotPassword(formData)

    setErrors((current) => ({
      ...current,
      [name]: validationErrors[name],
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationErrors = validateForgotPassword(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setTouched({ mobileNumber: true })
      return
    }

    const supportNumber = '201004201439'

    const message = `
مرحبًا فريق الدعم،
أنا صاحب الرقم ${formData.mobileNumber}
ونسيت كلمة المرور الخاصة بحسابي وأحتاج مساعدة في استعادتها.
    `.trim()

    const whatsappUrl =
      `https://wa.me/${supportNumber}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      <TextField
        label="رقم الموبايل"
        id="mobileNumber"
        type="tel"
        value={formData.mobileNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="01X XXXX XXXX"
        autoComplete="tel"
        error={errors.mobileNumber}
        icon={Smartphone}
      />

      <button
        type="submit"
        className="
          flex w-full items-center justify-center gap-2
          rounded-xl bg-secondary py-4
          text-lg font-semibold text-white
          transition
          hover:opacity-90
          active:scale-[0.98]
        "
      >
        <MessageCircle size={22} />
        تواصل مع الدعم عبر واتساب
      </button>
    </form>
  )
}

export default ForgotPasswordForm