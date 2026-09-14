// src/features/offers/components/OfferForm.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import StatusSwitch from "../../../components/ui/StatusSwitch";

export default function OfferForm({
  mode = "add",
  initialData = null,

  categories,
  categoryDetails,
  products,

  usedProductIds = [],

  onSubmit,
}) {
  const [form, setForm] = useState({
    categorySlug: "",
    subcategoryId: "",
    productId: "",
    discountPercentage: "",
    isActive: true,
  });

  const [errors, setErrors] =
    useState({});

  /*
    =====================================
    Fill edit form
    =====================================
  */

  useEffect(() => {
    if (
      mode === "edit" &&
      initialData
    ) {
      const product = products.find(
        (item) =>
          item.id === initialData.productId,
      );

      setForm({
        categorySlug:
          product?.categorySlug ?? "",

        subcategoryId:
          product?.subcategoryId != null
            ? String(
                product.subcategoryId,
              )
            : "",

        productId:
          initialData.productId != null
            ? String(
                initialData.productId,
              )
            : "",

        discountPercentage:
          initialData.discountPercentage !=
          null
            ? String(
                initialData.discountPercentage,
              )
            : "",

        isActive:
          initialData.isActive ?? true,
      });

      setErrors({});

      return;
    }

    setForm({
      categorySlug: "",
      subcategoryId: "",
      productId: "",
      discountPercentage: "",
      isActive: true,
    });

    setErrors({});
  }, [
    mode,
    initialData,
    products,
  ]);

  /*
    =====================================
    Subcategories
    =====================================
  */

  const subcategories =
    form.categorySlug
      ? categoryDetails[
          form.categorySlug
        ]?.subcategories ?? []
      : [];

  /*
    =====================================
    Products based on selections
    =====================================
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
          const belongsToCategory =
            product.categorySlug ===
            form.categorySlug;

          const belongsToSubcategory =
            String(
              product.subcategoryId,
            ) ===
            String(
              form.subcategoryId,
            );

          /*
            المنتج اللي عليه عرض بالفعل
            مينفعش نعمل له Offer تاني.

            لكن في Edit لازم المنتج الحالي
            يفضل ظاهر.
          */
          const alreadyUsed =
            usedProductIds.includes(
              product.id,
            );

          const isCurrentProduct =
            mode === "edit" &&
            initialData?.productId ===
              product.id;

          return (
            belongsToCategory &&
            belongsToSubcategory &&
            (!alreadyUsed ||
              isCurrentProduct)
          );
        },
      );
    }, [
      products,
      form.categorySlug,
      form.subcategoryId,
      usedProductIds,
      mode,
      initialData,
    ]);

  const updateField = (
    field,
    value,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: "",
      }));
    }
  };

  /*
    =====================================
    Category Change
    =====================================
  */

  const handleCategoryChange = (
    value,
  ) => {
    setForm((current) => ({
      ...current,

      categorySlug: value,

      /*
        لازم نصفر اللي تحت القسم
      */
      subcategoryId: "",
      productId: "",
    }));

    setErrors((current) => ({
      ...current,
      categorySlug: "",
      subcategoryId: "",
      productId: "",
    }));
  };

  /*
    =====================================
    Subcategory Change
    =====================================
  */

  const handleSubcategoryChange = (
    value,
  ) => {
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
  };

  /*
    =====================================
    Validation
    =====================================
  */

  const validate = () => {
    const nextErrors = {};

    if (!form.categorySlug) {
      nextErrors.categorySlug =
        "اختر القسم الأساسي";
    }

    if (!form.subcategoryId) {
      nextErrors.subcategoryId =
        "اختر القسم الفرعي";
    }

    if (!form.productId) {
      nextErrors.productId =
        "اختر المنتج";
    }

    const discount = Number(
      form.discountPercentage,
    );

    if (
      !form.discountPercentage ||
      !Number.isFinite(discount) ||
      discount <= 0 ||
      discount > 100
    ) {
      nextErrors.discountPercentage =
        "أدخل نسبة خصم من 1 إلى 100";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors)
        .length === 0
    );
  };

  /*
    =====================================
    Submit
    =====================================
  */

  const handleSubmit = (
    event,
  ) => {
    event.preventDefault();

    if (!validate()) return;

    onSubmit({
      productId: Number(
        form.productId,
      ),

      discountPercentage: Number(
        form.discountPercentage,
      ),

      isActive: form.isActive,
    });
  };

  return (
    <form
      id="offer-form"
      onSubmit={handleSubmit}
      className="space-y-5 p-4 sm:p-5 lg:p-6"
    >
      {/* Category */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          القسم الأساسي{" "}
          <span className="text-red-500">
            *
          </span>
        </label>

        <select
          value={form.categorySlug}
          onChange={(event) =>
            handleCategoryChange(
              event.target.value,
            )
          }
          className={[
            "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none transition",
            errors.categorySlug
              ? "border-red-300"
              : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
          ].join(" ")}
        >
          <option value="">
            اختر القسم
          </option>

          {categories.map(
            (category) => (
              <option
                key={category.id}
                value={category.slug}
              >
                {category.name}
              </option>
            ),
          )}
        </select>

        {errors.categorySlug && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.categorySlug}
          </p>
        )}
      </div>

      {/* Subcategory */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          القسم الفرعي{" "}
          <span className="text-red-500">
            *
          </span>
        </label>

        <select
          value={form.subcategoryId}
          disabled={!form.categorySlug}
          onChange={(event) =>
            handleSubcategoryChange(
              event.target.value,
            )
          }
          className={[
            "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
            errors.subcategoryId
              ? "border-red-300"
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
                key={subcategory.id}
                value={subcategory.id}
              >
                {subcategory.name}
              </option>
            ),
          )}
        </select>

        {errors.subcategoryId && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.subcategoryId}
          </p>
        )}
      </div>

      {/* Product */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          المنتج{" "}
          <span className="text-red-500">
            *
          </span>
        </label>

        <select
          value={form.productId}
          disabled={
            !form.categorySlug ||
            !form.subcategoryId
          }
          onChange={(event) =>
            updateField(
              "productId",
              event.target.value,
            )
          }
          className={[
            "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
            errors.productId
              ? "border-red-300"
              : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
          ].join(" ")}
        >
          <option value="">
            {!form.categorySlug
              ? "اختر القسم الأساسي أولاً"
              : !form.subcategoryId
                ? "اختر القسم الفرعي أولاً"
                : "اختر المنتج"}
          </option>

          {availableProducts.map(
            (product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.name}
              </option>
            ),
          )}
        </select>

        {errors.productId && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.productId}
          </p>
        )}

        {form.categorySlug &&
          form.subcategoryId &&
          availableProducts.length ===
            0 && (
            <p className="mt-1.5 text-xs text-amber-600">
              لا توجد منتجات متاحة
              لإضافة عرض جديد في هذا
              القسم الفرعي.
            </p>
          )}
      </div>

      {/* Discount */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          نسبة الخصم{" "}
          <span className="text-red-500">
            *
          </span>
        </label>

        <div className="relative">
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
            placeholder="مثال: 10"
            className={[
              "h-11 w-full rounded-xl border px-4 pl-10 text-sm outline-none transition",
              errors.discountPercentage
                ? "border-red-300"
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

      {/* Status */}

      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              حالة العرض
            </p>

            <p className="mt-1 text-xs text-slate-400">
              حدد إذا كان الخصم نشطًا
              حاليًا أم لا
            </p>
          </div>

          <StatusSwitch
            checked={form.isActive}
            onChange={(value) =>
              updateField(
                "isActive",
                value,
              )
            }
          />
        </div>
      </div>
    </form>
  );
}