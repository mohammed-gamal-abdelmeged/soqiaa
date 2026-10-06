import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
} from "lucide-react";

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
    getFinalPrice,
  } = useCart();

  const {
    mutateAsync: previewOrder,
    isPending,
  } = usePreviewOrder();

  const unavailableItems =
    useMemo(() => {
      return items.filter(
        (item) =>
          item.isAvailable ===
          false,
      );
    }, [items]);

  const hasUnavailableItems =
    unavailableItems.length >
    0;

  const availableSubtotal =
    useMemo(() => {
      return items.reduce(
        (
          total,
          item,
        ) => {
          if (
            item.isAvailable ===
            false
          ) {
            return total;
          }

          return (
            total +
            getFinalPrice(
              item,
            ) *
              item.quantity
          );
        },
        0,
      );
    }, [
      items,
      getFinalPrice,
    ]);

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
            `${item.id}:${item.quantity}:${item.isAvailable}`,
        )
        .join("|");
    }, [items]);

  /*
  |--------------------------------------------------------------------------
  | Clear Coupon If Cart Contains Unavailable Product
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !hasUnavailableItems ||
      !appliedCoupon
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
    hasUnavailableItems,
    appliedCoupon,
    setAppliedCoupon,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Restore Coupon Preview
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !appliedCoupon ||
      couponPreview ||
      hasUnavailableItems
    ) {
      return;
    }

    let cancelled =
      false;

    const loadPreview =
      async () => {
        try {
          const preview =
            await previewOrder({
              couponCode:
                appliedCoupon,
            });

          if (
            cancelled
          ) {
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
          if (
            cancelled
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
        }
      };

    loadPreview();

    return () => {
      cancelled =
        true;
    };
  }, [
    appliedCoupon,
    cartSignature,
    couponPreview,
    hasUnavailableItems,
    previewOrder,
    setAppliedCoupon,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Remove Coupon When Cart Changes
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Empty Cart
  |--------------------------------------------------------------------------
  */

  if (
    items.length === 0
  ) {
    return (
      <div
        className="
          py-20
          text-center

          md:py-28
        "
      >
        <h2
          className="
            text-xl
            font-bold
            text-primary

            md:text-2xl
          "
        >
          السلة فاضية
        </h2>

        <p
          className="
            mt-2
            text-text-muted

            md:text-base
          "
        >
          ضيف منتجات الأول عشان تكمل الطلب
        </p>
      </div>
    );
  }

  const displayedSubtotal =
    couponPreview
      ?.subtotal ??
    availableSubtotal;

  const discountAmount =
    couponPreview
      ?.discountAmount ??
    0;

  const totalAfterDiscount =
    displayedSubtotal -
    discountAmount;

  /*
  |--------------------------------------------------------------------------
  | Apply Coupon
  |--------------------------------------------------------------------------
  */

  const handleApplyCoupon =
    async () => {
      if (
        hasUnavailableItems
      ) {
        showError(
          "احذف المنتجات غير المتاحة من السلة الأول",
        );

        return;
      }

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

      if (
        appliedCoupon
      ) {
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

  /*
  |--------------------------------------------------------------------------
  | Remove Coupon
  |--------------------------------------------------------------------------
  */

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
    <div
      className="
        space-y-4

        md:grid
        md:grid-cols-[minmax(0,1.4fr)_minmax(280px,.6fr)]
        md:items-start
        md:gap-6
        md:space-y-0
      "
    >
      {/* Products */}
      <div
        className="
          space-y-4

          md:min-w-0
        "
      >
        <div
          className="
            flex
            items-end
            justify-between
          "
        >
          <h2
            className="
              text-xl
              font-bold
              text-primary

              md:text-2xl
            "
          >
            منتجات السلة
          </h2>

          <span
            className="
              hidden
              text-sm
              text-gray-500

              md:block
            "
          >
            {items.length} منتج
          </span>
        </div>

        {hasUnavailableItems && (
          <div
            className="
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-4
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-red-100
                text-red-600
              "
            >
              <AlertTriangle
                size={18}
              />
            </div>

            <div>
              <p className="font-bold text-red-700">
                فيه{" "}
                {
                  unavailableItems.length
                }{" "}
                منتج غير متوفر
              </p>

              <p className="mt-1 text-sm leading-6 text-red-600">
                المنتجات المعلّمة بالأحمر لم تعد متاحة. احذفها من السلة عشان تقدر تكمل الطلب.
              </p>
            </div>
          </div>
        )}

        {items.map(
          (item) => (
            <CartItem
              key={
                item.id
              }
              item={
                item
              }
            />
          ),
        )}
      </div>

      {/* Summary Side */}
      <aside
        className="
          space-y-4

          md:sticky
          md:top-28
        "
      >
        {/* Coupon */}
        <div
          className="
            rounded-2xl
            bg-white
            p-4
            shadow-sm

            md:rounded-[24px]
            md:p-5
            md:shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          "
        >
          <h3
            className="
              mb-3
              font-semibold
              text-primary

              md:text-lg
            "
          >
            عندك كود خصم؟
          </h3>

          {!appliedCoupon ? (
            <>
              <div
                className="
                  flex
                  gap-2

                  md:flex-col
                "
              >
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
                    isPending ||
                    hasUnavailableItems
                  }
                  placeholder="اكتب الكود هنا"
                  className="
                    min-w-0
                    flex-1
                    rounded-xl
                    border
                    border-outline
                    bg-white
                    px-3
                    py-3
                    outline-none
                    focus:border-secondary
                    focus:ring-1
                    focus:ring-secondary
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:opacity-60
                  "
                />

                <button
                  type="button"
                  onClick={
                    handleApplyCoupon
                  }
                  disabled={
                    isPending ||
                    hasUnavailableItems
                  }
                  className="
                    min-w-[88px]
                    rounded-xl
                    bg-primary
                    px-5
                    font-semibold
                    text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    md:min-h-12
                    md:w-full
                  "
                >
                  {isPending
                    ? "جاري..."
                    : "تطبيق"}
                </button>
              </div>

              {hasUnavailableItems && (
                <p className="mt-2 text-xs leading-5 text-red-500">
                  احذف المنتجات غير المتاحة قبل استخدام كود الخصم.
                </p>
              )}
            </>
          ) : (
            <div
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-green-200
                bg-green-50
                px-4
                py-3
              "
            >
              <div>
                <p className="font-semibold text-secondary">
                  {
                    appliedCoupon
                  }
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
                  text-sm
                  font-semibold
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

        {/* Summary */}
        <div
          className="
            rounded-2xl
            bg-white
            p-4
            shadow-sm

            md:rounded-[24px]
            md:p-5
            md:shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          "
        >
          <h3
            className="
              hidden
              font-bold
              text-primary

              md:mb-5
              md:block
              md:text-lg
            "
          >
            ملخص الطلب
          </h3>

          <div
            className="
              space-y-3

              md:space-y-4
            "
          >
            <div className="flex justify-between">
              <span className="text-text-muted">
                إجمالي المنتجات المتاحة
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

            <div
              className="
                border-t
                pt-3

                md:pt-4
              "
            >
              <div className="flex justify-between">
                <span
                  className="
                    font-semibold

                    md:text-base
                  "
                >
                  الإجمالي بعد الخصم
                </span>

                <span
                  className="
                    font-bold
                    text-secondary

                    md:text-xl
                  "
                >
                  {
                    totalAfterDiscount
                  }{" "}
                  ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default CartStep;