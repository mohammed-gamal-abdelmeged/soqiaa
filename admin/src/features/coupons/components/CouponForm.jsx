import {
  useEffect,
  useState,
} from "react";

import StatusSwitch from "../../../components/ui/StatusSwitch";

const EMPTY_FORM = {
  code: "",
  discountType:
    "PERCENTAGE",
  value: "",

  minOrderAmount: "",
  maxDiscountAmount: "",

  usageLimit: "",
  usagePerUser: "",

  startsAt: "",
  expiresAt: "",

  isActive: true,
};

function toDateTimeLocal(
  value,
) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  const offset =
    date.getTimezoneOffset();

  const localDate =
    new Date(
      date.getTime() -
        offset *
          60 *
          1000,
    );

  return localDate
    .toISOString()
    .slice(
      0,
      16,
    );
}

export default function CouponForm({
  mode = "add",
  initialData = null,
  onSubmit,
}) {
  const [
    form,
    setForm,
  ] = useState(
    EMPTY_FORM,
  );

  const [
    errors,
    setErrors,
  ] = useState({});

  useEffect(() => {
    if (
      mode === "edit" &&
      initialData
    ) {
      setForm({
        code:
          initialData.code ??
          "",

        discountType:
          initialData.discountType ??
          "PERCENTAGE",

        value:
          initialData.value !=
          null
            ? String(
                initialData.value,
              )
            : "",

        minOrderAmount:
          initialData.minOrderAmount !=
          null
            ? String(
                initialData.minOrderAmount,
              )
            : "",

        maxDiscountAmount:
          initialData.maxDiscountAmount !=
          null
            ? String(
                initialData.maxDiscountAmount,
              )
            : "",

        usageLimit:
          initialData.usageLimit !=
          null
            ? String(
                initialData.usageLimit,
              )
            : "",

        usagePerUser:
          initialData.usagePerUser !=
          null
            ? String(
                initialData.usagePerUser,
              )
            : "",

        startsAt:
          toDateTimeLocal(
            initialData.startsAt,
          ),

        expiresAt:
          toDateTimeLocal(
            initialData.expiresAt,
          ),

        isActive:
          initialData.isActive ??
          true,
      });

      setErrors({});

      return;
    }

    setForm(
      EMPTY_FORM,
    );

    setErrors({});
  }, [
    mode,
    initialData,
  ]);

  function updateField(
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );

    if (
      errors[field]
    ) {
      setErrors(
        (current) => ({
          ...current,
          [field]: "",
        }),
      );
    }
  }

  function validate() {
    const nextErrors = {};

    const code =
      form.code
        .trim()
        .toUpperCase();

    if (!code) {
      nextErrors.code =
        "كود الخصم مطلوب";
    } else if (
      code.length < 2
    ) {
      nextErrors.code =
        "كود الخصم يجب أن يكون حرفين على الأقل";
    } else if (
      code.length > 50
    ) {
      nextErrors.code =
        "كود الخصم لا يمكن أن يتجاوز 50 حرف";
    }

    const value =
      Number(
        form.value,
      );

    if (
      form.value === "" ||
      !Number.isFinite(
        value,
      ) ||
      value <= 0
    ) {
      nextErrors.value =
        "أدخل قيمة خصم صحيحة";
    }

    if (
      form.discountType ===
        "PERCENTAGE" &&
      value > 100
    ) {
      nextErrors.value =
        "نسبة الخصم لا يمكن أن تتجاوز 100%";
    }

    if (
      form.minOrderAmount !==
      ""
    ) {
      const minimum =
        Number(
          form.minOrderAmount,
        );

      if (
        !Number.isFinite(
          minimum,
        ) ||
        minimum < 0
      ) {
        nextErrors.minOrderAmount =
          "أدخل حد أدنى صحيح";
      }
    }

    if (
      form.maxDiscountAmount !==
      ""
    ) {
      const maximum =
        Number(
          form.maxDiscountAmount,
        );

      if (
        !Number.isFinite(
          maximum,
        ) ||
        maximum <= 0
      ) {
        nextErrors.maxDiscountAmount =
          "أدخل أقصى خصم صحيح";
      }
    }

    if (
      form.usageLimit !==
      ""
    ) {
      const limit =
        Number(
          form.usageLimit,
        );

      if (
        !Number.isInteger(
          limit,
        ) ||
        limit <= 0
      ) {
        nextErrors.usageLimit =
          "عدد مرات الاستخدام يجب أن يكون رقم صحيح أكبر من صفر";
      }
    }

    if (
      form.usagePerUser !==
      ""
    ) {
      const limit =
        Number(
          form.usagePerUser,
        );

      if (
        !Number.isInteger(
          limit,
        ) ||
        limit <= 0
      ) {
        nextErrors.usagePerUser =
          "عدد مرات الاستخدام للعميل يجب أن يكون رقم صحيح أكبر من صفر";
      }
    }

    if (
      form.startsAt &&
      form.expiresAt
    ) {
      const startsAt =
        new Date(
          form.startsAt,
        );

      const expiresAt =
        new Date(
          form.expiresAt,
        );

      if (
        expiresAt <=
        startsAt
      ) {
        nextErrors.expiresAt =
          "تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية";
      }
    }

    setErrors(
      nextErrors,
    );

    return (
      Object.keys(
        nextErrors,
      ).length === 0
    );
  }

  function optionalNumber(
    value,
  ) {
    if (
      value === ""
    ) {
      return null;
    }

    return Number(
      value,
    );
  }

  function optionalDate(
    value,
  ) {
    if (!value) {
      return null;
    }

    return new Date(
      value,
    ).toISOString();
  }

  function handleSubmit(
    event,
  ) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      code:
        form.code
          .trim()
          .toUpperCase(),

      discountType:
        form.discountType,

      value:
        Number(
          form.value,
        ),

      minOrderAmount:
        optionalNumber(
          form.minOrderAmount,
        ),

      maxDiscountAmount:
        optionalNumber(
          form.maxDiscountAmount,
        ),

      usageLimit:
        optionalNumber(
          form.usageLimit,
        ),

      usagePerUser:
        optionalNumber(
          form.usagePerUser,
        ),

      startsAt:
        optionalDate(
          form.startsAt,
        ),

      expiresAt:
        optionalDate(
          form.expiresAt,
        ),

      isActive:
        Boolean(
          form.isActive,
        ),
    });
  }

  return (
    <form
      id="coupon-form"
      onSubmit={
        handleSubmit
      }
      className="space-y-5 p-4 sm:p-5 lg:p-6"
    >
      {/* Code */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          كود الخصم{" "}
          <span className="text-red-500">
            *
          </span>
        </label>

        <input
          type="text"
          value={
            form.code
          }
          onChange={(
            event,
          ) =>
            updateField(
              "code",
              event.target.value.toUpperCase(),
            )
          }
          placeholder="مثال: SOUQIA20"
          className={[
            "h-11 w-full rounded-xl border px-4 text-sm uppercase outline-none transition",
            errors.code
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
          ].join(" ")}
        />

        {errors.code && (
          <p className="mt-1.5 text-xs text-red-600">
            {
              errors.code
            }
          </p>
        )}
      </div>

      {/* Type + Value */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            نوع الخصم{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <select
            value={
              form.discountType
            }
            onChange={(
              event,
            ) =>
              updateField(
                "discountType",
                event.target.value,
              )
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="PERCENTAGE">
              نسبة مئوية
            </option>

            <option value="FIXED">
              مبلغ ثابت
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            قيمة الخصم{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <div className="relative">
            <input
              type="number"
              min="0.01"
              step="0.01"
              max={
                form.discountType ===
                "PERCENTAGE"
                  ? "100"
                  : undefined
              }
              value={
                form.value
              }
              onChange={(
                event,
              ) =>
                updateField(
                  "value",
                  event.target.value,
                )
              }
              placeholder={
                form.discountType ===
                "PERCENTAGE"
                  ? "20"
                  : "50"
              }
              className={[
                "h-11 w-full rounded-xl border px-4 pl-14 text-sm outline-none transition",
                errors.value
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
              ].join(" ")}
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              {form.discountType ===
              "PERCENTAGE"
                ? "%"
                : "ج.م"}
            </span>
          </div>

          {errors.value && (
            <p className="mt-1.5 text-xs text-red-600">
              {
                errors.value
              }
            </p>
          )}
        </div>
      </div>

      {/* Minimum + Maximum */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            الحد الأدنى للطلب
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={
              form.minOrderAmount
            }
            onChange={(
              event,
            ) =>
              updateField(
                "minOrderAmount",
                event.target.value,
              )
            }
            placeholder="بدون حد أدنى"
            className={[
              "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",
              errors.minOrderAmount
                ? "border-red-300"
                : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
            ].join(" ")}
          />

          {errors.minOrderAmount && (
            <p className="mt-1.5 text-xs text-red-600">
              {
                errors.minOrderAmount
              }
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            أقصى قيمة للخصم
          </label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={
              form.maxDiscountAmount
            }
            onChange={(
              event,
            ) =>
              updateField(
                "maxDiscountAmount",
                event.target.value,
              )
            }
            placeholder="بدون حد أقصى"
            className={[
              "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",
              errors.maxDiscountAmount
                ? "border-red-300"
                : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
            ].join(" ")}
          />

          {errors.maxDiscountAmount && (
            <p className="mt-1.5 text-xs text-red-600">
              {
                errors.maxDiscountAmount
              }
            </p>
          )}
        </div>
      </div>

      {/* Usage */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            إجمالي مرات الاستخدام
          </label>

          <input
            type="number"
            min="1"
            step="1"
            value={
              form.usageLimit
            }
            onChange={(
              event,
            ) =>
              updateField(
                "usageLimit",
                event.target.value,
              )
            }
            placeholder="غير محدود"
            className={[
              "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",
              errors.usageLimit
                ? "border-red-300"
                : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
            ].join(" ")}
          />

          {errors.usageLimit && (
            <p className="mt-1.5 text-xs text-red-600">
              {
                errors.usageLimit
              }
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            الاستخدام لكل عميل
          </label>

          <input
            type="number"
            min="1"
            step="1"
            value={
              form.usagePerUser
            }
            onChange={(
              event,
            ) =>
              updateField(
                "usagePerUser",
                event.target.value,
              )
            }
            placeholder="غير محدود"
            className={[
              "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",
              errors.usagePerUser
                ? "border-red-300"
                : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
            ].join(" ")}
          />

          {errors.usagePerUser && (
            <p className="mt-1.5 text-xs text-red-600">
              {
                errors.usagePerUser
              }
            </p>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            يبدأ من
          </label>

          <input
            type="datetime-local"
            value={
              form.startsAt
            }
            onChange={(
              event,
            ) =>
              updateField(
                "startsAt",
                event.target.value,
              )
            }
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            ينتهي في
          </label>

          <input
            type="datetime-local"
            value={
              form.expiresAt
            }
            onChange={(
              event,
            ) =>
              updateField(
                "expiresAt",
                event.target.value,
              )
            }
            className={[
              "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",
              errors.expiresAt
                ? "border-red-300"
                : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
            ].join(" ")}
          />

          {errors.expiresAt && (
            <p className="mt-1.5 text-xs text-red-600">
              {
                errors.expiresAt
              }
            </p>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              حالة الكوبون
            </p>

            <p className="mt-1 text-xs text-slate-400">
              يمكنك تشغيل الكوبون أو إيقافه في أي وقت
            </p>
          </div>

          <StatusSwitch
            checked={
              form.isActive
            }
            onChange={(
              value,
            ) =>
              updateField(
                "isActive",
                value,
              )
            }
            activeLabel="نشط"
            inactiveLabel="متوقف"
          />
        </div>
      </div>
    </form>
  );
}