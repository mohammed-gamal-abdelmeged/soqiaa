const PHONE_REGEX =
  /^01[0125][0-9]{8}$/

export function validateLogin(
  formData,
) {
  const errors = {}

  const phone =
    formData.phone
      .trim()
      .replace(/[\s-]/g, '')

  const password =
    formData.password

  if (!phone) {
    errors.phone =
      'رقم الموبايل مطلوب'
  } else if (
    !PHONE_REGEX.test(phone)
  ) {
    errors.phone =
      'أدخل رقم موبايل مصري صحيح'
  }

  if (!password) {
    errors.password =
      'الباسورد مطلوب'
  }

  return errors
}