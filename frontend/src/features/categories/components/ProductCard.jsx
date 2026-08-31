import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../cart/context/useCart";
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const hasDiscount = product.discountPercentage > 0;

  const finalPrice = hasDiscount
    ? Math.round(
        product.price - product.price * (product.discountPercentage / 100),
      )
    : product.price;

  return (
    <article
      className="
        relative flex flex-col overflow-hidden
        rounded-3xl bg-white p-3
        shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        transition active:scale-[0.98]
      "
    >
      {hasDiscount && (
        <span
          className="
            absolute right-2 top-2 z-10
            rounded-full bg-secondary px-2 py-1
            text-xs font-semibold text-white
          "
        >
          خصم {product.discountPercentage}%
        </span>
      )}

      {!hasDiscount && product.badge && (
        <span
          className="
            absolute right-2 top-2 z-10
            rounded-full bg-secondary px-2 py-1
            text-xs font-semibold text-white
          "
        >
          {product.badge}
        </span>
      )}

      <Link to={`/products/${product.id}`}>
        <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-[#f3f4f5]">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-4/5 w-4/5 object-contain"
          />
        </div>

        <h3 className="line-clamp-2 text-sm font-medium leading-6 text-text-main">
          {product.name}
        </h3>
      </Link>

      <span className="mt-1 text-xs text-gray-500">{product.unit}</span>

      <div className="mt-auto flex items-end justify-between pt-3">
        <div>
          <div className="text-xl font-semibold text-black">
            {finalPrice}
            <span className="mr-1 text-sm font-normal">ج.م</span>
          </div>

          {hasDiscount && (
            <div className="mt-1 text-xs text-gray-400 line-through">
              {product.price} ج.م
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          aria-label={`إضافة ${product.name} للسلة`}
          className="
    flex h-10 w-10 items-center justify-center
    rounded-full bg-secondary text-white
    shadow-md transition active:scale-90
  "
        >
          <Plus size={24} />
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
