import {
  useState,
} from "react";

import {
  Lock,
  LogIn,
  Smartphone,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

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
    <div
      className="
        flex min-h-screen
        items-center
        justify-center
        bg-gray-50
        px-5
      "
    >
      <div
        className="
          w-full max-w-md
          rounded-3xl
          bg-white p-7
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        "
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            لوحة تحكم سوقيا
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            تسجيل دخول الإدارة
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
              className="mb-2 block text-sm font-semibold"
            >
              رقم الموبايل
            </label>

            <div className="relative">
              <Smartphone
                size={19}
                className="
                  absolute right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="username"
                value={phone}
                onChange={(
                  event,
                ) =>
                  setPhone(
                    event.target
                      .value,
                  )
                }
                disabled={
                  isSubmitting
                }
                placeholder="01XXXXXXXXX"
                className="
                  w-full rounded-xl
                  border border-gray-200
                  py-3 pl-4 pr-11
                  outline-none
                  transition
                  focus:border-green-500
                  focus:ring-1
                  focus:ring-green-500
                  disabled:bg-gray-100
                "
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              الباسورد
            </label>

            <div className="relative">
              <Lock
                size={19}
                className="
                  absolute right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(
                  event,
                ) =>
                  setPassword(
                    event.target
                      .value,
                  )
                }
                disabled={
                  isSubmitting
                }
                placeholder="••••••••"
                className="
                  w-full rounded-xl
                  border border-gray-200
                  py-3 pl-4 pr-11
                  outline-none
                  transition
                  focus:border-green-500
                  focus:ring-1
                  focus:ring-green-500
                  disabled:bg-gray-100
                "
              />
            </div>
          </div>

          {error && (
            <div
              className="
                rounded-xl
                border border-red-100
                bg-red-50
                px-4 py-3
                text-sm
                text-red-600
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
              flex w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-green-600
              py-3.5
              font-semibold
              text-white
              transition
              hover:opacity-90
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isSubmitting ? (
              <>
                <span
                  className="
                    h-5 w-5
                    animate-spin
                    rounded-full
                    border-2
                    border-white/40
                    border-t-white
                  "
                />

                جاري الدخول...
              </>
            ) : (
              <>
                <LogIn
                  size={20}
                />

                دخول لوحة التحكم
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;