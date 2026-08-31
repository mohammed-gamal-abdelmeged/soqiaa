import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../../../assets/images/logo.png";

function HomeFooter() {
  return (
    <footer
      className="
        mt-14 rounded-t-[34px]
        bg-[linear-gradient(135deg,#071f39_0%,#092b50_55%,#0d365f_100%)]
        pb-28 pt-10 text-white
        md:pb-8
      "
    >
      <div
        className="
          mx-auto grid w-full max-w-[1180px]
          gap-8 px-5
          md:grid-cols-[1.4fr_.6fr_.8fr]
        "
      >
        {/* Brand */}
        <div>
          <div className="flex items-center gap-4">
            <div
              className="
                flex h-16 w-16 items-center
                justify-center rounded-2xl
                bg-white p-1
              "
            >
              <img
                src={logo}
                alt="سوقيا"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <strong className="text-xl">
                سوقيا
              </strong>

              <p className="mt-1 text-xs text-white/60">
                احتياجات البيت أقرب وأسهل.
              </p>
            </div>
          </div>

          <p
            className="
              mt-5 max-w-lg
              text-xs leading-7
              text-white/65
            "
          >
            سوقيا لتوزيع المشروبات والمواد الغذائية.
            بنقدملك احتياجاتك اليومية وعروض واضحة
            وتجربة شراء سريعة وبسيطة.
          </p>

          {/* Social Media */}
          <div className="mt-5 flex gap-2">
            <SocialButton
              label="Facebook"
              href="#"
            >
              <FacebookIcon />
            </SocialButton>

            <SocialButton
              label="Instagram"
              href="#"
            >
              <InstagramIcon />
            </SocialButton>

            <SocialButton
              label="WhatsApp"
              href="#"
            >
              <WhatsAppIcon />
            </SocialButton>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="mb-4 text-xs font-bold text-green-300">
            استكشف
          </h3>

          <div className="flex flex-col gap-3 text-xs text-white/70">
            <Link
              to="/categories"
              className="transition hover:text-white"
            >
              الأقسام
            </Link>

            <Link
              to="/offers"
              className="transition hover:text-white"
            >
              العروض
            </Link>

            <Link
              to="/best-sellers"
              className="transition hover:text-white"
            >
              الأكثر مبيعًا
            </Link>

            <Link
              to="/home"
              className="transition hover:text-white"
            >
              الرئيسية
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-xs font-bold text-green-300">
            تواصل مع سوقيا
          </h3>

          <div className="space-y-3">
            <a
              href="tel:01000000000"
              className="
                flex items-center gap-3
                rounded-2xl border
                border-white/10
                bg-white/5 p-3
                transition
                hover:bg-white/10
              "
            >
              <span
                className="
                  flex h-10 w-10
                  shrink-0 items-center
                  justify-center rounded-xl
                  bg-green-400/10
                  text-green-300
                "
              >
                <Phone size={18} />
              </span>

              <div>
                <span className="block text-[10px] text-white/50">
                  خدمة العملاء
                </span>

                <strong
                  dir="ltr"
                  className="mt-1 block text-xs"
                >
                  0100 000 0000
                </strong>
              </div>
            </a>

            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noreferrer"
              className="
                flex items-center gap-3
                rounded-2xl border
                border-white/10
                bg-white/5 p-3
                transition
                hover:bg-white/10
              "
            >
              <span
                className="
                  flex h-10 w-10
                  shrink-0 items-center
                  justify-center rounded-xl
                  bg-green-400/10
                  text-green-300
                "
              >
                <WhatsAppIcon />
              </span>

              <div>
                <span className="block text-[10px] text-white/50">
                  واتساب
                </span>

                <strong
                  dir="ltr"
                  className="mt-1 block text-xs"
                >
                  0100 000 0000
                </strong>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div
        className="
          mx-auto mt-8 flex
          w-full max-w-[1180px]
          flex-wrap justify-between
          gap-3 border-t
          border-white/10
          px-5 pt-5
          text-[10px]
          text-white/45
        "
      >
        <span>
          © 2026 سوقيا. جميع الحقوق محفوظة.
        </span>

        <span>
          شكرًا لاختياركم سوقيا 💚
        </span>
      </div>
    </footer>
  );
}

function SocialButton({
  children,
  label,
  href,
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="
        flex h-10 w-10
        items-center justify-center
        rounded-xl border
        border-white/10
        bg-white/5
        transition
        hover:-translate-y-0.5
        hover:bg-secondary
        active:scale-95
      "
    >
      {children}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 8h3V4.5c-.5-.1-2.2-.2-4.1-.2-4 0-6.7 2.4-6.7 6.9V15H8v4h4.9v-4h3.8l.6-4h-4.4V11c0-1.8.5-3 3.1-3Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 11.7a8 8 0 0 1-11.9 7L4 19.8l1.1-4A8 8 0 1 1 20 11.7Z" />

      <path d="M8.5 8.2c.3-.6.5-.6.8-.6h.5c.2 0 .4.1.5.5l.7 1.7c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .7.5.9 1.2 1.6 2.1 2.1.3.2.5.2.7 0l.8-.9c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.6 0 .5-.3 1.3-.9 1.8-.6.5-1.4.7-2.2.5-1.2-.3-2.8-.9-4.4-2.4-1.4-1.3-2.3-2.8-2.7-3.9-.4-1.1 0-1.8.3-2.2Z" />
    </svg>
  );
}

export default HomeFooter;