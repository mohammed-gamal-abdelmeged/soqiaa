import { useMemo, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";

import { productsMock } from "../data/products.mock";
import { showSuccess } from "../../../lib/toast";
import { useCart } from "../../cart/context/useCart";
import { useFavorites } from "../../favorites/context/useFavorites";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const {
    toggleFavorite,
    isFavorite,
  } = useFavorites();

  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => {
    return productsMock.find(
      (item) => String(item.id) === String(id),
    );
  }, [id]);

  if (!product || !product.isActive) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <p className="text-text-muted">
          المنتج غير موجود
        </p>
      </div>
    );
  }

  const productIsFavorite = isFavorite(product.id);

  const hasDiscount =
    product.discountPercentage > 0;

  const finalPrice = hasDiscount
    ? Math.round(
        product.price -
          product.price *
            (product.discountPercentage / 100),
      )
    : product.price;

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);

   
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.name,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // المستخدم قفل نافذة المشاركة
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(
        window.location.href,
      );

      showSuccess("تم نسخ رابط المنتج");
    } catch {
      // لو المتصفح منع clipboard
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-28">
      {/* Header */}
      <header
        className="
          fixed left-0 top-0 z-40
          flex h-16 w-full items-center
          bg-white px-5
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="رجوع"
          className="
            flex h-10 w-10 items-center
            justify-center text-secondary
            transition active:scale-90
          "
        >
          <ArrowRight size={27} />
        </button>

        <div className="flex-1 text-center text-3xl font-bold">
          Souqia
        </div>

        <button
          type="button"
          onClick={handleShare}
          aria-label="مشاركة المنتج"
          className="
            flex h-10 w-10 items-center
            justify-center text-secondary
            transition active:scale-90
          "
        >
          <Share2 size={24} />
        </button>
      </header>

      <main className="pt-16">
        {/* Product Image */}
        <section className="overflow-hidden rounded-b-3xl bg-white">
          <div className="relative aspect-square w-full">
            <img
              src={product.image}
              alt={product.name}
              className="
                h-full w-full bg-white
                object-contain p-8
              "
            />

            {product.badge && (
              <div
                className="
                  absolute right-4 top-4
                  rounded-full bg-amber-400
                  px-3 py-1 text-sm
                  font-medium text-black
                  shadow-sm
                "
              >
                {product.badge}
              </div>
            )}
          </div>
        </section>

        {/* Product Info */}
        <section className="px-5 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold leading-9 text-primary">
                {product.name}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {product.unit}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star
                    size={19}
                    fill="currentColor"
                  />

                  <span className="text-sm font-semibold text-text-main">
                    {product.rating}
                  </span>
                </div>

                <span className="text-sm text-gray-500">
                  ({product.reviewsCount} تقييم)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                toggleFavorite(product)
              }
              aria-label={
                productIsFavorite
                  ? "إزالة من المفضلة"
                  : "إضافة للمفضلة"
              }
              className={`
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-full bg-gray-100
                transition active:scale-90
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

          {/* Price */}
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-bold text-secondary">
              {finalPrice} ج.م
            </span>

            {hasDiscount && (
              <>
                <span className="mb-1 text-lg text-gray-400 line-through">
                  {product.price} ج.م
                </span>

                <span
                  className="
                    mb-1 rounded-md bg-red-100
                    px-2 py-1 text-sm
                    font-bold text-red-700
                  "
                >
                  -{product.discountPercentage}%
                </span>
              </>
            )}
          </div>
        </section>

        {/* Delivery */}
        <section className="mb-6 px-5">
          <div
            className="
              flex items-center gap-4
              rounded-3xl border
              border-gray-100 bg-white p-4
              shadow-[0_4px_20px_rgba(0,27,61,0.05)]
            "
          >
            <div
              className="
                flex h-12 w-12 items-center
                justify-center rounded-full
                bg-green-50 text-secondary
              "
            >
              <Truck size={24} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary">
                توصيل سريع
              </h3>

              <p className="text-sm text-text-muted">
                {product.deliveryText}
              </p>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="px-5 pb-6">
          <h2 className="mb-2 text-xl font-semibold text-primary">
            وصف المنتج
          </h2>

          <p className="leading-8 text-text-muted">
            {product.description}
          </p>
        </section>
      </main>

      {/* Bottom CTA */}
      <div
        className="
          fixed bottom-0 left-0 z-50
          flex w-full items-center gap-4
          rounded-t-2xl border-t
          border-gray-100 bg-white p-4
          shadow-[0_-10px_30px_rgba(0,27,61,0.12)]
        "
      >
        {/* Quantity */}
        <div
          className="
            flex h-12 items-center
            rounded-xl border
            border-outline bg-gray-50 p-1
          "
        >
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity === 1}
            aria-label="تقليل الكمية"
            className="
              flex h-full w-10 items-center
              justify-center rounded-lg
              transition hover:bg-gray-200
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Minus size={19} />
          </button>

          <span className="w-8 text-center text-lg font-semibold">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
            aria-label="زيادة الكمية"
            className="
              flex h-full w-10 items-center
              justify-center rounded-lg
              transition hover:bg-gray-200
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Plus size={19} />
          </button>
        </div>

        {/* Add To Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="
            flex h-12 flex-1 items-center
            justify-center gap-2
            rounded-xl bg-secondary
            text-lg font-semibold
            text-white transition
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <ShoppingCart size={21} />

          {product.stock > 0
            ? "ضيف للسلة"
            : "غير متوفر"}
        </button>
      </div>
    </div>
  );
}

export default ProductDetailsPage;