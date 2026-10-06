import {
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  createAdminAccount,
} from "../../../services/adminAccounts.service";

import {
  appToast,
} from "../../../lib/toast";

const EGYPTIAN_PHONE_REGEX =
  /^01[0125][0-9]{8}$/;

const INITIAL_FORM = {
  fullName: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function getApiErrorMessage(
  error,
) {
  const apiError =
    error?.response
      ?.data
      ?.error;

  const code =
    apiError?.code;

  const details =
    apiError?.details;

  if (
    code ===
    "PHONE_ALREADY_REGISTERED"
  ) {
    return "رقم الموبايل مسجل بالفعل";
  }

  if (
    code ===
      "VALIDATION_ERROR" &&
    Array.isArray(details) &&
    details.length > 0
  ) {
    const firstError =
      details[0];

    const validationMessages = {
      "Enter a valid Egyptian phone number":
        "اكتب رقم موبايل مصري صحيح",

      "Full name must be at least 3 characters":
        "الاسم لازم يكون 3 حروف على الأقل",

      "Full name must not exceed 120 characters":
        "الاسم طويل جدًا",

      "Password must be at least 8 characters":
        "الباسورد لازم يكون 8 حروف على الأقل",

      "Password must not exceed 128 characters":
        "الباسورد طويل جدًا",

      "Passwords do not match":
        "الباسورد وتأكيد الباسورد غير متطابقين",
    };

    return (
      validationMessages[
        firstError.message
      ] ||
      "راجع البيانات المدخلة"
    );
  }

  if (
    code ===
    "AUTHENTICATION_REQUIRED"
  ) {
    return "جلسة الأدمن انتهت، سجل الدخول مرة أخرى";
  }

  if (
    code ===
    "ADMIN_ACCESS_REQUIRED"
  ) {
    return "ليس لديك صلاحية لإنشاء حساب أدمن";
  }

  return "تعذر إنشاء حساب الأدمن، حاول مرة أخرى";
}

export default function CreateAdminAccountPage() {
  const [
    form,
    setForm,
  ] = useState(
    INITIAL_FORM,
  );

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const createMutation =
    useMutation({
      mutationFn:
        createAdminAccount,

      onSuccess: (
        createdAdmin,
      ) => {
        appToast.success(
          `تم إنشاء حساب الأدمن ${createdAdmin.fullName} بنجاح`,
        );

        setForm(
          INITIAL_FORM,
        );

        setErrors({});
      },

      onError: (
        error,
      ) => {
        appToast.error(
          getApiErrorMessage(
            error,
          ),
        );
      },
    });

  function updateField(
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        [field]:
          value,
      }),
    );

    if (
      errors[field]
    ) {
      setErrors(
        (current) => ({
          ...current,

          [field]:
            "",
        }),
      );
    }
  }

  function validate() {
    const nextErrors = {};

    const fullName =
      form.fullName.trim();

    const phone =
      form.phone
        .trim()
        .replace(
          /[\s-]/g,
          "",
        );

    if (
      fullName.length < 3
    ) {
      nextErrors.fullName =
        "الاسم لازم يكون 3 حروف على الأقل";
    }

    if (
      !EGYPTIAN_PHONE_REGEX.test(
        phone,
      )
    ) {
      nextErrors.phone =
        "اكتب رقم موبايل مصري صحيح";
    }

    if (
      form.password.length <
      8
    ) {
      nextErrors.password =
        "الباسورد لازم يكون 8 حروف على الأقل";
    }

    if (
      form.confirmPassword !==
      form.password
    ) {
      nextErrors.confirmPassword =
        "الباسورد وتأكيد الباسورد غير متطابقين";
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

  function handleSubmit(
    event,
  ) {
    event.preventDefault();

    if (
      createMutation
        .isPending
    ) {
      return;
    }

    if (!validate()) {
      return;
    }

    createMutation.mutate({
      fullName:
        form.fullName.trim(),

      phone:
        form.phone
          .trim()
          .replace(
            /[\s-]/g,
            "",
          ),

      password:
        form.password,

      confirmPassword:
        form.confirmPassword,
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Header */}
      <section className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-emerald-50
              text-emerald-700
            "
          >
            <ShieldCheck
              size={24}
            />
          </div>

          <div>
            <h1
              className="
                text-2xl
                font-bold
                text-slate-900

                sm:text-3xl
              "
            >
              إضافة حساب أدمن
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              أنشئ حساب جديد بصلاحيات الإدارة الكاملة.
            </p>
          </div>
        </div>
      </section>

      {/* Warning */}
      <section
        className="
          mb-5
          rounded-2xl
          border
          border-amber-200
          bg-amber-50
          p-4
        "
      >
        <p className="text-sm font-semibold text-amber-800">
          الحساب اللي هيتعمل من هنا هيكون Admin مباشرة
        </p>

        <p className="mt-1 text-xs leading-6 text-amber-700">
          هيقدر يدخل لوحة التحكم ويتعامل مع المنتجات والطلبات
          والعروض والكوبونات وباقي صلاحيات الإدارة.
        </p>
      </section>

      {/* Form */}
      <section
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <form
          onSubmit={
            handleSubmit
          }
          noValidate
          className="
            space-y-5
            p-5

            sm:p-6

            lg:p-7
          "
        >
          {/* Full Name */}
          <div>
            <label
              htmlFor="admin-full-name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              الاسم الكامل
              <span className="mr-1 text-red-500">
                *
              </span>
            </label>

            <div className="relative">
              <UserRound
                size={19}
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="admin-full-name"
                type="text"
                value={
                  form.fullName
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "fullName",
                    event.target.value,
                  )
                }
                disabled={
                  createMutation
                    .isPending
                }
                placeholder="اكتب اسم الأدمن"
                autoComplete="name"
                className={[
                  "h-12 w-full rounded-xl border bg-white pl-4 pr-11 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100",

                  errors.fullName
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
                ].join(
                  " ",
                )}
              />
            </div>

            {errors.fullName && (
              <p className="mt-1.5 text-xs text-red-600">
                {
                  errors.fullName
                }
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="admin-phone"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              رقم الموبايل
              <span className="mr-1 text-red-500">
                *
              </span>
            </label>

            <div className="relative">
              <Smartphone
                size={19}
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="admin-phone"
                type="tel"
                inputMode="tel"
                dir="ltr"
                value={
                  form.phone
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "phone",
                    event.target.value,
                  )
                }
                disabled={
                  createMutation
                    .isPending
                }
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
                className={[
                  "h-12 w-full rounded-xl border bg-white pl-4 pr-11 text-right text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100",

                  errors.phone
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
                ].join(
                  " ",
                )}
              />
            </div>

            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-600">
                {
                  errors.phone
                }
              </p>
            )}
          </div>

          {/* Passwords */}
          <div
            className="
              grid
              grid-cols-1
              gap-5

              sm:grid-cols-2
            "
          >
            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                الباسورد
                <span className="mr-1 text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <input
                  id="admin-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    form.password
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "password",
                      event.target.value,
                    )
                  }
                  disabled={
                    createMutation
                      .isPending
                  }
                  placeholder="8 حروف على الأقل"
                  autoComplete="new-password"
                  className={[
                    "h-12 w-full rounded-xl border bg-white px-4 pl-11 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100",

                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
                  ].join(
                    " ",
                  )}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current,
                    )
                  }
                  disabled={
                    createMutation
                      .isPending
                  }
                  aria-label={
                    showPassword
                      ? "إخفاء الباسورد"
                      : "إظهار الباسورد"
                  }
                  className="
                    absolute
                    left-3
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                  "
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">
                  {
                    errors.password
                  }
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="admin-confirm-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                تأكيد الباسورد
                <span className="mr-1 text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <input
                  id="admin-confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    form.confirmPassword
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "confirmPassword",
                      event.target.value,
                    )
                  }
                  disabled={
                    createMutation
                      .isPending
                  }
                  placeholder="اكتب الباسورد مرة تانية"
                  autoComplete="new-password"
                  className={[
                    "h-12 w-full rounded-xl border bg-white px-4 pl-11 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100",

                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
                  ].join(
                    " ",
                  )}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) =>
                        !current,
                    )
                  }
                  disabled={
                    createMutation
                      .isPending
                  }
                  aria-label={
                    showConfirmPassword
                      ? "إخفاء تأكيد الباسورد"
                      : "إظهار تأكيد الباسورد"
                  }
                  className="
                    absolute
                    left-3
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                  "
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600">
                  {
                    errors.confirmPassword
                  }
                </p>
              )}
            </div>
          </div>

          {/* Role */}
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              rounded-xl
              border
              border-emerald-200
              bg-emerald-50/60
              p-4
            "
          >
            <div>
              <p className="text-sm font-semibold text-slate-700">
                الصلاحية
              </p>

              <p className="mt-1 text-xs text-slate-500">
                يتم تحديدها من السيرفر ولا يمكن تغييرها من هنا.
              </p>
            </div>

            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-emerald-600
                px-3
                py-1.5
                text-xs
                font-bold
                text-white
              "
            >
              <ShieldCheck
                size={15}
              />

              ADMIN
            </span>
          </div>

          {/* Submit */}
          <div className="border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={
                createMutation
                  .isPending
              }
              aria-busy={
                createMutation
                  .isPending
              }
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-emerald-700
                px-6
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-emerald-800
                active:scale-[0.99]
                disabled:cursor-wait
                disabled:opacity-60

                sm:w-auto
                sm:min-w-[190px]
              "
            >
              <ShieldCheck
                size={19}
              />

              {createMutation
                .isPending
                ? "جاري إنشاء الحساب..."
                : "إنشاء حساب الأدمن"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}