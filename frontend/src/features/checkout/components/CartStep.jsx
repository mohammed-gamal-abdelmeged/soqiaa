import {
  useEffect,
  useMemo,
  useState,
} from "react";

import CartItem from "../../cart/components/CartItem";

import {
  useCart,
} from "../../cart/context/useCart";

import {
  usePreviewOrder,
} from "../../orders/hooks/useOrders";

import {
  showError,
  showSuccess,
} from "../../../lib/toast";

function CartStep({
  appliedCoupon,
  setAppliedCoupon,
}) {
  const {
    items,
    subtotal,
  } = useCart();

  const {
    mutateAsync: previewOrder,
    isPending,
  } = usePreviewOrder();

  const [
    couponCode,
    setCouponCode,
  ] = useState(
    appliedCoupon || "",
  );

  const [
    couponPreview,
    setCouponPreview,
  ] = useState(null);

  const [
    appliedCartSignature,
    setAppliedCartSignature,
  ] = useState(null);

  const cartSignature =
    useMemo(() => {
      return items
        .map(
          (item) =>
            `${item.id}:${item.quantity}`,
        )
        .join("|");
    }, [items]);

  useEffect(() => {
    if (
      !appliedCoupon ||
      couponPreview
    ) {
      return;
    }

    let cancelled = false;

    const loadPreview =
      async () => {
        try {
          const preview =
            await previewOrder({
              couponCode:
                appliedCoupon,
            });

          if (cancelled) {
            return;
          }

          setCouponPreview(
            preview,
          );

          setCouponCode(
            preview.couponCode ||
              appliedCoupon,
          );

          setAppliedCartSignature(
            cartSignature,
          );
        } catch {
          if (cancelled) {
            return;
          }

          setCouponPreview(
            null,
          );

          setCouponCode("");

          setAppliedCoupon(
            null,
          );

          setAppliedCartSignature(
            null,
          );
        }
      };

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [
    appliedCoupon,
    cartSignature,
    couponPreview,
    previewOrder,
    setAppliedCoupon,
  ]);

  useEffect(() => {
    if (
      !appliedCoupon ||
      !appliedCartSignature
    ) {
      return;
    }

    if (
      cartSignature ===
      appliedCartSignature
    ) {
      return;
    }

    setCouponPreview(
      null,
    );

    setCouponCode("");

    setAppliedCoupon(
      null,
    );

    setAppliedCartSignature(
      null,
    );
  }, [
    appliedCoupon,
    appliedCartSignature,
    cartSignature,
    setAppliedCoupon,
  ]);

  if (
    items.length === 0
  ) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-primary">
          السلة فاضية
        </h2>

        <p className="mt-2 text-text-muted">
          ضيف منتجات الأول عشان تكمل الطلب
        </p>
      </div>
    );
  }

  const displayedSubtotal =
    couponPreview
      ?.subtotal ??
    subtotal;

  const discountAmount =
    couponPreview
      ?.discountAmount ??
    0;

  const totalAfterDiscount =
    displayedSubtotal -
    discountAmount;

  const handleApplyCoupon =
    async () => {
      const code =
        couponCode
          .trim()
          .toUpperCase();

      if (!code) {
        showError(
          "اكتب كود الخصم الأول",
        );

        return;
      }

      if (appliedCoupon) {
        showError(
          "تم تطبيق كود خصم بالفعل",
        );

        return;
      }

      try {
        const preview =
          await previewOrder({
            couponCode:
              code,
          });

        setCouponPreview(
          preview,
        );

        setAppliedCoupon(
          preview.couponCode,
        );

        setCouponCode(
          preview.couponCode,
        );

        setAppliedCartSignature(
          cartSignature,
        );

        showSuccess(
          "تم تطبيق كود الخصم بنجاح",
        );
      } catch (error) {
        setCouponPreview(
          null,
        );

        setAppliedCoupon(
          null,
        );

        setAppliedCartSignature(
          null,
        );

        showError(
          error?.message ||
            "كود الخصم غير صالح",
        );
      }
    };

  const handleRemoveCoupon =
    () => {
      setCouponCode("");

      setCouponPreview(
        null,
      );

      setAppliedCoupon(
        null,
      );

      setAppliedCartSignature(
        null,
      );

      showSuccess(
        "تم إلغاء كود الخصم",
      );
    };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-primary">
        منتجات السلة
      </h2>

      {items.map(
        (item) => (
          <CartItem
            key={item.id}
            item={item}
          />
        ),
      )}

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-primary">
          عندك كود خصم؟
        </h3>

        {!appliedCoupon ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={
                couponCode
              }
              onChange={(
                event,
              ) =>
                setCouponCode(
                  event.target
                    .value,
                )
              }
              disabled={
                isPending
              }
              placeholder="اكتب الكود هنا"
              className="
                min-w-0 flex-1
                rounded-xl
                border border-outline
                bg-white px-3 py-3
                outline-none
                focus:border-secondary
                focus:ring-1
                focus:ring-secondary
                disabled:cursor-not-allowed
                disabled:bg-gray-100
              "
            />

            <button
              type="button"
              onClick={
                handleApplyCoupon
              }
              disabled={
                isPending
              }
              className="
                min-w-[88px]
                rounded-xl
                bg-primary px-5
                font-semibold
                text-white
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isPending
                ? "جاري..."
                : "تطبيق"}
            </button>
          </div>
        ) : (
          <div
            className="
              flex items-center
              justify-between
              rounded-xl
              border border-green-200
              bg-green-50
              px-4 py-3
            "
          >
            <div>
              <p className="font-semibold text-secondary">
                {appliedCoupon}
              </p>

              {discountAmount >
                0 && (
                <p className="mt-1 text-xs text-gray-500">
                  خصم{" "}
                  {
                    discountAmount
                  }{" "}
                  ج.م مطبق
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={
                handleRemoveCoupon
              }
              disabled={
                isPending
              }
              className="
                text-sm font-semibold
                text-red-500
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              إلغاء
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-text-muted">
              إجمالي المنتجات
            </span>

            <span>
              {
                displayedSubtotal
              }{" "}
              ج.م
            </span>
          </div>

          {discountAmount >
            0 && (
            <div className="flex justify-between text-secondary">
              <span>
                الخصم
              </span>

              <span>
                -{" "}
                {
                  discountAmount
                }{" "}
                ج.م
              </span>
            </div>
          )}

          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="font-semibold">
                الإجمالي بعد الخصم
              </span>

              <span className="font-bold text-secondary">
                {
                  totalAfterDiscount
                }{" "}
                ج.م
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartStep;