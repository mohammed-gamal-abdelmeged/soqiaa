import { useMemo, useState } from "react";

export default function BestSellerForm({
  categories,
  categoryDetails,
  products,
  onSubmit,
}) {
  const [form, setForm] = useState({
    categorySlug: "",
    subcategoryId: "",
    productId: "",
  });

  const [errors, setErrors] = useState({});

  const subcategories = useMemo(() => {
    if (!form.categorySlug) return [];

    return (
      categoryDetails[form.categorySlug]?.subcategories ?? []
    );
  }, [form.categorySlug, categoryDetails]);

  const availableProducts = useMemo(() => {
    if (!form.categorySlug || !form.subcategoryId) {
      return [];
    }

    return products.filter((product) => {
      const matchesCategory =
        product.categorySlug === form.categorySlug;

      const matchesSubcategory =
        String(product.subcategoryId) ===
        String(form.subcategoryId);

      const isNotBestSeller =
        product.isBestSeller !== true;

      return (
        matchesCategory &&
        matchesSubcategory &&
        isNotBestSeller
      );
    });
  }, [
    products,
    form.categorySlug,
    form.subcategoryId,
  ]);

  function handleCategoryChange(event) {
    const value = event.target.value;

    setForm({
      categorySlug: value,
      subcategoryId: "",
      productId: "",
    });

    setErrors({});
  }

  function handleSubcategoryChange(event) {
    const value = event.target.value;

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

  function handleProductChange(event) {
    const value = event.target.value;

    setForm((current) => ({
      ...current,
      productId: value,
    }));

    setErrors((current) => ({
      ...current,
      productId: "",
    }));
  }

  function validateForm() {
    const newErrors = {};

    if (!form.categorySlug) {
      newErrors.categorySlug = "اختر القسم الأساسي";
    }

    if (!form.subcategoryId) {
      newErrors.subcategoryId = "اختر القسم الفرعي";
    }

    if (!form.productId) {
      newErrors.productId = "اختر المنتج";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      productId: Number(form.productId),
    });
  }

  return (
    <form
      id="best-seller-form"
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          القسم الأساسي
          <span className="mr-1 text-red-500">
            *
          </span>
        </label>

        <select
          value={form.categorySlug}
          onChange={handleCategoryChange}
          className={[
            "w-full rounded-xl border bg-white px-4 py-3",
            "text-sm text-slate-700 outline-none transition",
            "focus:border-emerald-500 focus:ring-2",
            "focus:ring-emerald-100",
            errors.categorySlug
              ? "border-red-400"
              : "border-slate-200",
          ].join(" ")}
        >
          <option value="">
            اختر القسم الأساسي
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.slug}
            >
              {category.name}
            </option>
          ))}
        </select>

        {errors.categorySlug && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {errors.categorySlug}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          القسم الفرعي
          <span className="mr-1 text-red-500">
            *
          </span>
        </label>

        <select
          value={form.subcategoryId}
          onChange={handleSubcategoryChange}
          disabled={!form.categorySlug}
          className={[
            "w-full rounded-xl border bg-white px-4 py-3",
            "text-sm text-slate-700 outline-none transition",
            "focus:border-emerald-500 focus:ring-2",
            "focus:ring-emerald-100",
            "disabled:cursor-not-allowed disabled:bg-slate-50",
            "disabled:text-slate-400",
            errors.subcategoryId
              ? "border-red-400"
              : "border-slate-200",
          ].join(" ")}
        >
          <option value="">
            اختر القسم الفرعي
          </option>

          {subcategories.map((subcategory) => (
            <option
              key={subcategory.id}
              value={subcategory.id}
            >
              {subcategory.name}
            </option>
          ))}
        </select>

        {errors.subcategoryId && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {errors.subcategoryId}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          المنتج
          <span className="mr-1 text-red-500">
            *
          </span>
        </label>

        <select
          value={form.productId}
          onChange={handleProductChange}
          disabled={!form.subcategoryId}
          className={[
            "w-full rounded-xl border bg-white px-4 py-3",
            "text-sm text-slate-700 outline-none transition",
            "focus:border-emerald-500 focus:ring-2",
            "focus:ring-emerald-100",
            "disabled:cursor-not-allowed disabled:bg-slate-50",
            "disabled:text-slate-400",
            errors.productId
              ? "border-red-400"
              : "border-slate-200",
          ].join(" ")}
        >
          <option value="">
            اختر المنتج
          </option>

          {availableProducts.map((product) => (
            <option
              key={product.id}
              value={product.id}
            >
              {product.name}
            </option>
          ))}
        </select>

        {form.subcategoryId &&
          availableProducts.length === 0 && (
            <p className="mt-2 text-xs text-slate-500">
              لا توجد منتجات متاحة للإضافة في
              هذا القسم الفرعي.
            </p>
          )}

        {errors.productId && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {errors.productId}
          </p>
        )}
      </div>
    </form>
  );
}