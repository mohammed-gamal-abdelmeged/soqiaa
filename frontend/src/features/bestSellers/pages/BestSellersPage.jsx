import {
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { productsMock } from "../../products/data/products.mock";
import HomeProductCard from "../../home/components/HomeProductCard";

function BestSellersPage() {
  const navigate = useNavigate();

  const products = productsMock.filter(
    (product) =>
      product.isActive &&
      product.isBestSeller,
  );

  return (
    <div className="min-h-screen bg-[#f7f9f6]">
      <header
        className="
          sticky top-0 z-40
          flex h-16 items-center
          bg-white px-5 shadow-sm
        "
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
        >
          <ArrowRight size={25} />
        </button>

        <h1 className="flex-1 text-center text-xl font-bold text-primary">
          الأكثر مبيعًا
        </h1>

        <div className="w-6" />
      </header>

      <main
        className="
          mx-auto w-full max-w-[1180px]
          px-5 py-6
        "
      >
        <section
          className="
            mb-6 flex items-center
            gap-4 rounded-3xl
            bg-green-50 p-5
          "
        >
          <div
            className="
              flex h-12 w-12 items-center
              justify-center rounded-2xl
              bg-white text-secondary
            "
          >
            <TrendingUp size={25} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">
              اختيارات عملاء سوقيا
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              المنتجات الأكثر طلبًا على سوقيا.
            </p>
          </div>
        </section>

        {products.length > 0 ? (
          <section
            className="
              grid grid-cols-2 gap-4
              md:grid-cols-3 lg:grid-cols-4
            "
          >
            {products.map((product) => (
              <HomeProductCard
                key={product.id}
                product={product}
              />
            ))}
          </section>
        ) : (
          <div className="py-20 text-center text-gray-500">
            مفيش منتجات هنا حاليًا.
          </div>
        )}
      </main>
    </div>
  );
}

export default BestSellersPage;