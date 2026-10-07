import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  Navigate,
} from "react-router-dom";

import logo from "../../../assets/images/logo.png";

import {
  useAuth,
} from "../../auth/context/useAuth";

const LANDING_TITLE =
  "مشترياتك بقت أسهل مع سوقيا";

function LandingPage() {
  const {
    isAuthenticated,
  } = useAuth();

  const [
    displayedTitle,
    setDisplayedTitle,
  ] = useState("");

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    if (prefersReducedMotion) {
      setDisplayedTitle(
        LANDING_TITLE,
      );

      return;
    }

    setDisplayedTitle("");

    let currentIndex = 0;

    const typingInterval =
      window.setInterval(() => {
        currentIndex += 1;

        setDisplayedTitle(
          LANDING_TITLE.slice(
            0,
            currentIndex,
          ),
        );

        if (
          currentIndex >=
          LANDING_TITLE.length
        ) {
          window.clearInterval(
            typingInterval,
          );
        }
      }, 100);

    return () => {
      window.clearInterval(
        typingInterval,
      );
    };
  }, []);

  if (isAuthenticated) {
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#f7f9f6]
        text-primary
      "
    >
      <header
        className="
          mx-auto
          flex
          w-full
          max-w-[1180px]
          items-center
          justify-between
          px-5
          py-5

          lg:px-6
        "
      >
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="سوقيا"
            className="
              h-14
              w-14
              rounded-xl
              object-contain
            "
          />

          <strong className="text-xl">
            سوقيا
          </strong>
        </div>

        <Link
          to="/login"
          className="
            rounded-xl
            border
            border-secondary
            px-5
            py-2.5
            text-sm
            font-bold
            text-secondary
            transition
            hover:bg-secondary
            hover:text-white
          "
        >
          تسجيل الدخول
        </Link>
      </header>

      <main
        className="
          mx-auto
          flex
          w-full
          max-w-[1180px]
          flex-1
          items-center
          px-5
          py-16

          lg:min-h-[70vh]
          lg:px-6
        "
      >
        <section
          className="
            w-full
            rounded-[32px]
            bg-white
            px-6
            py-12
            text-center
            shadow-[0_16px_50px_rgba(9,43,80,0.08)]

            md:px-12
            md:py-16
          "
        >
          <img
            src={logo}
            alt="شعار سوقيا"
            className="
              mx-auto
              h-24
              w-24
              object-contain

              md:h-28
              md:w-28
            "
          />

          <h1
            className="
              mx-auto
              mt-6
              min-h-[72px]
              max-w-3xl
              text-3xl
              font-extrabold
              leading-tight

              md:min-h-[120px]
              md:text-5xl
            "
          >
            {displayedTitle}
          </h1>

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              leading-8
              text-text-muted

              md:text-base
            "
          >
            سوقيا لتوزيع المشروبات والمواد الغذائية.
            بنقدملك احتياجاتك اليومية وعروض واضحة
            وتجربة شراء سريعة وبسيطة.
          </p>

          <div
            className="
              mt-8
              flex
              flex-col
              justify-center
              gap-3

              sm:flex-row
            "
          >
            <Link
              to="/login"
              className="
                rounded-xl
                bg-secondary
                px-8
                py-3.5
                font-bold
                text-white
                transition
                hover:opacity-90
              "
            >
              تسجيل الدخول
            </Link>

            <Link
              to="/register"
              className="
                rounded-xl
                border
                border-primary/15
                bg-white
                px-8
                py-3.5
                font-bold
                text-primary
                transition
                hover:bg-gray-50
              "
            >
              إنشاء حساب
            </Link>
          </div>
        </section>
      </main>

      <footer
        className="
          px-5
          pb-8
          text-center
          text-xs
          text-text-muted
        "
      >
        © 2026 سوقيا. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}

export default LandingPage;