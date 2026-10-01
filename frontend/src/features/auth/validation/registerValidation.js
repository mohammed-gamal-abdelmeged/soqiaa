const PHONE_REGEX =
  /^01[0125][0-9]{8}$/

export function validateRegister(
  formData,
) {
  const errors = {}

  const fullName =
    formData.fullName.trim()

  const phone =
    formData.phone
      .trim()
      .replace(/[\s-]/g, '')

  const address =
    formData.address.trim()

  const password =
    formData.password

  const confirmPassword =
    formData.confirmPassword

  if (!fullName) {
    errors.fullName =
      'الاسم بالكامل مطلوب'
  } else if (
    fullName.length < 3
  ) {
    errors.fullName =
      'الاسم لازم يكون 3 حروف على الأقل'
  } else if (
    fullName.length > 120
  ) {
    errors.fullName =
      'الاسم طويل جدًا'
  }

  if (!phone) {
    errors.phone =
      'رقم الموبايل مطلوب'
  } else if (
    !PHONE_REGEX.test(phone)
  ) {
    errors.phone =
      'أدخل رقم موبايل مصري صحيح'
  }

  if (!address) {
    errors.address =
      'عنوان التوصيل مطلوب'
  } else if (
    address.length < 10
  ) {
    errors.address =
      'اكتب عنوان التوصيل بالتفصيل'
  } else if (
    address.length > 500
  ) {
    errors.address =
      'عنوان التوصيل طويل جدًا'
  }

  if (!password) {
    errors.password =
      'الباسورد مطلوب'
  } else if (
    password.length < 8
  ) {
    errors.password =
      'الباسورد لازم يكون 8 حروف على الأقل'
  } else if (
    password.length > 128
  ) {
    errors.password =
      'الباسورد طويل جدًا'
  }

  if (!confirmPassword) {
    errors.confirmPassword =
      'تأكيد الباسورد مطلوب'
  } else if (
    password !==
    confirmPassword
  ) {
    errors.confirmPassword =
      'الباسورد غير متطابق'
  }

  if (
    !formData.termsAccepted
  ) {
    errors.termsAccepted =
      'لازم توافق على الشروط والأحكام'
  }

  return errors
}