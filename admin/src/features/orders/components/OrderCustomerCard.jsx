import {
  MapPin,
  MessageCircle,
  Phone,
  UserRound,
} from "lucide-react";

function normalizeWhatsAppPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");

  // WhatsApp wa.me links require country code digits only (no "+" or leading 0).
  // Egyptian mobile: 01012345678 -> 201012345678
  if (/^01[0125]\d{8}$/.test(digits)) {
    return `20${digits.slice(1)}`;
  }

  // Already formatted as +20... or 20...
  if (/^201[0125]\d{8}$/.test(digits)) {
    return digits;
  }

  // International prefix: 0020...
  if (/^00201[0125]\d{8}$/.test(digits)) {
    return digits.slice(2);
  }

  // Egyptian mobile without the local leading zero: 1012345678
  if (/^1[0125]\d{8}$/.test(digits)) {
    return `20${digits}`;
  }

  return null;
}

export default function OrderCustomerCard({
  customer,
}) {
  if (!customer) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <UserRound size={19} />
          بيانات العميل
        </h2>

        <p className="mt-4 text-sm text-slate-400">
          لا توجد بيانات عميل مسجلة لهذا الطلب.
        </p>
      </div>
    );
  }

  const whatsappPhone = normalizeWhatsAppPhone(customer.phone);

  const message = encodeURIComponent(
    `مرحبا ${customer.name} بخصوص طلبك من سوقيا`,
  );

  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${message}`
    : null;

  const phoneUrl = customer.phone
    ? `tel:${customer.phone}`
    : "#";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
        <UserRound size={19} />
        بيانات العميل
      </h2>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs text-slate-400">
            العميل
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {customer.name || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            رقم الهاتف
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              dir="ltr"
              className="ml-auto text-sm font-semibold text-slate-700"
            >
              {customer.phone || "—"}
            </span>

            {customer.phone && (
              <>
                <a
                  href={phoneUrl}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                  aria-label="اتصال بالعميل"
                >
                  <Phone size={17} />
                </a>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                    aria-label="إرسال رسالة واتساب"
                  >
                    <MessageCircle size={18} />
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {customer.address && (
          <div className="border-t border-slate-100 pt-4">
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin size={14} />
              العنوان
            </p>

            <p className="mt-2 text-sm leading-7 text-slate-700">
              {customer.address}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}