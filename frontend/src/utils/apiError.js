const ERROR_MESSAGES = {
  INVALID_CREDENTIALS:
    "رقم الموبايل أو كلمة المرور غير صحيحة",

  ACCOUNT_DISABLED:
    "الحساب موقوف حاليًا، تواصل مع الدعم",

  AUTHENTICATION_REQUIRED:
    "برجاء تسجيل الدخول مرة أخرى",

  ADMIN_ACCESS_REQUIRED:
    "ليس لديك صلاحية للدخول إلى هذه الصفحة",

  INSUFFICIENT_PERMISSIONS:
    "ليس لديك صلاحية لتنفيذ هذا الإجراء",

  INVALID_CSRF_TOKEN:
    "انتهت صلاحية الجلسة، حاول مرة أخرى",

  PHONE_ALREADY_REGISTERED:
    "رقم الموبايل مسجل بالفعل",

  PRODUCT_NOT_FOUND:
    "المنتج غير موجود",

  PRODUCT_UNAVAILABLE:
    "المنتج غير متوفر حاليًا",

  PRODUCT_OUT_OF_STOCK:
    "المنتج نفد من المخزون",

  CART_ITEM_NOT_FOUND:
    "المنتج غير موجود في السلة",

  CART_EMPTY:
    "السلة فاضية، ضيف منتجات الأول",

  FAVORITE_ALREADY_EXISTS:
    "المنتج موجود بالفعل في المفضلة",

  FAVORITE_NOT_FOUND:
    "المنتج غير موجود في المفضلة",

  COUPON_NOT_FOUND:
    "كود الخصم غير موجود",

  COUPON_INACTIVE:
    "كود الخصم غير متاح حاليًا",

  COUPON_NOT_STARTED:
    "كود الخصم لم يبدأ بعد",

  COUPON_EXPIRED:
    "كود الخصم انتهت صلاحيته",

  COUPON_USAGE_LIMIT_REACHED:
    "تم الوصول للحد الأقصى لاستخدام كود الخصم",

  COUPON_USER_LIMIT_REACHED:
    "استخدمت كود الخصم الحد الأقصى المسموح لك",

  ORDER_NOT_FOUND:
    "الطلب غير موجود",

  USER_NOT_FOUND:
    "بيانات المستخدم غير موجودة",

  SUBCATEGORY_NOT_FOUND:
    "القسم الفرعي غير موجود",

  INVALID_PRODUCT_CATEGORY:
    "القسم المحدد للمنتج غير صحيح",
};

const VALIDATION_MESSAGES = {
  "Enter a valid Egyptian phone number":
    "اكتب رقم موبايل مصري صحيح",

  "Full name must be at least 3 characters":
    "الاسم لازم يكون 3 حروف على الأقل",

  "Full name must not exceed 120 characters":
    "الاسم لازم مايزدش عن 120 حرف",

  "Customer name must be at least 3 characters":
    "الاسم لازم يكون 3 حروف على الأقل",

  "Customer name must not exceed 120 characters":
    "الاسم لازم مايزدش عن 120 حرف",

  "Address must be at least 10 characters":
    "العنوان لازم يكون 10 حروف على الأقل",

  "Address must not exceed 500 characters":
    "العنوان لازم مايزدش عن 500 حرف",

  "Delivery address must be at least 10 characters":
    "عنوان التوصيل لازم يكون 10 حروف على الأقل",

  "Delivery address must not exceed 500 characters":
    "عنوان التوصيل لازم مايزدش عن 500 حرف",

  "Password is required":
    "اكتب كلمة المرور",

  "Password must be at least 8 characters":
    "كلمة المرور لازم تكون 8 حروف على الأقل",

  "Password must not exceed 128 characters":
    "كلمة المرور طويلة جدًا",

  "Passwords do not match":
    "كلمتا المرور غير متطابقتين",

  "Terms and conditions must be accepted":
    "لازم توافق على الشروط والأحكام",

  "Coupon code is required":
    "اكتب كود الخصم",

  "Coupon code must not exceed 50 characters":
    "كود الخصم طويل جدًا",

  "Quantity must be an integer":
    "الكمية لازم تكون رقم صحيح",

  "Quantity must be at least 1":
    "الكمية لازم تكون 1 على الأقل",

  "Quantity is too large":
    "الكمية المطلوبة كبيرة جدًا",

  "Invalid product ID":
    "المنتج غير صحيح",

  "Invalid order ID":
    "رقم الطلب غير صحيح",

  "At least one field must be provided":
    "لازم تعدل بيان واحد على الأقل",
};

const FIELD_LABELS = {
  fullName:
    "الاسم",

  customerName:
    "الاسم",

  phone:
    "رقم الموبايل",

  customerPhone:
    "رقم الموبايل",

  address:
    "العنوان",

  deliveryAddress:
    "عنوان التوصيل",

  password:
    "كلمة المرور",

  confirmPassword:
    "تأكيد كلمة المرور",

  termsAccepted:
    "الشروط والأحكام",

  couponCode:
    "كود الخصم",

  quantity:
    "الكمية",

  productId:
    "المنتج",

  id:
    "المعرّف",
};

function containsArabic(
  value,
) {
  return /[\u0600-\u06FF]/.test(
    value || "",
  );
}

