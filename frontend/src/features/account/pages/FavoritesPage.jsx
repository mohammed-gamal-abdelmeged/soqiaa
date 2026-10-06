import {
  ArrowRight,
  Heart,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import FavoritesPageSkeleton from "../../../components/loaders/FavoritesPageSkeleton";

import {
  useFavorites,
} from "../../favorites/context/useFavorites";

function FavoritesPage() {
  const navigate =
    useNavigate();

  const {
    favorites,
    toggleFavorite,
    isFavoritesLoading,
    isFavoritesError,
    favoritesError,
    isFavoritesUpdating,
  } = useFavorites();

  if (
    isFavoritesLoading
  ) {
    return (
      <FavoritesPageSkeleton />
    );
  }

  if (
    isFavoritesError
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
            تعذر تحميل المفضلة
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {favoritesError?.message ||
              "حاول مرة أخرى"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header
        className="
          sticky
          top-0
          z-40
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
            المفضلة
          </h1>

          <div className="w-10" />
        </div>
      </header>

      <main
        className="
          mx-auto
          w-full
          max-w-md
          px-5
          py-5

          md:max-w-5xl
          md:px-6
          md:py-8

          lg:max-w-[1180px]
          lg:py-10
        "
      >
        {favorites.length >
        0 ? (
          <>
            <div
              className="
                mb-5

                md:mb-7
              "
            >
              <h2
                className="
                  text-2xl
                  font-bold
                  text-primary

                  md:text-3xl
                "
              >
                منتجاتك المفضلة
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
                {
                  favorites.length
                }{" "}
                منتج محفوظ
              </p>
            </div>

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
              {favorites.map(
                (product) => (
                  <article
                    key={
                      product.id
                    }
                    className="
                      relative
                      overflow-hidden
                      rounded-3xl
                      bg-white
                      p-3
                      shadow-[0_4px_20px_rgba(0,27,61,0.05)]
                      transition
                      hover:-translate-y-1
                      hover:shadow-[0_12px_30px_rgba(0,27,61,0.08)]

                      md:p-4

                      lg:rounded-[28px]
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleFavorite(
                          product,
                        )
                      }
                      disabled={
                        isFavoritesUpdating
                      }
                      aria-label="إزالة من المفضلة"
                      className="
                        absolute
                        left-3
                        top-3
                        z-10
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-red-500
                        shadow-sm
                        transition
                        active:scale-90
                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        md:left-4
                        md:top-4
                        md:h-10
                        md:w-10
                      "
                    >
                      <Heart
                        size={18}
                        fill="currentColor"
                      />
                    </button>

                    <Link
                      to={`/products/${product.id}`}
                    >
                      <div
                        className="
                          flex
                          aspect-square
                          items-center
                          justify-center
                          rounded-2xl
                          bg-gray-50

                          md:rounded-[22px]
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
                            h-4/5
                            w-4/5
                            object-contain
                          "
                        />
                      </div>

                      <h3
                        className="
                          mt-3
                          line-clamp-2
                          text-sm
                          font-semibold
                          text-primary

                          md:mt-4
                          md:min-h-12
                          md:text-base
                          md:leading-6
                        "
                      >
                        {
                          product.name
                        }
                      </h3>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-500

                          md:text-sm
                        "
                      >
                        {
                          product.unit
                        }
                      </p>

                      <p
                        className="
                          mt-3
                          text-lg
                          font-bold
                          text-secondary

                          md:mt-4
                          md:text-xl

                          lg:text-2xl
                        "
                      >
                        {
                          product.price
                        }{" "}
                        ج.م
                      </p>
                    </Link>
                  </article>
                ),
              )}
            </section>
          </>
        ) : (
          <div
            className="
              flex
              min-h-[65vh]
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            <div
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-red-50
                text-red-400

                md:h-24
                md:w-24
              "
            >
              <Heart
                size={35}
              />
            </div>

            <h2
              className="
                mt-5
                text-xl
                font-bold
                text-primary

                md:text-2xl
              "
            >
              المفضلة فاضية
            </h2>

            <p
              className="
                mt-2
                max-w-xs
                text-sm
                leading-6
                text-gray-500

                md:max-w-md
                md:text-base
                md:leading-7
              "
            >
              أي منتج يعجبك اضغط على القلب وهتلاقيه محفوظ هنا.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/categories",
                )
              }
              className="
                mt-6
                rounded-xl
                bg-secondary
                px-6
                py-3
                font-semibold
                text-white

                md:px-8
                md:py-3.5
              "
            >
              تصفح المنتجات
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default FavoritesPage;