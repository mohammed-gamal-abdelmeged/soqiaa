import { useState } from "react";

import {
  ArrowRight,
  Heart,
  Share2,
  Star,
  Truck,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  showSuccess,
} from "../../../lib/toast";

import {
  useCart,
} from "../../cart/context/useCart";

import {
  useFavorites,
} from "../../favorites/context/useFavorites";

import {
  useProduct,
} from "../hooks/useProducts";

import ProductDetailsPageSkeleton from "../../../components/loaders/ProductDetailsPageSkeleton";

function ProductDetailsPage() {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    addToCart,
  } = useCart();

  const {
    toggleFavorite,
    isFavorite,
  } = useFavorites();

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const {
    data: product,
    isPending,
    isError,
    error,
  } = useProduct(id);

  if (isPending) {
    return (
      <ProductDetailsPageSkeleton />
    );
  }

  if (
    isError ||
    !product ||
    !product.isActive
  ) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#f8f9fa]
          px-5
        "
      >
        <div className="text-center">
          <p className="font-semibold text-primary">
            المنتج غير موجود
          </p>

          {isError && (
            <p className="mt-2 text-sm text-text-muted">
              {error?.message ||
                "تعذر تحميل المنتج"}
            </p>
          )}
        </div>
      </div>
    );
  }

  const productIsFavorite =
    isFavorite(
      product.id,
    );

  const hasDiscount =
    product.discountPercentage >
    0;

  const finalPrice =
    hasDiscount
      ? Math.round(
          product.price -
            product.price *
              (
                product.discountPercentage /
                100
              ),
        )
      : product.price;

  const increaseQuantity =
    () => {
      if (
        quantity <
        product.stock
      ) {
        setQuantity(
          (current) =>
            current + 1,
        );
      }
    };

  const decreaseQuantity =
    () => {
      if (
        quantity >
        1
      ) {
        setQuantity(
          (current) =>
            current - 1,
        );
      }
    };

  const handleAddToCart =
    () => {
      addToCart(
        product,
        quantity,
      );
    };

  const handleBack =
    () => {
      if (
        location.state
          ?.openedFromSharedLink
      ) {
        navigate(
          "/",
          {
            replace: true,
          },
        );

        return;
      }

      navigate(-1);
    };

  const handleShare =
    async () => {
      const shareData = {
        title:
          product.name,

        text:
          product.name,

        url:
          window.location.href,
      };

      if (
        navigator.share
      ) {
        try {
          await navigator.share(
            shareData,
          );
        } catch {
          // المستخدم قفل نافذة المشاركة
        }

        return;
      }

      try {
        await navigator.clipboard.writeText(
          window.location.href,
        );

        showSuccess(
          "تم نسخ رابط المنتج",
        );
      } catch {
        // لو المتصفح منع clipboard
      }
    };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-28 md:pb-12">
      {/* Header */}
      <header
        className="
          fixed
          left-0
          top-0
          z-40
          w-full
          bg-white
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            w-full
            items-center
            px-5

            md:h-20
            md:max-w-5xl
            md:px-6

            lg:max-w-[1180px]
          "
        >
          <button
            type="button"
            onClick={
              handleBack
            }
            aria-label="رجوع"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              text-secondary
              transition
              active:scale-90
            "
          >
            <ArrowRight
              size={27}
            />
          </button>

          <div
            className="
              flex-1
              text-center
              text-3xl
              font-bold

              md:text-2xl
            "
          >
            Souqia
          </div>

          <button
            type="button"
            onClick={
              handleShare
            }
            aria-label="مشاركة المنتج"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              text-secondary
              transition
              active:scale-90
            "
          >
            <Share2
              size={24}
            />
          </button>
        </div>
      </header>

      <main
        className="
          pt-16

          md:mx-auto
          md:max-w-5xl
          md:px-6
          md:pt-28

          lg:max-w-[1180px]
          lg:pt-32
        "
      >
        <div
          className="
            md:grid
            md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
            md:items-start
            md:gap-8

            lg:gap-12
          "
        >
          {/* Product Image */}
          <section
            className="
              overflow-hidden
              rounded-b-3xl
              bg-white

              md:sticky
              md:top-28
              md:rounded-[30px]
              md:border
              md:border-gray-100
              md:shadow-[0_8px_30px_rgba(0,27,61,0.05)]
            "
          >
            <div
              className="
                relative
                aspect-square
                w-full
              "
            >
              <img
                src={
                  product.image
                }
                alt={
                  product.name
                }
                className="
                  h-full
                  w-full
                  bg-white
                  object-contain
                  p-8

                  md:p-10

                  lg:p-12
                "
              />

              {product.badge && (
                <div
                  className="
                    absolute
                    right-4
                    top-4
                    rounded-full
                    bg-amber-400
                    px-3
                    py-1
                    text-sm
                    font-medium
                    text-black
                    shadow-sm

                    md:right-5
                    md:top-5
                  "
                >
                  {
                    product.badge
                  }
                </div>
              )}
            </div>
          </section>

          <div>
            {/* Product Info */}
            <section
              className="
                px-5
                py-6

                md:rounded-[30px]
                md:border
                md:border-gray-100
                md:bg-white
                md:px-7
                md:py-7
                md:shadow-[0_8px_30px_rgba(0,27,61,0.04)]

                lg:px-8
                lg:py-8
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1
                    className="
                      text-2xl
                      font-bold
                      leading-9
                      text-primary

                      md:text-3xl
                      md:leading-10

                      lg:text-4xl
                      lg:leading-[1.35]
                    "
                  >
                    {
                      product.name
                    }
                  </h1>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-500

                      md:mt-2
                      md:text-base
                    "
                  >
                    {
                      product.unit
                    }
                  </p>

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      gap-2

                      md:mt-4
                    "
                  >
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star
                        size={19}
                        fill="currentColor"
                      />

                      <span className="text-sm font-semibold text-text-main">
                        {
                          product.rating
                        }
                      </span>
                    </div>

                    <span className="text-sm text-gray-500">
                      (
                      {
                        product.reviewsCount
                      }{" "}
                      تقييم)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    toggleFavorite(
                      product,
                    )
                  }
                  aria-label={
                    productIsFavorite
                      ? "إزالة من المفضلة"
                      : "إضافة للمفضلة"
                  }
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-100
                    transition
                    active:scale-90

                    md:h-12
                    md:w-12

                    ${
                      productIsFavorite
                        ? "text-red-500"
                        : "text-gray-500"
                    }
                  `}
                >
                  <Heart
                    size={21}
                    fill={
                      productIsFavorite
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-end
                  gap-3

                  md:mt-7
                "
              >
                <span
                  className="
                    text-3xl
                    font-bold
                    text-secondary

                    md:text-4xl
                  "
                >
                  {finalPrice} ج.م
                </span>

                {hasDiscount && (
                  <>
                    <span className="mb-1 text-lg text-gray-400 line-through">
                      {
                        product.price
                      }{" "}
                      ج.م
                    </span>

                    <span
                      className="
                        mb-1
                        rounded-md
                        bg-red-100
                        px-2
                        py-1
                        text-sm
                        font-bold
                        text-red-700
                      "
                    >
                      -
                      {
                        product.discountPercentage
                      }
                      %
                    </span>
                  </>
                )}
              </div>

              <div
                className="
                  hidden

                  md:mt-8
                  md:flex
                  md:items-center
                  md:gap-4
                "
              >
                <QuantityControl
                  quantity={
                    quantity
                  }
                  stock={
                    product.stock
                  }
                  increaseQuantity={
                    increaseQuantity
                  }
                  decreaseQuantity={
                    decreaseQuantity
                  }
                />

                <AddToCartButton
                  product={
                    product
                  }
                  handleAddToCart={
                    handleAddToCart
                  }
                />
              </div>
            </section>

            {/* Delivery */}
            <section
              className="
                mb-6
                px-5

                md:mb-0
                md:mt-5
                md:px-0
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-4
                  rounded-3xl
                  border
                  border-gray-100
                  bg-white
                  p-4
                  shadow-[0_4px_20px_rgba(0,27,61,0.05)]

                  md:p-5
                "
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-green-50
                    text-secondary

                    md:h-14
                    md:w-14
                  "
                >
                  <Truck
                    size={24}
                  />
                </div>

                <div>
                  <h3
                    className="
                      text-lg
                      font-semibold
                      text-primary

                      md:text-xl
                    "
                  >
                    توصيل سريع
                  </h3>

                  <p
                    className="
                      text-sm
                      text-text-muted

                      md:mt-1
                      md:text-base
                    "
                  >
                    {
                      product.deliveryText
                    }
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Description */}
        <section
          className="
            px-5
            pb-6

            md:mt-8
            md:rounded-[30px]
            md:border
            md:border-gray-100
            md:bg-white
            md:px-8
            md:py-8

            lg:mt-10
          "
        >
          <h2
            className="
              mb-2
              text-xl
              font-semibold
              text-primary

              md:mb-4
              md:text-2xl
            "
          >
            وصف المنتج
          </h2>

          <p
            className="
              leading-8
              text-text-muted

              md:max-w-4xl
              md:text-base
              md:leading-9
            "
          >
            {
              product.description
            }
          </p>
        </section>
      </main>

      {/* Mobile Bottom CTA */}
      <div
        className="
          fixed
          bottom-0
          left-0
          z-50
          flex
          w-full
          items-center
          gap-4
          rounded-t-2xl
          border-t
          border-gray-100
          bg-white
          p-4
          shadow-[0_-10px_30px_rgba(0,27,61,0.12)]

          md:hidden
        "
      >
        <QuantityControl
          quantity={
            quantity
          }
          stock={
            product.stock
          }
          increaseQuantity={
            increaseQuantity
          }
          decreaseQuantity={
            decreaseQuantity
          }
        />

        <AddToCartButton
          product={
            product
          }
          handleAddToCart={
            handleAddToCart
          }
        />
      </div>
    </div>
  );
}

function QuantityControl({
  quantity,
  stock,
  increaseQuantity,
  decreaseQuantity,
}) {
  return (
    <div
      className="
        flex
        h-12
        items-center
        rounded-xl
        border
        border-outline
        bg-gray-50
        p-1

        md:h-14
      "
    >
      <button
        type="button"
        onClick={
          decreaseQuantity
        }
        disabled={
          quantity === 1
        }
        aria-label="تقليل الكمية"
        className="
          flex
          h-full
          w-10
          items-center
          justify-center
          rounded-lg
          transition
          hover:bg-gray-200
          disabled:cursor-not-allowed
          disabled:opacity-40

          md:w-11
        "
      >
        <Minus
          size={19}
        />
      </button>

      <span
        className="
          w-8
          text-center
          text-lg
          font-semibold

          md:w-10
          md:text-xl
        "
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={
          increaseQuantity
        }
        disabled={
          quantity >=
          stock
        }
        aria-label="زيادة الكمية"
        className="
          flex
          h-full
          w-10
          items-center
          justify-center
          rounded-lg
          transition
          hover:bg-gray-200
          disabled:cursor-not-allowed
          disabled:opacity-40

          md:w-11
        "
      >
        <Plus
          size={19}
        />
      </button>
    </div>
  );
}

function AddToCartButton({
  product,
  handleAddToCart,
}) {
  return (
    <button
      type="button"
      onClick={
        handleAddToCart
      }
      disabled={
        product.stock <= 0
      }
      className="
        flex
        h-12
        flex-1
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-secondary
        text-lg
        font-semibold
        text-white
        transition
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-50

        md:h-14
        md:text-base

        lg:text-lg
      "
    >
      <ShoppingCart
        size={21}
      />

      {product.stock > 0
        ? "ضيف للسلة"
        : "غير متوفر"}
    </button>
  );
}

export default ProductDetailsPage;