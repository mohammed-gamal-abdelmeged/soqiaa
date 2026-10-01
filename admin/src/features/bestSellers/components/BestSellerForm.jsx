import {
  useMemo,
  useState,
} from "react";

export default function BestSellerForm({
  categories = [],
  categoryDetails = {},
  products = [],
  onSubmit,
}) {
  const [form, setForm] = useState({
    categorySlug: "",
    subcategoryId: "",
    productId: "",
  });

  const [errors, setErrors] =
    useState({});

  /*
  |--------------------------------------------------------------------------
  | Subcategories
  |--------------------------------------------------------------------------
  */

  const subcategories = useMemo(() => {
    if (!form.categorySlug) {
      return [];
    }

    return (
      categoryDetails[
        form.categorySlug
      ]?.subcategories ?? []
    );
  }, [
    form.categorySlug,
    categoryDetails,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Available Products
  |--------------------------------------------------------------------------
  */

  const availableProducts =
    useMemo(() => {
      if (
        !form.categorySlug ||
        !form.subcategoryId
      ) {
        return [];
      }

      return products.filter(
        (product) => {
          const matchesCategory =
            product.categorySlug ===
            form.categorySlug;

          const matchesSubcategory =
            String(
              product.subcategoryId,
            ) ===
            String(
              form.subcategoryId,
            );

          const isNotBestSeller =
            product.isBestSeller !==
            true;

          return (
            matchesCategory &&
            matchesSubcategory &&
            isNotBestSeller
          );
        },
      );
    }, [
      products,
      form.categorySlug,
      form.subcategoryId,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Category Change
  |--------------------------------------------------------------------------
  */

  function handleCategoryChange(
    event,
  ) {
    const value =
      event.target.value;

    setForm({
      categorySlug: value,
      subcategoryId: "",
      productId: "",
    });

    setErrors({});
  }

  /*
  |--------------------------------------------------------------------------
  | Subcategory Change
  |--------------------------------------------------------------------------
  */

  function handleSubcategoryChange(
    event,
  ) {
    const value =
      event.target.value;

    setForm((current) => ({
      ...current,
      subcategoryId: value,
      productId: "",
    }));

    setErrors((current) => ({
      ...current,
      subcategoryId: "",
      productId: "",
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | Product Change
  |--------------------------------------------------------------------------
  */

  function handleProductChange(
    event,
  ) {
    const value =
      event.target.value;

    setForm((current) => ({
      ...current,
      productId: value,
    }));

    setErrors((current) => ({
      ...current,
      productId: "",
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  function validateForm() {
    const newErrors = {};

    if (!form.categorySlug) {
      newErrors.categorySlug =
        "اختر القسم الأساسي";
    }

    if (!form.subcategoryId) {
      newErrors.subcategoryId =
        "اختر القسم الفرعي";
    }

    if (!form.productId) {
      newErrors.productId =
        "اختر المنتج";
    }

    setErrors(
      newErrors,
    );

    return (
      Object.keys(
        newErrors,
      ).length === 0
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  function handleSubmit(
    event,
  ) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    /*
     * Product IDs are UUIDs.
     * Do NOT convert them to Number.
     */

    onSubmit({
      productId:
        String(
          form.productId,
        ),
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Shared Select Classes
  |--------------------------------------------------------------------------
  */

  const selectBaseClasses = [
    "h-11 w-full rounded-xl border",
    "bg-white px-4",
    "text-sm text-slate-700",
    "outline-none transition",
    "focus:border-emerald-500",
    "focus:ring-2",
    "focus:ring-emerald-100",
    "disabled:cursor-not-allowed",
    "disabled:bg-slate-50",
    "disabled:text-slate-400",
  ].join(" ");

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <form
      id="best-seller-form"
      onSubmit={handleSubmit}
      className="space-y-5 p-5 sm:p-6"
    >
      {/* Form Header */}

      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
        <p className="text-sm font-semibold text-slate-800">
          اختر المنتج المطلوب
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          سيتم إضافته مباشرة إلى قائمة
          المنتجات الأكثر مبيعاً.
        </p>
      </div>

      {/* Category */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          القسم الأساسي

          <span className="mr-1 text-red-500">
            *
          </span>
        </label>

        <select
          value={
            form.categorySlug
          }
          onChange={
            handleCategoryChange
          }
          className={[
            selectBaseClasses,
            errors.categorySlug
              ? "border-red-400"
              : "border-slate-200",
          ].join(" ")}
        >
          <option value="">
            اختر القسم الأساسي
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
                {
                  category.name
                }
              </option>
            ),
          )}
        </select>

        {errors.categorySlug ? (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {
              errors.categorySlug
            }
          </p>
        ) : null}
      </div>

      {/* Subcategory */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          القسم الفرعي

          <span className="mr-1 text-red-500">
            *
          </span>
        </label>

        <select
          value={
            form.subcategoryId
          }
          onChange={
            handleSubcategoryChange
          }
          disabled={
            !form.categorySlug
          }
          className={[
            selectBaseClasses,
            errors.subcategoryId
              ? "border-red-400"
              : "border-slate-200",
          ].join(" ")}
        >
          <option value="">
            {!form.categorySlug
              ? "اختر القسم الأساسي أولاً"
              : "اختر القسم الفرعي"}
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

        {errors.subcategoryId ? (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {
              errors.subcategoryId
            }
          </p>
        ) : null}
      </div>

      {/* Product */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          المنتج

          <span className="mr-1 text-red-500">
            *
          </span>
        </label>

        <select
          value={
            form.productId
          }
          onChange={
            handleProductChange
          }
          disabled={
            !form.subcategoryId
          }
          className={[
            selectBaseClasses,
            errors.productId
              ? "border-red-400"
              : "border-slate-200",
          ].join(" ")}
        >
          <option value="">
            {!form.subcategoryId
              ? "اختر القسم الفرعي أولاً"
              : "اختر المنتج"}
          </option>

          {availableProducts.map(
            (product) => (
              <option
                key={
                  product.id
                }
                value={
                  product.id
                }
              >
                {
                  product.name
                }
              </option>
            ),
          )}
        </select>

        {errors.productId ? (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {
              errors.productId
            }
          </p>
        ) : null}

        {form.subcategoryId &&
        availableProducts.length ===
          0 ? (
          <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5">
            <p className="text-xs leading-5 text-amber-700">
              لا توجد منتجات متاحة
              للإضافة في هذا القسم
              الفرعي.
            </p>
          </div>
        ) : null}
      </div>

      {/* Selected Product Preview */}

      {form.productId ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          {(() => {
            const selectedProduct =
              products.find(
                (product) =>
                  String(
                    product.id,
                  ) ===
                  String(
                    form.productId,
                  ),
              );

            if (
              !selectedProduct
            ) {
              return null;
            }

            return (
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedProduct.image
                  }
                  alt={
                    selectedProduct.name
                  }
                  className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 bg-white object-cover"
                />

                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    المنتج المختار
                  </p>

                  <p className="mt-0.5 truncate text-sm font-bold text-slate-800">
                    {
                      selectedProduct.name
                    }
                  </p>

                  {selectedProduct.price !=
                  null ? (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {Number(
                        selectedProduct.price,
                      ).toLocaleString(
                        "ar-EG",
                      )}{" "}
                      ج.م
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })()}
        </div>
      ) : null}
    </form>
  );
}