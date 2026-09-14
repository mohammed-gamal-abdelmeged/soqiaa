export const createInitialProductForm = () => ({
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

export function validateProductForm(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "اسم المنتج مطلوب";
  }

  if (!form.image) {
    errors.image = "صورة المنتج مطلوبة";
  }

  if (!form.unit.trim()) {
    errors.unit = "وحدة القياس مطلوبة";
  }

  if (
    form.price === "" ||
    Number(form.price) <= 0
  ) {
    errors.price =
      "أدخل سعر صحيح أكبر من صفر";
  }

  if (
    form.stock === "" ||
    Number(form.stock) < 0
  ) {
    errors.stock =
      "أدخل كمية مخزون صحيحة";
  }

  if (!form.categorySlug) {
    errors.categorySlug =
      "اختر القسم الأساسي";
  }

  if (!form.subcategoryId) {
    errors.subcategoryId =
      "اختر القسم الفرعي";
  }

  if (form.hasDiscount) {
    const discount = Number(
      form.discountPercentage,
    );

    if (
      !form.discountPercentage ||
      discount <= 0 ||
      discount > 100
    ) {
      errors.discountPercentage =
        "أدخل نسبة خصم من 1 إلى 100";
    }
  }

  if (
    form.hasBadge &&
    !form.badge.trim()
  ) {
    errors.badge =
      "اكتب نص البادج";
  }

  if (
    form.rating !== "" &&
    (
      Number(form.rating) < 0 ||
      Number(form.rating) > 5
    )
  ) {
    errors.rating =
      "التقييم يجب أن يكون بين 0 و5";
  }

  if (
    form.reviewsCount !== "" &&
    Number(form.reviewsCount) < 0
  ) {
    errors.reviewsCount =
      "عدد التقييمات لا يمكن أن يكون سالبًا";
  }

  return errors;
}

export function buildProductPayload(form) {
  return {
    name: form.name.trim(),

    image: form.image,
    imageFile: form.imageFile,

    unit: form.unit.trim(),

    price: Number(form.price),

    discountPercentage:
      form.hasDiscount
        ? Number(
            form.discountPercentage,
          )
        : 0,

    description:
      form.description.trim(),

    badge:
      form.hasBadge
        ? form.badge.trim()
        : null,

    isBestSeller:
      form.isBestSeller,

    rating:
      form.rating === ""
        ? 0
        : Number(form.rating),

    reviewsCount:
      form.reviewsCount === ""
        ? 0
        : Number(form.reviewsCount),

    deliveryText:
      form.deliveryText.trim(),

    categorySlug:
      form.categorySlug,

    subcategoryId:
      Number(form.subcategoryId),

    stock:
      Number(form.stock),

    isActive:
      form.isActive,
  };
}