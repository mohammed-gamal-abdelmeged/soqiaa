const PHONE_REGEX = /^01[0125][0-9]{8}$/

export function validateForgotPassword(formData) {
  const errors = {}

  const mobileNumber = formData.mobileNumber.trim()

  if (!mobileNumber) {
    errors.mobileNumber = 'رقم الموبايل مطلوب'
  } else if (!PHONE_REGEX.test(mobileNumber)) {
    errors.mobileNumber = 'أدخل رقم موبايل مصري صحيح'
  }

  return errors
}