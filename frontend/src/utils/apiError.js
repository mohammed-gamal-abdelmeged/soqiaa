export function normalizeApiError(error) {
  if (error.response) {
    const status = error.response.status
    const data = error.response.data

    const apiError = data?.error

    return {
      status,

      code:
        apiError?.code ||
        null,

      message:
        apiError?.message ||
        data?.message ||
        getDefaultErrorMessage(status),

      errors:
        apiError?.details ||
        data?.errors ||
        null,

      data,
    }
  }

  if (error.request) {
    return {
      status: null,
      code: null,
      message: 'تعذر الاتصال بالسيرفر، حاول مرة أخرى',
      errors: null,
      data: null,
    }
  }

  return {
    status: null,
    code: null,
    message:
      error.message ||
      'حدث خطأ غير متوقع',
    errors: null,
    data: null,
  }
}

function getDefaultErrorMessage(status) {
  switch (status) {
    case 400:
      return 'البيانات المرسلة غير صحيحة'

    case 401:
      return 'برجاء تسجيل الدخول مرة أخرى'

    case 403:
      return 'ليس لديك صلاحية لتنفيذ هذا الإجراء'

    case 404:
      return 'المحتوى المطلوب غير موجود'

    case 409:
      return 'حدث تعارض في البيانات'

    case 422:
      return 'يرجى مراجعة البيانات المدخلة'

    case 429:
      return 'محاولات كثيرة، حاول مرة أخرى بعد قليل'

    case 500:
      return 'حدث خطأ في السيرفر، حاول مرة أخرى'

    default:
      return 'حدث خطأ غير متوقع'
  }
}