const MAX_PRICE =
  9_999_999_999.99;

const MAX_INT =
  2_147_483_647;

function hasMaxDecimalPlaces(
  value,
  maxPlaces,
) {
  const text =
    String(value);

  const decimalPart =
    text.split(".")[1];

  if (!decimalPart) {
    return true;
  }

  return (
    decimalPart.length <=
    maxPlaces
  );
}

export const createInitialProductForm =
  () => ({
    name: "",
    image: "",
    imageFile: null,

    unit: "",
    price: "",
    stock: "",

    categorySlug: "",
    subcategoryId: "",

    hasDiscount: false,
    discountPercentage: "",

    hasBadge: false,
    badge: "",

    isBestSeller: false,
    isActive: true,

    description: "",
    deliveryText: "",

    rating: "",
    reviewsCount: "",
  });

export function validateProductForm(
  form,
) {
  const errors = {};

  /*
  |--------------------------------------------------------------------------
  | Name
  |--------------------------------------------------------------------------
  */

  const name =
    form.name.trim();

  if (!name) {
    errors.name =
      "اسم المنتج مطلوب";
  } else if (
    name.length < 2
  ) {
    errors.name =
      "اسم المنتج يجب أن يكون حرفين على الأقل";
  } else if (
    name.length > 160
  ) {
    errors.name =
      "اسم المنتج لا يمكن أن يتجاوز 160 حرفًا";
  }

  /*
  |--------------------------------------------------------------------------
  | Image
  |--------------------------------------------------------------------------
  */

  if (!form.image) {
    errors.image =
      "صورة المنتج مطلوبة";
  }

  /*
  |--------------------------------------------------------------------------
  | Unit
  |--------------------------------------------------------------------------
  */

  const unit =
    form.unit.trim();

  if (!unit) {
    errors.unit =
      "وحدة القياس مطلوبة";
  } else if (
    unit.length > 80
  ) {
    errors.unit =
      "وحدة القياس لا يمكن أن تتجاوز 80 حرفًا";
  }

  /*
  |--------------------------------------------------------------------------
  | Price
  |--------------------------------------------------------------------------
  */

  const price =
    Number(form.price);

  if (
    form.price === "" ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
    errors.price =
      "أدخل سعر صحيح أكبر من صفر";
  } else if (
    price > MAX_PRICE
  ) {
    errors.price =
      "السعر أكبر من الحد المسموح";
  } else if (
    !hasMaxDecimalPlaces(
      form.price,
      2,
    )
  ) {
    errors.price =
      "السعر يقبل رقمين فقط بعد العلامة العشرية";
  }

  /*
  |--------------------------------------------------------------------------
  | Stock
  |--------------------------------------------------------------------------
  */

  const stock =
    Number(form.stock);

  if (
    form.stock === "" ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    errors.stock =
      "أدخل كمية مخزون صحيحة";
  } else if (
    stock > MAX_INT
  ) {
    errors.stock =
      "كمية المخزون أكبر من الحد المسموح";
  }

  /*
  |--------------------------------------------------------------------------
  | Category
  |--------------------------------------------------------------------------
  */

  if (!form.categorySlug) {
    errors.categorySlug =
      "اختر القسم الأساسي";
  }

  if (!form.subcategoryId) {
    errors.subcategoryId =
      "اختر القسم الفرعي";
  }

  /*
  |--------------------------------------------------------------------------
  | Discount
  |--------------------------------------------------------------------------
  */

  if (form.hasDiscount) {
    const discount =
      Number(
        form.discountPercentage,
      );

    if (
      form.discountPercentage === "" ||
      !Number.isFinite(
        discount,
      ) ||
      discount <= 0 ||
      discount > 100
    ) {
      errors.discountPercentage =
        "أدخل نسبة خصم أكبر من 0 وحتى 100";
    } else if (
      !hasMaxDecimalPlaces(
        form.discountPercentage,
        2,
      )
    ) {
      errors.discountPercentage =
        "نسبة الخصم تقبل رقمين فقط بعد العلامة العشرية";
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Badge
  |--------------------------------------------------------------------------
  */

  if (form.hasBadge) {
    const badge =
      form.badge.trim();

    if (!badge) {
      errors.badge =
        "اكتب نص البادج";
    } else if (
      badge.length > 80
    ) {
      errors.badge =
        "نص البادج لا يمكن أن يتجاوز 80 حرفًا";
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Description
  |--------------------------------------------------------------------------
  */

  if (
    form.description
      .trim()
      .length > 5000
  ) {
    errors.description =
      "وصف المنتج لا يمكن أن يتجاوز 5000 حرف";
  }

  /*
  |--------------------------------------------------------------------------
  | Delivery Text
  |--------------------------------------------------------------------------
  */

  if (
    form.deliveryText
      .trim()
      .length > 160
  ) {
    errors.deliveryText =
      "نص التوصيل لا يمكن أن يتجاوز 160 حرفًا";
  }

  /*
  |--------------------------------------------------------------------------
  | Rating
  |--------------------------------------------------------------------------
  */

  if (form.rating !== "") {
    const rating =
      Number(form.rating);

    if (
      !Number.isFinite(
        rating,
      ) ||
      rating < 0 ||
      rating > 5
    ) {
      errors.rating =
        "التقييم يجب أن يكون بين 0 و5";
    } else if (
      !hasMaxDecimalPlaces(
        form.rating,
        1,
      )
    ) {
      errors.rating =
        "التقييم يقبل رقمًا واحدًا فقط بعد العلامة العشرية";
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Reviews Count
  |--------------------------------------------------------------------------
  */

  if (
    form.reviewsCount !== ""
  ) {
    const reviewsCount =
      Number(
        form.reviewsCount,
      );

    if (
      !Number.isInteger(
        reviewsCount,
      ) ||
      reviewsCount < 0
    ) {
      errors.reviewsCount =
        "عدد التقييمات يجب أن يكون رقمًا صحيحًا غير سالب";
    } else if (
      reviewsCount >
      MAX_INT
    ) {
      errors.reviewsCount =
        "عدد التقييمات أكبر من الحد المسموح";
    }
  }

  return errors;
}

export function buildProductPayload(
  form,
) {
  return {
    name:
      form.name.trim(),

    imageFile:
      form.imageFile,

    unit:
      form.unit.trim(),

    price:
      Number(
        form.price,
      ),

    stock:
      Number(
        form.stock,
      ),

    categorySlug:
      form.categorySlug,

    /*
     * مهم:
     * subcategoryId في الـBackend UUID
     * لذلك لا نحوله إلى Number.
     */
    subcategoryId:
      form.subcategoryId,

    discountPercentage:
      form.hasDiscount
        ? Number(
            form.discountPercentage,
          )
        : 0,

    description:
      form.description
        .trim(),

    badge:
      form.hasBadge
        ? form.badge.trim()
        : null,

    deliveryText:
      form.deliveryText
        .trim(),

    isBestSeller:
      form.isBestSeller,

    isActive:
      form.isActive,

    rating:
      form.rating === ""
        ? 0
        : Number(
            form.rating,
          ),

    reviewsCount:
      form.reviewsCount === ""
        ? 0
        : Number(
            form.reviewsCount,
          ),
  };
}