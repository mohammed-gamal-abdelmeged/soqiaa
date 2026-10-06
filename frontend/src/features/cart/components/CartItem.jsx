import {
  useState,
} from "react";

import {
  AlertTriangle,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import {
  useCart,
} from "../context/useCart";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

function CartItem({
  item,
}) {
  const [
    isDeleteOpen,
    setIsDeleteOpen,
  ] = useState(false);

  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getFinalPrice,
  } = useCart();

  const price =
    getFinalPrice(
      item,
    );

  const isUnavailable =
    item.isAvailable ===
    false;

  const handleDelete =
    async () => {
      await removeFromCart(
        item.id,
      );

      setIsDeleteOpen(
        false,
      );
    };

  return (
    <>
      <div
        className={[
          `
            relative
            flex
            gap-4
            rounded-2xl
            bg-white
            p-4
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]

            md:gap-5
            md:rounded-[24px]
            md:p-5
          `,

          isUnavailable
            ? `
                border
                border-red-300
                bg-red-50/40
                shadow-[0_4px_20px_rgba(220,38,38,0.08)]
              `
            : "",
        ].join(
          " ",
        )}
      >
        {/* Product Image */}
        <div
          className={`
            relative
            h-20
            w-20
            shrink-0
            overflow-hidden
            rounded-xl
            bg-gray-100

            md:h-28
            md:w-28
            md:rounded-2xl
          `}
        >
          <img
            src={
              item.image
            }
            alt={
              item.name
            }
            className={[
              `
                h-full
                w-full
                object-contain
                p-2

                md:p-3
              `,

              isUnavailable
                ? "opacity-40 grayscale"
                : "",
            ].join(
              " ",
            )}
          />

          {isUnavailable && (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-red-50/30
              "
            >
              <AlertTriangle
                size={24}
                className="text-red-500"
              />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex justify-between gap-3">
            <div className="min-w-0">
              <h3
                className={[
                  `
                    line-clamp-2
                    font-semibold

                    md:text-lg
                    md:leading-7
                  `,

                  isUnavailable
                    ? "text-red-700"
                    : "text-primary",
                ].join(
                  " ",
                )}
              >
                {
                  item.name
                }
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500

                  md:text-base
                "
              >
                {
                  item.unit
                }
              </p>

              {isUnavailable ? (
                <div
                  className="
                    mt-2
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-red-100
                    px-2.5
                    py-1
                    text-xs
                    font-bold
                    text-red-700
                  "
                >
                  <AlertTriangle
                    size={13}
                  />

                  غير متوفر حاليًا
                </div>
              ) : (
                <p
                  className="
                    hidden
                    text-sm
                    text-gray-400

                    md:mt-2
                    md:block
                  "
                >
                  سعر الوحدة:{" "}
                  {price} ج.م
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setIsDeleteOpen(
                  true,
                )
              }
              aria-label="حذف المنتج"
              className={`
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-red-500
                transition
                hover:bg-red-100
                hover:text-red-600
                active:scale-90

                md:h-10
                md:w-10

                ${
                  isUnavailable
                    ? "bg-red-100"
                    : ""
                }
              `}
            >
              <Trash2
                size={19}
              />
            </button>
          </div>

          <div
            className="
              mt-auto
              flex
              items-end
              justify-between
              pt-3

              md:pt-4
            "
          >
            {isUnavailable ? (
              <button
                type="button"
                onClick={() =>
                  setIsDeleteOpen(
                    true,
                  )
                }
                className="
                  rounded-xl
                  bg-red-600
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-700
                  active:scale-[0.98]
                "
              >
                حذف من السلة
              </button>
            ) : (
              <span
                className="
                  font-semibold
                  text-secondary

                  md:text-xl
                  md:font-bold
                "
              >
                {price *
                  item.quantity}{" "}
                ج.م
              </span>
            )}

            <div
              className={[
                `
                  flex
                  items-center
                  rounded-full
                  bg-gray-100
                  p-1

                  md:p-1.5
                `,

                isUnavailable
                  ? "opacity-40"
                  : "",
              ].join(
                " ",
              )}
            >
              <button
                type="button"
                onClick={() =>
                  decreaseQuantity(
                    item.id,
                  )
                }
                disabled={
                  isUnavailable ||
                  item.quantity ===
                    1
                }
                aria-label="تقليل الكمية"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  transition
                  active:scale-90
                  disabled:cursor-not-allowed
                  disabled:opacity-35
                  disabled:active:scale-100

                  md:h-9
                  md:w-9
                "
              >
                <Minus
                  size={16}
                />
              </button>

              <span
                className="
                  w-8
                  text-center
                  font-semibold

                  md:w-10
                  md:text-lg
                "
              >
                {
                  item.quantity
                }
              </span>

              <button
                type="button"
                onClick={() =>
                  increaseQuantity(
                    item.id,
                  )
                }
                disabled={
                  isUnavailable
                }
                aria-label="زيادة الكمية"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  transition
                  active:scale-90
                  disabled:cursor-not-allowed
                  disabled:opacity-35
                  disabled:active:scale-100

                  md:h-9
                  md:w-9
                "
              >
                <Plus
                  size={16}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={
          isDeleteOpen
        }
        title="حذف المنتج"
        message={
          isUnavailable
            ? `"${item.name}" غير متوفر حاليًا. هل تريد حذفه من السلة؟`
            : `هل تريد حذف "${item.name}" من السلة؟`
        }
        confirmText="حذف"
        cancelText="إلغاء"
        onConfirm={
          handleDelete
        }
        onCancel={() =>
          setIsDeleteOpen(
            false,
          )
        }
      />
    </>
  );
}

export default CartItem;