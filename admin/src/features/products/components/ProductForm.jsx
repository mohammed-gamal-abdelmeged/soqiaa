// src/features/products/components/ProductForm.jsx

import { useEffect, useState } from "react";

import StatusSwitch from "../../../components/ui/StatusSwitch";
import ProductImageUpload from "./ProductImageUpload";

import {
  buildProductPayload,
  createInitialProductForm,
  validateProductForm,
} from "../utils/productForm";

export default function ProductForm({
  mode = "add",
  initialData = null,
  categories,
  categoryDetails,
  onSubmit,
}) {
  const [form, setForm] = useState(
    createInitialProductForm,
  );

  const [errors, setErrors] = useState({});

  /*
    ========================================
    Fill form when editing
    ========================================
  */

  useEffect(() => {
    if (
      mode === "edit" &&
      initialData
    ) {
      setForm({
        ...createInitialProductForm(),

        name:
          initialData.name ?? "",

        image:
          initialData.image ?? "",

        imageFile: null,

        unit:
          initialData.unit ?? "",

        price:
          initialData.price != null
            ? String(initialData.price)
            : "",

        stock:
          initialData.stock != null
            ? String(initialData.stock)
            : "",

        categorySlug:
          initialData.categorySlug ?? "",

        subcategoryId:
          initialData.subcategoryId != null
            ? String(
                initialData.subcategoryId,
              )
            : "",

        hasDiscount:
          Number(
            initialData.discountPercentage,
          ) > 0,

        discountPercentage:
          Number(
            initialData.discountPercentage,
          ) > 0
            ? String(
                initialData.discountPercentage,
              )
            : "",

        hasBadge:
          Boolean(initialData.badge),

        badge:
          initialData.badge ?? "",

        isBestSeller:
          initialData.isBestSeller ??
          false,

        isActive:
          initialData.isActive ?? true,

        description:
          initialData.description ?? "",

        deliveryText:
          initialData.deliveryText ?? "",

        rating:
          initialData.rating != null
            ? String(initialData.rating)
            : "",

        reviewsCount:
          initialData.reviewsCount != null
            ? String(
                initialData.reviewsCount,
              )
            : "",
      });

      setErrors({});

      return;
    }

    /*
      Add mode
    */

    setForm(
      createInitialProductForm(),
    );

    setErrors({});
  }, [mode, initialData]);

  /*
    ========================================
    Selected Category / Subcategories
    ========================================
  */

  const selectedCategoryDetails =
    form.categorySlug
      ? categoryDetails[
          form.categorySlug
        ]
      : null;

  const subcategories =
    selectedCategoryDetails
      ?.subcategories ?? [];

  /*
    ========================================
    Generic Field Update
    ========================================
  */

  const updateField = (
    field,
    value,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    /*
      Remove validation error
      when user edits the field.
    */

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: "",
      }));
    }
  };

  /*
    ========================================
    Category Change
    ========================================
  */

  const handleCategoryChange = (
    categorySlug,
  ) => {
    setForm((current) => ({
      ...current,

      categorySlug,

      /*
        Important:
        Reset subcategory because
        it belongs to the previous category.
      */
      subcategoryId: "",
    }));

    setErrors((current) => ({
      ...current,
      categorySlug: "",
      subcategoryId: "",
    }));
  };

  /*
    ========================================
    Image Change
    ========================================
  */

  const handleImageChange = ({
    file,
    preview,
    error,
  }) => {
    /*
      If ProductImageUpload sends an error,
      keep the current image when editing.
    */

    if (error) {
      setErrors((current) => ({
        ...current,
        image: error,
      }));

      return;
    }

    setForm((current) => ({
      ...current,
      imageFile: file,
      image: preview,
    }));

    setErrors((current) => ({
      ...current,
      image: "",
    }));
  };

  /*
    ========================================
    Submit
    ========================================
  */

  const handleSubmit = (
    event,
  ) => {
    event.preventDefault();

    const nextErrors =
      validateProductForm(form);

    setErrors(nextErrors);

    if (
      Object.keys(nextErrors)
        .length > 0
    ) {
      return;
    }

    const payload =
      buildProductPayload(form);

    onSubmit(payload);
  };

  return (
    <form
      id="product-form"
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]"
    >
      {/* =================================
          IMAGE
      ================================= */}

      <div>
        <ProductImageUpload
          image={form.image}
          error={errors.image}
          onChange={
            handleImageChange
          }
        />
      </div>

      {/* =================================
          MAIN FORM
      ================================= */}

      <div className="space-y-6">
        {/* Product Name */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700"> 
            اسم المنتج
             <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(event) =>
              updateField(
                "name",
                event.target.value,
              )
            }
            placeholder="أدخل اسم المنتج"
            autoFocus={
              mode === "add"
            }
            className={[
              "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",
              errors.name
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
            ].join(" ")}
          />

          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* =================================
            CATEGORY
        ================================= */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Main Category */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              القسم الأساسي
               <span className="text-red-500">*</span>
            </label>

            <select
              value={
                form.categorySlug
              }
              onChange={(event) =>
                handleCategoryChange(
                  event.target.value,
                )
              }
              className={[
                "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none transition",
                errors.categorySlug
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
              ].join(" ")}
            >
              <option value="">
                اختر القسم
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      category.slug
                    }
                  >
                    {category.name}
                  </option>
                ),
              )}
            </select>

            {errors.categorySlug && (
              <p className="mt-1.5 text-xs text-red-600">
                {
                  errors.categorySlug
                }
              </p>
            )}
          </div>

          {/* Subcategory */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              القسم الفرعي
               <span className="text-red-500">*</span>
            </label>

            <select
              value={
                form.subcategoryId
              }
              disabled={
                !form.categorySlug
              }
              onChange={(event) =>
                updateField(
                  "subcategoryId",
                  event.target.value,
                )
              }
              className={[
                "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
                errors.subcategoryId
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
              ].join(" ")}
            >
              <option value="">
                {form.categorySlug
                  ? "اختر القسم الفرعي"
                  : "اختر القسم الأساسي أولاً"}
              </option>

              {subcategories.map(
                (subcategory) => (
                  <option
                    key={
                      subcategory.id
                    }
                    value={
                      subcategory.id
                    }
                  >
                    {
                      subcategory.name
                    }
                  </option>
                ),
              )}
            </select>

            {errors.subcategoryId && (
              <p className="mt-1.5 text-xs text-red-600">
                {
                  errors.subcategoryId
                }
              </p>
            )}
          </div>
        </div>

        {/* =================================
            UNIT / PRICE / STOCK
        ================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Unit */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              الوزن / وحدة القياس
               <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={form.unit}
              onChange={(event) =>
                updateField(
                  "unit",
                  event.target.value,
                )
              }
              placeholder="مثال: 1 كيلو"
              className={[
                "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",
                errors.unit
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
              ].join(" ")}
            />

            {errors.unit && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.unit}
              </p>
            )}
          </div>

          {/* Price */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              السعر
               <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                updateField(
                  "price",
                  event.target.value,
                )
              }
              placeholder="0.00"
              className={[
                "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",
                errors.price
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
              ].join(" ")}
            />

            {errors.price && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.price}
              </p>
            )}
          </div>

          {/* Stock */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              المخزون
               <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(event) =>
                updateField(
                  "stock",
                  event.target.value,
                )
              }
              placeholder="0"
              className={[
                "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",
                errors.stock
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
              ].join(" ")}
            />

            {errors.stock && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.stock}
              </p>
            )}
          </div>
        </div>

        {/* =================================
            TOGGLES
        ================================= */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ToggleCard
            label="نشط"
            value={form.isActive}
            onChange={(value) =>
              updateField(
                "isActive",
                value,
              )
            }
          />

          <ToggleCard
            label="الأكثر مبيعاً"
            value={
              form.isBestSeller
            }
            onChange={(value) =>
              updateField(
                "isBestSeller",
                value,
              )
            }
          />

          <ToggleCard
            label="يوجد خصم"
            value={
              form.hasDiscount
            }
            onChange={(value) => {
              setForm((current) => ({
                ...current,

                hasDiscount:
                  value,

                /*
                  Clear discount value
                  when disabled.
                */
                discountPercentage:
                  value
                    ? current.discountPercentage
                    : "",
              }));

              setErrors(
                (current) => ({
                  ...current,
                  discountPercentage:
                    "",
                }),
              );
            }}
          />

          <ToggleCard
            label="يوجد بادج"
            value={form.hasBadge}
            onChange={(value) => {
              setForm((current) => ({
                ...current,

                hasBadge: value,

                badge: value
                  ? current.badge
                  : "",
              }));

              setErrors(
                (current) => ({
                  ...current,
                  badge: "",
                }),
              );
            }}
          />
        </div>

        {/* =================================
            DISCOUNT
        ================================= */}

        {form.hasDiscount && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              نسبة الخصم
               <span className="text-red-500">*</span>
            </label>

            <div className="relative max-w-xs">
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                value={
                  form.discountPercentage
                }
                onChange={(event) =>
                  updateField(
                    "discountPercentage",
                    event.target.value,
                  )
                }
                placeholder="10"
                className={[
                  "h-11 w-full rounded-xl border px-4 pl-10 text-sm outline-none transition",
                  errors.discountPercentage
                    ? "border-red-300 focus:border-red-500"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
                ].join(" ")}
              />

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                %
              </span>
            </div>

            {errors.discountPercentage && (
              <p className="mt-1.5 text-xs text-red-600">
                {
                  errors.discountPercentage
                }
              </p>
            )}
          </div>
        )}

        {/* =================================
            BADGE
        ================================= */}

        {form.hasBadge && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              نص البادج
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={form.badge}
              onChange={(event) =>
                updateField(
                  "badge",
                  event.target.value,
                )
              }
              placeholder="مثال: مميز"
              className={[
                "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",
                errors.badge
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
              ].join(" ")}
            />

            {errors.badge && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.badge}
              </p>
            )}
          </div>
        )}

        {/* =================================
            DESCRIPTION
        ================================= */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            وصف المنتج
          </label>

          <textarea
            rows={4}
            value={
              form.description
            }
            onChange={(event) =>
              updateField(
                "description",
                event.target.value,
              )
            }
            placeholder="أدخل وصف المنتج"
            className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* =================================
            DELIVERY TEXT
        ================================= */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            نص التوصيل
          </label>

          <input
            type="text"
            value={
              form.deliveryText
            }
            onChange={(event) =>
              updateField(
                "deliveryText",
                event.target.value,
              )
            }
            placeholder="مثال: يصل خلال 30 دقيقة"
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* =================================
            RATING / REVIEWS
        ================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Rating */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              التقييم
            </label>

            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(event) =>
                updateField(
                  "rating",
                  event.target.value,
                )
              }
              placeholder="مثال: 4.5"
              className={[
                "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",
                errors.rating
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
              ].join(" ")}
            />

            {errors.rating && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.rating}
              </p>
            )}
          </div>

          {/* Reviews Count */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              عدد التقييمات
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={
                form.reviewsCount
              }
              onChange={(event) =>
                updateField(
                  "reviewsCount",
                  event.target.value,
                )
              }
              placeholder="0"
              className={[
                "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",
                errors.reviewsCount
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
              ].join(" ")}
            />

            {errors.reviewsCount && (
              <p className="mt-1.5 text-xs text-red-600">
                {
                  errors.reviewsCount
                }
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

/*
  ========================================
  Toggle Card
  ========================================
*/

function ToggleCard({
  label,
  value,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div>
        <p className="text-sm font-semibold text-slate-700">
          {label}
        </p>

        <p
          className={[
            "mt-1 text-xs font-semibold",
            value
              ? "text-emerald-600"
              : "text-red-500",
          ].join(" ")}
        >
          {value ? "نعم" : "لا"}
        </p>
      </div>

      <StatusSwitch
        checked={value}
        onChange={onChange}
        activeLabel=""
        inactiveLabel=""
      />
    </div>
  );
}