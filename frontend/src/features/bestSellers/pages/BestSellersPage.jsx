import {
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useProducts,
} from "../../products/hooks/useProducts";

import HomeProductCard from "../../home/components/HomeProductCard";

import ProductGridSkeleton from "../../../components/loaders/ProductGridSkeleton";

function BestSellersPage() {
  const navigate =
    useNavigate();

  const {
    data: allProducts = [],
    isPending,
    isError,
    error,
  } = useProducts();

  const products =
    allProducts.filter(
      (product) =>
        product.isBestSeller,
    );

  if (isError) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#f7f9f6]
          px-5
        "
      >
        <div className="text-center">
          <p className="font-semibold text-primary">
            تعذر تحميل المنتجات
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {error?.message ||
              "حاول مرة أخرى"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9f6]">
      <header
        className="
          sticky
          top-0
          z-40
          bg-white
          shadow-sm
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
            onClick={() =>
              navigate(-1)
            }
            aria-label="رجوع"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              transition
              active:scale-90
            "
          >
            <ArrowRight
              size={25}
            />
          </button>

          <h1
            className="
              flex-1
              text-center
              text-xl
              font-bold
              text-primary

              md:text-2xl

              lg:text-3xl
            "
          >
            الأكثر مبيعًا
          </h1>

          <div className="w-10" />
        </div>
      </header>

      <main
        className="
          mx-auto
          w-full
          max-w-[1180px]
          px-5
          py-6

          md:px-6
          md:py-8

          lg:py-10
        "
      >
        <section
          className="
            mb-6
            flex
            items-center
            gap-4
            rounded-3xl
            bg-green-50
            p-5

            md:mb-8
            md:gap-6
            md:rounded-[30px]
            md:p-7

            lg:mb-10
            lg:p-8
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
              rounded-2xl
              bg-white
              text-secondary

              md:h-16
              md:w-16
              md:rounded-[20px]

              lg:h-[72px]
              lg:w-[72px]
            "
          >
            <TrendingUp
              size={25}
              className="
                md:h-8
                md:w-8
              "
            />
          </div>

          <div>
            <h2
              className="
                text-xl
                font-bold
                text-primary

                md:text-2xl

                lg:text-3xl
              "
            >
              اختيارات عملاء سوقيا
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500

                md:mt-2
                md:text-base
              "
            >
              المنتجات الأكثر طلبًا على سوقيا.
            </p>
          </div>
        </section>

        {isPending ? (
          <ProductGridSkeleton
            count={8}
          />
        ) : products.length > 0 ? (
          <section
            className="
              grid
              grid-cols-2
              gap-4

              md:grid-cols-3
              md:gap-5

              lg:grid-cols-4
              lg:gap-6
            "
          >
            {products.map(
              (product) => (
                <HomeProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                />
              ),
            )}
          </section>
        ) : (
          <div
            className="
              py-20
              text-center
              text-gray-500

              md:py-28
            "
          >
            مفيش منتجات هنا حاليًا.
          </div>
        )}
      </main>
    </div>
  );
}

export default BestSellersPage;