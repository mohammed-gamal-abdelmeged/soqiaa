const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^01[0125][0-9]{8}$/

export function validateLogin(formData) {
  const errors = {}

  const identifier = formData.identifier.trim()
  const password = formData.password

  if (!identifier) {
    errors.identifier = 'رقم الموبايل أو الإيميل مطلوب'
  } else if (
    !EMAIL_REGEX.test(identifier) &&
    !PHONE_REGEX.test(identifier)
  ) {
    errors.identifier = 'أدخل رقم موبايل أو إيميل صحيح'
  }

  if (!password) {
    errors.password = 'الباسورد مطلوب'
  }

  return errors
}