import {
  ArrowRight,
  Heart,
} from 'lucide-react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { useFavorites } from '../../favorites/context/useFavorites'

function FavoritesPage() {
  const navigate = useNavigate()

  const {
    favorites,
    toggleFavorite,
  } = useFavorites()

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header
        className="
          sticky top-0 z-40
          flex h-16 items-center
          bg-white px-5
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="رجوع"
        >
          <ArrowRight size={25} />
        </button>

        <h1 className="flex-1 text-center text-xl font-bold text-primary">
          المفضلة
        </h1>

        <div className="w-6" />
      </header>

      <main className="mx-auto w-full max-w-md px-5 py-5">
        {favorites.length > 0 ? (
          <>
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-primary">
                منتجاتك المفضلة
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {favorites.length} منتج محفوظ
              </p>
            </div>

            <section className="grid grid-cols-2 gap-4">
              {favorites.map((product) => (
                <article
                  key={product.id}
                  className="
                    relative overflow-hidden
                    rounded-3xl bg-white p-3
                    shadow-[0_4px_20px_rgba(0,27,61,0.05)]
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleFavorite(product)
                    }
                    aria-label="إزالة من المفضلة"
                    className="
                      absolute left-3 top-3 z-10
                      flex h-9 w-9
                      items-center justify-center
                      rounded-full bg-white
                      text-red-500 shadow-sm
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
                        flex aspect-square
                        items-center justify-center
                        rounded-2xl bg-gray-50
                      "
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="
                          h-4/5 w-4/5
                          object-contain
                        "
                      />
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-primary">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {product.unit}
                    </p>

                    <p className="mt-3 text-lg font-bold text-secondary">
                      {product.price} ج.م
                    </p>
                  </Link>
                </article>
              ))}
            </section>
          </>
        ) : (
          <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">
            <div
              className="
                flex h-20 w-20
                items-center justify-center
                rounded-full bg-red-50
                text-red-400
              "
            >
              <Heart size={35} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-primary">
              المفضلة فاضية
            </h2>

            <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
              أي منتج يعجبك اضغط على القلب وهتلاقيه محفوظ هنا.
            </p>

            <button
              type="button"
              onClick={() => navigate('/categories')}
              className="
                mt-6 rounded-xl bg-secondary
                px-6 py-3 font-semibold
                text-white
              "
            >
              تصفح المنتجات
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default FavoritesPage