import { useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  RotateCcwKey,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  User,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import TextField from "../../../components/ui/TextField";
import PasswordField from "../../../components/ui/PasswordField";
import Modal from "../../../components/ui/Modal";

import {
  validateRegister,
} from "../validation/registerValidation";

import {
  register,
} from "../../../services/auth.service";

import {
  showError,
  showSuccess,
} from "../../../lib/toast";

const initialFormData = {
  fullName: "",
  phone: "",
  address: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
};

function RegisterForm() {
  const navigate =
    useNavigate();

  const [
    formData,
    setFormData,
  ] = useState(
    initialFormData,
  );

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    touched,
    setTouched,
  ] = useState({});

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    isTermsOpen,
    setIsTermsOpen,
  ] = useState(false);

  const [
    registrationComplete,
    setRegistrationComplete,
  ] = useState(false);

  const [
    createdPassword,
    setCreatedPassword,
  ] = useState("");

  const [
    isCreatedPasswordVisible,
    setIsCreatedPasswordVisible,
  ] = useState(true);

  const [
    isPasswordCopied,
    setIsPasswordCopied,
  ] = useState(false);

  const handleCopyPassword =
    async () => {
      try {
        await navigator.clipboard.writeText(
          createdPassword,
        );

        setIsPasswordCopied(
          true,
        );

        showSuccess(
          "تم نسخ الباسورد",
        );
      } catch {
        showError(
          "تعذر نسخ الباسورد، انسخه يدويًا",
        );
      }
    };

  const handleContinueToLogin =
    () => {
      setCreatedPassword(
        "",
      );

      setRegistrationComplete(
        false,
      );

      navigate(
        "/login",
        {
          replace: true,
        },
      );
    };

  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    const updatedFormData = {
      ...formData,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    };

    setFormData(
      updatedFormData,
    );

    if (touched[name]) {
      const validationErrors =
        validateRegister(
          updatedFormData,
        );

      setErrors(
        (current) => ({
          ...current,

          [name]:
            validationErrors[
              name
            ],
        }),
      );
    }
  };

  const handleBlur = (
    event,
  ) => {
    const {
      name,
    } = event.target;

    setTouched(
      (current) => ({
        ...current,

        [name]:
          true,
      }),
    );

    const validationErrors =
      validateRegister(
        formData,
      );

    setErrors(
      (current) => ({
        ...current,

        [name]:
          validationErrors[
            name
          ],
      }),
    );
  };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      const validationErrors =
        validateRegister(
          formData,
        );

      if (
        Object.keys(
          validationErrors,
        ).length > 0
      ) {
        setErrors(
          validationErrors,
        );

        setTouched({
          fullName: true,
          phone: true,
          address: true,
          password: true,
          confirmPassword: true,
          termsAccepted: true,
        });

        return;
      }

      setIsSubmitting(
        true,
      );

      try {
        await register({
          fullName:
            formData.fullName
              .trim(),

          phone:
            formData.phone
              .trim(),

          address:
            formData.address
              .trim(),

          password:
            formData.password,

          confirmPassword:
            formData.confirmPassword,

          termsAccepted:
            formData.termsAccepted,
        });

        const passwordForReminder =
          formData.password;

        setCreatedPassword(
          passwordForReminder,
        );

        setIsCreatedPasswordVisible(
          true,
        );

        setIsPasswordCopied(
          false,
        );

        setRegistrationComplete(
          true,
        );

        setFormData(
          initialFormData,
        );

        setErrors({});

        setTouched({});

        showSuccess(
          "تم إنشاء الحساب بنجاح",
        );
      } catch (error) {
        showError(
          error?.message ||
            "تعذر إنشاء الحساب",
        );
      } finally {
        setIsSubmitting(
          false,
        );
      }
    };

  if (
    registrationComplete
  ) {
    return (
      <section
        className="
          overflow-hidden
          rounded-[28px]
          border
          border-emerald-100
          bg-white
          shadow-[0_16px_45px_rgba(0,27,61,0.08)]
        "
      >
        <div
          className="
            border-b
            border-emerald-100
            bg-gradient-to-l
            from-emerald-50
            via-white
            to-white
            p-5
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-emerald-100
                text-emerald-700
              "
            >
              <CheckCircle2
                size={26}
              />
            </div>

            <div>
              <h2
                className="
                  text-xl
                  font-bold
                  text-primary
                "
              >
                حسابك اتعمل بنجاح
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-text-muted
                "
              >
                احفظ الباسورد دلوقتي قبل ما تروح لصفحة تسجيل الدخول.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-[#f8faf9]
              p-4
            "
          >
            <div
              className="
                mb-3
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div>
                <p className="text-sm font-bold text-primary">
                  الباسورد بتاعك
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  هيظهر هنا المرة دي بس.
                </p>
              </div>

              <ShieldCheck
                size={22}
                className="text-emerald-700"
              />
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-white
                p-2
              "
            >
              <div
                dir="ltr"
                className="
                  min-w-0
                  flex-1
                  overflow-x-auto
                  whitespace-nowrap
                  rounded-lg
                  px-3
                  py-2
                  text-left
                  font-mono
                  text-base
                  font-bold
                  tracking-wide
                  text-primary
                "
              >
                {isCreatedPasswordVisible
                  ? createdPassword
                  : "••••••••••••"}
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsCreatedPasswordVisible(
                    (
                      current,
                    ) =>
                      !current,
                  )
                }
                aria-label={
                  isCreatedPasswordVisible
                    ? "إخفاء الباسورد"
                    : "إظهار الباسورد"
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-gray-500
                  transition
                  hover:bg-gray-100
                "
              >
                {isCreatedPasswordVisible ? (
                  <EyeOff
                    size={20}
                  />
                ) : (
                  <Eye
                    size={20}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={
                  handleCopyPassword
                }
                className="
                  flex
                  h-10
                  shrink-0
                  items-center
                  gap-2
                  rounded-lg
                  bg-primary
                  px-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                  active:scale-[0.98]
                "
              >
                <Copy
                  size={17}
                />

                {isPasswordCopied
                  ? "اتنسخ"
                  : "نسخ"}
              </button>
            </div>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-amber-200
              bg-amber-50
              p-4
            "
          >
            <div className="flex items-start gap-3">
              <TriangleAlert
                size={22}
                className="
                  mt-0.5
                  shrink-0
                  text-amber-700
                "
              />

              <div>
                <p
                  className="
                    font-bold
                    text-amber-950
                  "
                >
                  مهم جدًا قبل ما تكمل
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-7
                    text-amber-950/80
                  "
                >
                  فريق الدعم لا يقدر يشوف أو يرجع الباسورد الحالي لأن
                  كلمة المرور لا يتم حفظها بصورتها الأصلية.
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    font-semibold
                    leading-7
                    text-amber-950
                  "
                >
                  لو نسيت الباسورد، تواصل مع الدعم من زر «نسيت الباسورد؟».
                  بعد التحقق من ملكية الحساب، سيتم حذف الحساب القديم بالكامل
                  عن طريق الدعم، وبعدها هتعمل حساب جديد.
                </p>
              </div>
            </div>
          </div>

          <p
            className="
              text-center
              text-xs
              leading-6
              text-text-muted
            "
          >
            الباسورد موجود في الصفحة دي مؤقتًا فقط، ومش بيتخزن في المتصفح
            علشان نرجعهولك بعدين.
          </p>

          <button
            type="button"
            onClick={
              handleContinueToLogin
            }
            className="
              flex
              h-14
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-secondary
              text-lg
              font-bold
              text-white
              transition
              hover:opacity-90
              active:scale-[0.98]
            "
          >
            حفظت الباسورد — تسجيل الدخول

            <ArrowLeft
              size={21}
            />
          </button>
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="flex flex-col gap-4"
      noValidate
    >
      <TextField
        label="الاسم بالكامل"
        id="fullName"
        value={
          formData.fullName
        }
        onChange={
          handleChange
        }
        onBlur={
          handleBlur
        }
        placeholder="محمد أحمد"
        autoComplete="name"
        error={
          errors.fullName
        }
        disabled={
          isSubmitting
        }
        icon={User}
      />

      <TextField
        label="رقم الموبايل"
        id="phone"
        type="tel"
        inputMode="tel"
        value={
          formData.phone
        }
        onChange={
          handleChange
        }
        onBlur={
          handleBlur
        }
        placeholder="01XXXXXXXXX"
        autoComplete="tel"
        error={
          errors.phone
        }
        disabled={
          isSubmitting
        }
        icon={
          Smartphone
        }
      />

      <TextField
        label="عنوان التوصيل"
        id="address"
        value={
          formData.address
        }
        onChange={
          handleChange
        }
        onBlur={
          handleBlur
        }
        placeholder="اكتب عنوانك بالتفصيل"
        autoComplete="street-address"
        error={
          errors.address
        }
        disabled={
          isSubmitting
        }
        icon={MapPin}
      />

      <PasswordField
        label="الباسورد"
        id="password"
        value={
          formData.password
        }
        onChange={
          handleChange
        }
        onBlur={
          handleBlur
        }
        placeholder="••••••••"
        autoComplete="new-password"
        error={
          errors.password
        }
        disabled={
          isSubmitting
        }
        icon={Lock}
      />

      <PasswordField
        label="أكد الباسورد"
        id="confirmPassword"
        value={
          formData.confirmPassword
        }
        onChange={
          handleChange
        }
        onBlur={
          handleBlur
        }
        placeholder="••••••••"
        autoComplete="new-password"
        error={
          errors.confirmPassword
        }
        disabled={
          isSubmitting
        }
        icon={
          RotateCcwKey
        }
      />

      <div>
        <div className="flex items-center gap-3 pt-2">
          <input
            id="termsAccepted"
            name="termsAccepted"
            type="checkbox"
            checked={
              formData.termsAccepted
            }
            onChange={
              handleChange
            }
            disabled={
              isSubmitting
            }
            className="
              h-5 w-5
              cursor-pointer
              rounded
              border-2
              border-outline
              accent-secondary
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />

          <label
            htmlFor="termsAccepted"
            className="
              cursor-pointer
              text-base
              text-text-muted
            "
          >
            أنا موافق على{" "}

            <button
              type="button"
              onClick={() =>
                setIsTermsOpen(
                  true,
                )
              }
              className="
                font-semibold
                text-secondary
                hover:underline
              "
            >
              الشروط والأحكام
            </button>
          </label>
        </div>

        {errors.termsAccepted && (
          <p className="mt-2 text-sm text-red-600">
            {
              errors.termsAccepted
            }
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={
          isSubmitting
        }
        aria-busy={
          isSubmitting
        }
        className="
          mt-6
          flex
          h-14
          w-full
          items-center
          justify-center
          gap-2
          rounded-full
          bg-[#4CAF50]
          text-xl
          font-semibold
          text-white
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          transition
          hover:opacity-90
          active:scale-[0.98]
          disabled:cursor-wait
          disabled:opacity-60
          disabled:active:scale-100
        "
      >
        {isSubmitting ? (
          "جاري إنشاء الحساب..."
        ) : (
          <>
            إنشاء الحساب

            <ArrowLeft
              size={23}
            />
          </>
        )}
      </button>

      <Modal
        isOpen={
          isTermsOpen
        }
        onClose={() =>
          setIsTermsOpen(
            false,
          )
        }
        title="الشروط والأحكام"
        maxWidth="max-w-lg"
      >
        <div className="flex max-h-[70vh] flex-col">
          <div className="overflow-y-auto pl-2">
            <div className="space-y-5 text-sm leading-7 text-text-muted">
              <section>
                <h3 className="mb-2 font-bold text-text-main">
                  1. إنشاء الحساب
                </h3>

                <p>
                  يجب إدخال بيانات صحيحة عند إنشاء الحساب، ويكون المستخدم
                  مسؤولًا عن الحفاظ على سرية بيانات تسجيل الدخول الخاصة به.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-bold text-text-main">
                  2. استخدام الموقع
                </h3>

                <p>
                  يلتزم المستخدم باستخدام الموقع لأغراض قانونية وعدم إساءة
                  استخدام الخدمات أو محاولة التأثير على تشغيل الموقع.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-bold text-text-main">
                  3. المنتجات والأسعار
                </h3>

                <p>
                  يتم عرض أسعار المنتجات وتفاصيلها حسب البيانات المتاحة،
                  وقد تتغير الأسعار أو العروض أو توافر المنتجات من وقت
                  لآخر.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-bold text-text-main">
                  4. الطلبات
                </h3>

                <p>
                  يخضع قبول الطلب لتوافر المنتجات وصحة بيانات العميل
                  وإمكانية تنفيذ الطلب في منطقة التوصيل المحددة.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-bold text-text-main">
                  5. الدفع
                </h3>

                <p>
                  يتم الدفع باستخدام طرق الدفع المتاحة داخل الموقع، ويلتزم
                  المستخدم بصحة بيانات الدفع المستخدمة عند إتمام الطلب.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-bold text-text-main">
                  6. التوصيل
                </h3>

                <p>
                  تختلف مدة ورسوم التوصيل حسب المنطقة والطلب، وقد يحدث
                  تأخير في بعض الحالات الخارجة عن السيطرة.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-bold text-text-main">
                  7. الإلغاء والاسترجاع
                </h3>

                <p>
                  يخضع إلغاء الطلبات أو استرجاع المنتجات لسياسة المتجر
                  المعتمدة وحالة الطلب وطبيعة المنتج.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-bold text-text-main">
                  8. الخصوصية
                </h3>

                <p>
                  يتم استخدام بيانات المستخدم لتقديم الخدمة وتنفيذ الطلبات
                  وتحسين تجربة الاستخدام وفق سياسة الخصوصية الخاصة بالموقع.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-bold text-text-main">
                  9. تعديل الشروط
                </h3>

                <p>
                  يحق للمتجر تحديث هذه الشروط عند الحاجة، ويعتبر استمرار
                  استخدام الموقع بعد التعديل موافقة على الشروط المحدثة.
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-bold text-text-main">
                  10. الموافقة
                </h3>

                <p>
                  بإنشاء الحساب واستخدام الموقع، يقر المستخدم بأنه قرأ هذه
                  الشروط وفهمها ووافق عليها.
                </p>
              </section>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() =>
                setIsTermsOpen(
                  false,
                )
              }
              className="
                w-full
                rounded-xl
                bg-secondary
                py-3
                font-semibold
                text-white
                transition
                hover:opacity-90
                active:scale-[0.98]
              "
            >
              تم
            </button>
          </div>
        </div>
      </Modal>
    </form>
  );
}

export default RegisterForm;