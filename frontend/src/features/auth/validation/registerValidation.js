const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^01[0125][0-9]{8}$/

export function validateRegister(formData) {
  const errors = {}

  const fullName = formData.fullName.trim()
  const mobileNumber = formData.mobileNumber.trim()
  const email = formData.email.trim()

  if (!fullName) {
    errors.fullName = 'الاسم بالكامل مطلوب'
  } else if (fullName.length < 3) {
    errors.fullName = 'الاسم قصير جدًا'
  }

  if (!mobileNumber) {
    errors.mobileNumber = 'رقم الموبايل مطلوب'
  } else if (!PHONE_REGEX.test(mobileNumber)) {
    errors.mobileNumber = 'أدخل رقم موبايل صحيح'
  }

  if (!email) {
    errors.email = 'الإيميل مطلوب'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'أدخل إيميل صحيح'
  }

  if (!formData.password) {
    errors.password = 'الباسورد مطلوب'
  } else if (formData.password.length < 6) {
    errors.password = 'الباسورد لازم يكون 6 حروف على الأقل'
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'تأكيد الباسورد مطلوب'
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'الباسورد غير متطابق'
  }

  if (!formData.terms) {
    errors.terms = 'لازم توافق على الشروط والأحكام'
  }

  return errors
}