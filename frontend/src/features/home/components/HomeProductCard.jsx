import {
  Plus,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useCart,
} from "../../cart/context/useCart";

function HomeProductCard({
  product,
}) {
  const {
    addToCart,
  } = useCart();

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

  return (
    <article
      className="
        relative
        w-[165px]
        shrink-0
        overflow-hidden
        rounded-[20px]
        border
        border-gray-100
        bg-white
        p-2.5
        shadow-[0_5px_18px_rgba(9,43,80,0.035)]
        transition
        hover:-translate-y-1
        hover:shadow-[0_12px_28px_rgba(9,43,80,0.07)]

        md:w-full
        md:rounded-[24px]
        md:p-3

        lg:rounded-[26px]
        lg:p-4
      "
    >
      <Link
        to={`/products/${product.id}`}
      >
        <div
          className="
            relative
            flex
            h-32
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            bg-[#f6f8f6]
            p-4

            md:h-40
            md:rounded-[20px]
            md:p-5

            lg:h-44
            lg:p-6
          "
        >
          {hasDiscount && (
            <span
              className="
                absolute
                right-2
                top-2
                z-10
                rounded-full
                bg-red-50
                px-2
                py-1
                text-[10px]
                font-bold
                text-red-500

                md:right-3
                md:top-3
                md:text-xs
              "
            >
              -
              {
                product.discountPercentage
              }
              %
            </span>
          )}

          <img
            src={
              product.image
            }
            alt={
              product.name
            }
            loading="lazy"
            className="
              h-full
              w-full
              object-contain
            "
          />
        </div>

        <div
          className="
            px-1
            pt-3

            md:pt-4
          "
        >
          <p
            className="
              text-[10px]
              font-bold
              text-secondary

              md:text-xs
            "
          >
            {product.categoryName ||
              "سوقيا"}
          </p>

          <h3
            className="
              mt-1
              line-clamp-2
              min-h-10
              text-xs
              font-bold
              leading-5
              text-[#23384b]

              md:min-h-12
              md:text-sm
              md:leading-6

              lg:text-base
            "
          >
            {product.name}
          </h3>
        </div>
      </Link>

      <div
        className="
          mt-3
          flex
          items-end
          justify-between
          px-1

          md:mt-4
        "
      >
        <div>
          <div className="flex items-baseline gap-1">
            <strong
              className="
                text-lg
                text-primary

                md:text-xl

                lg:text-2xl
              "
            >
              {finalPrice}
            </strong>

            <span
              className="
                text-[10px]
                font-bold

                md:text-xs
              "
            >
              ج.م
            </span>
          </div>

          {hasDiscount && (
            <span
              className="
                text-[10px]
                text-gray-400
                line-through

                md:text-xs
              "
            >
              {product.price} ج.م
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            addToCart(
              product,
            )
          }
          aria-label={`إضافة ${product.name} للسلة`}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-secondary
            text-white
            shadow-[0_7px_17px_rgba(74,165,28,0.14)]
            transition
            active:scale-90

            md:h-10
            md:w-10
            md:rounded-[14px]

            lg:h-11
            lg:w-11
          "
        >
          <Plus
            size={20}
          />
        </button>
      </div>
    </article>
  );
}

export default HomeProductCard;