import { useMemo, useState } from "react";
import {
  ArrowRight,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import { categoryDetailsMock } from "../data/categoryDetails.mock";
import BottomNav from "../../../components/layout/BottomNav";
import Modal from "../../../components/ui/Modal";

import { useCart } from "../../cart/context/useCart";

function CategoryProductsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { totalItems } = useCart();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  const category = categoryDetailsMock[slug];

  const [activeSubcategory, setActiveSubcategory] = useState("all");

  const products = useMemo(() => {
    if (!category) return [];

    let filteredProducts =
      activeSubcategory === "all"
        ? [...category.products]
        : category.products.filter(
            (product) => product.subcategoryId === activeSubcategory,
          );

    const getFinalPrice = (product) => {
      if (!product.discountPercentage) {
        return product.price;
      }

      return (
        product.price -
        product.price * (product.discountPercentage / 100)
      );
    };

    if (sortBy === "price-low") {
      filteredProducts.sort(
        (a, b) => getFinalPrice(a) - getFinalPrice(b),
      );
    }

    if (sortBy === "price-high") {
      filteredProducts.sort(
        (a, b) => getFinalPrice(b) - getFinalPrice(a),
      );
    }

    return filteredProducts;
  }, [category, activeSubcategory, sortBy]);

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <p className="text-text-muted">
          القسم غير موجود
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-8">
      {/* Header */}
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
          className="
            flex h-10 w-10 items-center justify-center
            text-secondary transition
            active:scale-90
          "
        >
          <ArrowRight size={27} />
        </button>

        <h1 className="flex-1 text-center text-2xl font-bold">
          {category.name}
        </h1>

        {/* Cart */}
        <button
          type="button"
          onClick={() => navigate("/cart")}
          aria-label={`السلة - ${totalItems} منتج`}
          className="
            relative flex h-10 w-10
            items-center justify-center
            text-gray-600 transition
            active:scale-90
          "
        >
          <ShoppingCart size={25} />

          {totalItems > 0 && (
            <span
              className="
                absolute -left-1 -top-1
                flex h-5 min-w-5 items-center justify-center
                rounded-full bg-secondary
                px-1 text-[11px] font-bold
                leading-none text-white
              "
            >
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </button>
      </header>

      <main className="mx-auto w-full max-w-md">
        {/* Banner */}
        <section className="px-5 pt-4">
          <div className="relative h-32 overflow-hidden rounded-3xl">
            <img
              src={category.banner.image}
              alt={category.banner.title}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-l from-[#001b3d]/85 via-[#001b3d]/40 to-transparent" />

            <div className="absolute inset-0 flex items-center p-6">
              <div className="text-white">
                <h2 className="text-xl font-semibold">
                  {category.banner.title}
                </h2>

                <p className="mt-1 text-sm opacity-90">
                  {category.banner.subtitle}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Subcategories */}
        <section className="mt-6 overflow-x-auto">
          <div className="flex min-w-max gap-3 px-5 pb-2">
            <button
              type="button"
              onClick={() => setActiveSubcategory("all")}
              className={`
                rounded-full border px-5 py-2 text-sm
                transition active:scale-95
                ${
                  activeSubcategory === "all"
                    ? "border-primary bg-primary text-white"
                    : "border-outline bg-white text-text-main"
                }
              `}
            >
              الكل
            </button>

            {category.subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                type="button"
                onClick={() =>
                  setActiveSubcategory(subcategory.id)
                }
                className={`
                  rounded-full border px-5 py-2 text-sm
                  transition active:scale-95
                  ${
                    activeSubcategory === subcategory.id
                      ? "border-primary bg-primary text-white"
                      : "border-outline bg-white text-text-main"
                  }
                `}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        </section>

        {/* Count + Filter */}
        <section className="mt-4 flex items-center justify-between px-5">
          <span className="text-sm text-gray-500">
            {products.length} منتج
          </span>

          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="
              flex items-center gap-2 rounded-lg
              border border-outline bg-white
              px-3 py-2 text-sm
              text-primary
              transition active:scale-95
            "
          >
            <SlidersHorizontal size={18} />
            تصفية وترتيب
          </button>
        </section>

        {/* Products */}
        {products.length > 0 ? (
          <section className="mt-4 grid grid-cols-2 gap-4 px-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </section>
        ) : (
          <div className="px-5 py-16 text-center text-text-muted">
            لا توجد منتجات في القسم ده حاليًا
          </div>
        )}

        <BottomNav />
      </main>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="تصفية وترتيب"
        maxWidth="max-w-sm"
      >
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setSortBy("default");
              setIsFilterOpen(false);
            }}
            className={`
              w-full rounded-xl border
              px-4 py-3 text-right
              transition
              ${
                sortBy === "default"
                  ? "border-secondary bg-green-50 text-secondary"
                  : "border-outline bg-white"
              }
            `}
          >
            الترتيب الافتراضي
          </button>

          <button
            type="button"
            onClick={() => {
              setSortBy("price-low");
              setIsFilterOpen(false);
            }}
            className={`
              w-full rounded-xl border
              px-4 py-3 text-right
              transition
              ${
                sortBy === "price-low"
                  ? "border-secondary bg-green-50 text-secondary"
                  : "border-outline bg-white"
              }
            `}
          >
            السعر: من الأقل للأعلى
          </button>

          <button
            type="button"
            onClick={() => {
              setSortBy("price-high");
              setIsFilterOpen(false);
            }}
            className={`
              w-full rounded-xl border
              px-4 py-3 text-right
              transition
              ${
                sortBy === "price-high"
                  ? "border-secondary bg-green-50 text-secondary"
                  : "border-outline bg-white"
              }
            `}
          >
            السعر: من الأعلى للأقل
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default CategoryProductsPage;