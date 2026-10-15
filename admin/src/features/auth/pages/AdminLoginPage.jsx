import {
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  Lock,
  LogIn,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import logo from "../../../assets/brand/soqiaa-logo.png";

import {
  loginAdmin,
} from "../../../services/auth.service";

import {
  useAdminAuth,
} from "../context/useAdminAuth";

function AdminLoginPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    setAuthData,
  } = useAdminAuth();

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    isPasswordVisible,
    setIsPasswordVisible,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      const normalizedPhone =
        phone
          .trim()
          .replace(
            /[\s-]/g,
            "",
          );

      if (
        !normalizedPhone ||
        !password
      ) {
        setError(
          "اكتب رقم الموبايل والباسورد",
        );

        return;
      }

      setError("");
      setIsSubmitting(true);

      try {
        const user =
          await loginAdmin({
            phone:
              normalizedPhone,

            password,
          });

        setAuthData(
          user,
        );

        const destination =
          location.state
            ?.from?.pathname ||
          "/";

        navigate(
          destination,
          {
            replace: true,
          },
        );
      } catch (loginError) {
        setError(
          loginError?.message ||
            "تعذر تسجيل الدخول للوحة التحكم",
        );
      } finally {
        setIsSubmitting(
          false,
        );
      }
    };

  return (
    <main
      className="
        relative
        min-h-[100dvh]
        overflow-hidden
        bg-[#f4f7f5]
        px-4
        py-5

        sm:px-6
        sm:py-8

        lg:flex
        lg:items-center
        lg:justify-center
        lg:px-8
        lg:py-10
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-72
          w-72
          rounded-full
          bg-emerald-100/70
          blur-3xl

          sm:h-96
          sm:w-96
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-32
          -left-24
          h-80
          w-80
          rounded-full
          bg-slate-200/70
          blur-3xl

          sm:h-[28rem]
          sm:w-[28rem]
        "
      />

      <section
        className="
          relative
          z-10
          mx-auto
          grid
          w-full
          max-w-[1120px]
          overflow-hidden
          rounded-[28px]
          border
          border-white/80
          bg-white
          shadow-[0_24px_80px_rgba(15,23,42,0.10)]

          lg:min-h-[660px]
          lg:grid-cols-[0.9fr_1.1fr]
          lg:rounded-[36px]
        "
      >
        <aside
          className="
            relative
            hidden
            overflow-hidden
            bg-[#062b23]
            p-10
            text-white

            lg:flex
            lg:flex-col
            lg:justify-between

            xl:p-12
          "
        >
          <div
            aria-hidden="true"
            className="
              absolute
              -left-16
              -top-20
              h-64
              w-64
              rounded-full
              bg-emerald-400/15
              blur-2xl
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              -bottom-24
              -right-20
              h-72
              w-72
              rounded-full
              bg-white/5
              blur-2xl
            "
          />

          <div className="relative z-10">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/8
                px-3
                py-2
                text-xs
                font-semibold
                text-emerald-100
              "
            >
              <ShieldCheck
                size={16}
              />

              منطقة مخصصة للإدارة
            </div>

            <div className="mt-10">
              <img
                src={logo}
                alt="سوقيا"
                className="
                  h-24
                  w-24
                  rounded-3xl
                  bg-white
                  object-contain
                  p-2
                  shadow-lg
                "
              />

              <h2
                className="
                  mt-8
                  max-w-md
                  text-4xl
                  font-extrabold
                  leading-[1.4]

                  xl:text-[42px]
                "
              >
                إدارة سوقيا
                <span className="block text-emerald-300">
                  بشكل أسرع وأوضح
                </span>
              </h2>

              <p
                className="
                  mt-5
                  max-w-md
                  text-sm
                  leading-8
                  text-slate-300

                  xl:text-base
                "
              >
                تابع المنتجات والطلبات والعملاء من مكان واحد.
                سجّل دخولك بحساب الإدارة للمتابعة.
              </p>
            </div>
          </div>

          <div
            className="
              relative
              z-10
              rounded-2xl
              border
              border-white/10
              bg-white/5
              p-4
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-400/15
                  text-emerald-300
                "
              >
                <Lock
                  size={19}
                />
              </div>

              <div>
                <p className="text-sm font-bold">
                  دخول آمن
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-6
                    text-slate-300
                  "
                >
                  بيانات الدخول محمية، ولا يتم عرض كلمة المرور داخل لوحة الإدارة.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div
          className="
            flex
            min-h-[calc(100dvh-40px)]
            items-center
            justify-center
            p-5

            sm:min-h-0
            sm:p-8

            lg:p-12

            xl:p-16
          "
        >
          <div
            className="
              w-full
              max-w-[470px]
            "
          >
            <div
              className="
                mb-8
                text-center

                lg:text-right
              "
            >
              <img
                src={logo}
                alt="سوقيا"
                className="
                  mx-auto
                  mb-5
                  h-20
                  w-20
                  object-contain

                  lg:hidden
                "
              />

              <div
                className="
                  mb-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-emerald-50
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-emerald-700

                  lg:hidden
                "
              >
                <ShieldCheck
                  size={15}
                />

                تسجيل دخول الإدارة
              </div>

              <h1
                className="
                  text-3xl
                  font-extrabold
                  tracking-tight
                  text-slate-950

                  sm:text-4xl
                "
              >
                أهلاً بك في لوحة التحكم
              </h1>

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-sm
                  text-sm
                  leading-7
                  text-slate-500

                  lg:mx-0
                "
              >
                أدخل بيانات حساب الإدارة للوصول إلى لوحة تحكم سوقيا.
              </p>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5"
              noValidate
            >
              <div>
                <label
                  htmlFor="phone"
                  className="
                    mb-2
                    block
                    text-sm
                    font-bold
                    text-slate-800
                  "
                >
                  رقم الموبايل
                </label>

                <div className="relative">
                  <Smartphone
                    size={20}
                    aria-hidden="true"
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
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="username"
                    value={phone}
                    onChange={(
                      event,
                    ) => {
                      setPhone(
                        event.target
                          .value,
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    disabled={
                      isSubmitting
                    }
                    placeholder="01XXXXXXXXX"
                    dir="ltr"
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      pl-4
                      pr-12
                      text-left
                      text-base
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-emerald-500
                      focus:ring-4
                      focus:ring-emerald-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-50
                      disabled:text-slate-400
                    "
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="
                    mb-2
                    block
                    text-sm
                    font-bold
                    text-slate-800
                  "
                >
                  الباسورد
                </label>

                <div className="relative">
                  <Lock
                    size={20}
                    aria-hidden="true"
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
                    id="password"
                    name="password"
                    type={
                      isPasswordVisible
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(
                      event,
                    ) => {
                      setPassword(
                        event.target
                          .value,
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    disabled={
                      isSubmitting
                    }
                    placeholder="أدخل الباسورد"
                    dir="ltr"
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      pl-12
                      pr-12
                      text-left
                      text-base
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-emerald-500
                      focus:ring-4
                      focus:ring-emerald-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-50
                      disabled:text-slate-400
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setIsPasswordVisible(
                        (
                          current,
                        ) =>
                          !current,
                      )
                    }
                    disabled={
                      isSubmitting
                    }
                    aria-label={
                      isPasswordVisible
                        ? "إخفاء الباسورد"
                        : "إظهار الباسورد"
                    }
                    className="
                      absolute
                      left-2.5
                      top-1/2
                      flex
                      h-9
                      w-9
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-xl
                      text-slate-400
                      transition
                      hover:bg-slate-100
                      hover:text-slate-700
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-emerald-500
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {isPasswordVisible ? (
                      <EyeOff
                        size={19}
                      />
                    ) : (
                      <Eye
                        size={19}
                      />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="
                    rounded-2xl
                    border
                    border-red-100
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    font-medium
                    leading-6
                    text-red-700
                  "
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-emerald-700
                  px-5
                  text-base
                  font-bold
                  text-white
                  shadow-[0_10px_24px_rgba(4,120,87,0.20)]
                  transition
                  hover:bg-emerald-800
                  focus-visible:outline-none
                  focus-visible:ring-4
                  focus-visible:ring-emerald-500/20
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="
                        h-5
                        w-5
                        animate-spin
                        rounded-full
                        border-2
                        border-white/40
                        border-t-white
                      "
                    />

                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <LogIn
                      size={21}
                    />

                    دخول لوحة التحكم
                  </>
                )}
              </button>
            </form>

            <div
              className="
                mt-6
                flex
                items-center
                justify-center
                gap-2
                text-center
                text-xs
                leading-6
                text-slate-400
              "
            >
              <ShieldCheck
                size={15}
                className="shrink-0 text-emerald-600"
              />

              هذه الصفحة مخصصة لحسابات إدارة سوقيا فقط
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminLoginPage;