function translateValidationDetail(
  detail,
) {
  const originalMessage =
    detail?.message || "";

  const translatedMessage =
    VALIDATION_MESSAGES[
      originalMessage
    ];

  if (
    translatedMessage
  ) {
    return {
      ...detail,

      message:
        translatedMessage,
    };
  }

  if (
    containsArabic(
      originalMessage,
    )
  ) {
    return detail;
  }

  const field =
    detail?.field;

  const fieldLabel =
    FIELD_LABELS[field];

  if (
    fieldLabel
  ) {
    return {
      ...detail,

      message:
        `${fieldLabel} غير صحيح`,
    };
  }

  return {
    ...detail,

    message:
      "راجع البيانات المدخلة وحاول مرة أخرى",
  };
}

function translateValidationDetails(
  details,
) {
  if (
    !Array.isArray(
      details,
    )
  ) {
    return null;
  }

  return details.map(
    translateValidationDetail,
  );
}

function getDynamicErrorMessage(
  code,
  message,
) {
  if (
    code ===
    "INSUFFICIENT_STOCK"
  ) {
    const stockMatch =
      message?.match(
        /Only\s+(\d+)\s+item\(s\)(?:\s+of\s+"([^"]+)")?\s+are currently available/i,
      );

    if (
      stockMatch
    ) {
      const availableQuantity =
        stockMatch[1];

      const productName =
        stockMatch[2];

      if (
        productName
      ) {
        return `المتاح حاليًا من "${productName}" هو ${availableQuantity} فقط`;
      }

      return `الكمية المتاحة حاليًا هي ${availableQuantity} فقط`;
    }

    const productMatch =
      message?.match(
        /Product\s+"([^"]+)"\s+no longer has enough stock/i,
      );

    if (
      productMatch
    ) {
      return `الكمية المطلوبة من "${productMatch[1]}" لم تعد متوفرة`;
    }

    return "الكمية المطلوبة غير متوفرة حاليًا";
  }

  if (
    code ===
    "COUPON_MIN_ORDER_NOT_MET"
  ) {
    const amountMatch =
      message?.match(
        /Minimum order amount for this coupon is\s+([0-9.]+)/i,
      );

    if (
      amountMatch
    ) {
      return `الحد الأدنى لاستخدام كود الخصم هو ${amountMatch[1]} ج.م`;
    }

    return "قيمة الطلب أقل من الحد الأدنى المطلوب لاستخدام كود الخصم";
  }

  return null;
}

function getApiErrorMessage(
  apiError,
  status,
  translatedDetails,
) {
  const code =
    apiError?.code;

  const originalMessage =
    apiError?.message;

  if (
    code ===
      "VALIDATION_ERROR" &&
    translatedDetails?.length
  ) {
    return translatedDetails[0]
      .message;
  }

  const dynamicMessage =
    getDynamicErrorMessage(
      code,
      originalMessage,
    );

  if (
    dynamicMessage
  ) {
    return dynamicMessage;
  }

  if (
    ERROR_MESSAGES[
      code
    ]
  ) {
    return ERROR_MESSAGES[
      code
    ];
  }

  if (
    containsArabic(
      originalMessage,
    )
  ) {
    return originalMessage;
  }

  return getDefaultErrorMessage(
    status,
  );
}

export function normalizeApiError(
  error,
) {
  if (
    error.response
  ) {
    const status =
      error.response.status;

    const data =
      error.response.data;

    const apiError =
      data?.error;

    const translatedDetails =
      translateValidationDetails(
        apiError?.details ||
          data?.errors,
      );

    return {
      status,

      code:
        apiError?.code ||
        null,

      message:
        getApiErrorMessage(
          apiError,
          status,
          translatedDetails,
        ),

      errors:
        translatedDetails,

      data,
    };
  }

  if (
    error.request
  ) {
    return {
      status: null,

      code: null,

      message:
        "تعذر الاتصال بالسيرفر، تأكد من الإنترنت وحاول مرة أخرى",

      errors: null,

      data: null,
    };
  }

  return {
    status: null,

    code: null,

    message:
      containsArabic(
        error.message,
      )
        ? error.message
        : "حدث خطأ غير متوقع، حاول مرة أخرى",

    errors: null,

    data: null,
  };
}

function getDefaultErrorMessage(
  status,
) {
  switch (
    status
  ) {
    case 400:
      return "راجع البيانات المدخلة وحاول مرة أخرى";

    case 401:
      return "رقم الموبايل أو كلمة المرور غير صحيحة";

    case 403:
      return "ليس لديك صلاحية لتنفيذ هذا الإجراء";

    case 404:
      return "المحتوى المطلوب غير موجود";

    case 409:
      return "تعذر تنفيذ العملية بسبب تعارض في البيانات";

    case 422:
      return "راجع البيانات المدخلة وحاول مرة أخرى";

    case 429:
      return "محاولات كثيرة، حاول مرة أخرى بعد قليل";

    case 500:
      return "حدث خطأ في السيرفر، حاول مرة أخرى";

    case 502:
    case 503:
    case 504:
      return "الخدمة غير متاحة حاليًا، حاول مرة أخرى بعد قليل";

    default:
      return "حدث خطأ غير متوقع، حاول مرة أخرى";
  }
}