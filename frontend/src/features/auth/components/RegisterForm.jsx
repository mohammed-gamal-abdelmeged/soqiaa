import { useState } from "react";

import {
  ArrowLeft,
  Lock,
  MapPin,
  RotateCcwKey,
  Smartphone,
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
        [name]: true,
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

      setIsSubmitting(true);

      try {
        await register({
          fullName:
            formData.fullName.trim(),

          phone:
            formData.phone.trim(),

          address:
            formData.address.trim(),

          password:
            formData.password,

          confirmPassword:
            formData.confirmPassword,

          termsAccepted:
            formData.termsAccepted,
        });

        showSuccess(
          "تم إنشاء الحساب بنجاح، سجل دخولك الآن",
        );

        navigate(
          "/login",
          {
            replace: true,
          },
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
              h-5 w-5 cursor-pointer
              rounded border-2
              border-outline
              accent-secondary
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />

          <label
            htmlFor="termsAccepted"
            className="cursor-pointer text-base text-text-muted"
          >
            أنا موافق على{" "}

            <button
              type="button"
              onClick={() =>
                setIsTermsOpen(
                  true,
                )
              }
              className="font-semibold text-secondary hover:underline"
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
        className="
          mt-6 flex h-14 w-full
          items-center justify-center
          gap-2 rounded-full
          bg-[#4CAF50]
          text-xl font-semibold
          text-white
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          transition
          hover:opacity-90
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-60
          disabled:active:scale-100
        "
      >
        {isSubmitting ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

            جاري إنشاء الحساب...
          </>
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
                w-full rounded-xl
                bg-secondary py-3
                font-semibold text-white
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