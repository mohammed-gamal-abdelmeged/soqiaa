import { ShoppingCart } from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import logo from "../../../assets/images/logo.png";

import { useCart } from "../../cart/context/useCart";

import { productsMock } from "../../products/data/products.mock";
import { categoriesMock } from "../../categories/data/categories.mock";

import HomeCategoryCard from "../components/HomeCategoryCard";
import HomeProductCard from "../components/HomeProductCard";
import HomeFooter from "../components/HomeFooter";

import BottomNav from "../../../components/layout/BottomNav";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAWOFK10rXUYspA9yQjw0Zjao0njo5DCEl2gtdPu0zMdHtaz2KqQcbI1emH2vPEuEfGeVNCbmRHCZyYoEKWcJ4OFLHnWLIdjAOxM5fkHrk3cleSgiElkptzyseEncby56L63lB8rArcLxmNRxtWyP-mCVsiiDMSh_lysgAgqdh8sGAaqJ2RydT5s3bKe1bO4LYMYixY14PRF6VyEzmnW5GnF4tbEs6VlARTuDYcAz41GhfHbNb3v7LF";

function HomePage() {
  const navigate = useNavigate();

  const { totalItems } = useCart();

  const offers = productsMock
    .filter(
      (product) =>
        product.isActive &&
        product.discountPercentage > 0,
    )
    .slice(0, 6);

  const bestSellers = productsMock
    .filter(
      (product) =>
        product.isActive &&
        product.isBestSeller,
    )
    .slice(0, 6);

  const activeCategories =
    categoriesMock.filter(
      (category) => category.isActive,
    );

  const scrollToSection = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <div
      className="
        flex min-h-screen flex-col
        bg-[#f7f9f6]
      "
    >
      {/* Header */}
      <header
        className="
          sticky top-0 z-50
          border-b border-gray-100
          bg-white/95 backdrop-blur
        "
      >
        <div
          className="
            mx-auto flex h-20
            w-full max-w-[1180px]
            items-center justify-center px-5
          "
        >
          <img
            src={logo}
            alt="سوقيا"
            className="h-16 w-16 object-contain"
          />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-3">
          <div
            className="
              mx-auto w-full
              max-w-[1180px] px-3
              sm:px-5
            "
          >
            <div
              className="
                relative min-h-[270px]
                overflow-hidden rounded-[28px]
                bg-primary
                shadow-[0_16px_50px_rgba(9,43,80,0.08)]
              "
            >
              <img
                src={HERO_IMAGE}
                alt="منتجات سوقيا"
                className="
                  absolute inset-0
                  h-full w-full object-cover
                "
              />

              <div
                className="
                  absolute inset-0
                  bg-gradient-to-l
                  from-[#082644]/95
                  via-[#082644]/75
                  to-[#082644]/15
                "
              />

              <div
                className="
                  relative z-10 flex
                  min-h-[270px] max-w-xl
                  flex-col justify-center
                  px-6 py-8 text-white
                  md:px-10
                "
              >
                <h1
                  className="
                    text-3xl font-extrabold
                    leading-tight md:text-5xl
                  "
                >
                  مشتريات البيت
                  <br />
                  بقت أسهل مع سوقيا
                </h1>

                <p
                  className="
                    mt-4 max-w-md text-sm
                    leading-7 text-white/80
                  "
                >
                  منتجات يومية، عروض واضحة وتجربة
                  شراء مرتبة وسريعة.
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      scrollToSection("offers")
                    }
                    className="
                      rounded-xl bg-secondary
                      px-5 py-3 text-sm
                      font-bold
                    "
                  >
                    شوف العروض
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      scrollToSection("categories")
                    }
                    className="
                      rounded-xl border
                      border-white/25 bg-white/10
                      px-5 py-3 text-sm
                      font-bold
                    "
                  >
                    تصفح الأقسام
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Cart */}

          </div>
        </section>

        {/* Categories */}
        <section
          id="categories"
          className="pt-10"
        >
          <div
            className="
              mx-auto w-full
              max-w-[1180px] px-5
            "
          >
            <SectionHeader
              kicker="اختار بسرعة"
              title="تسوق حسب القسم"
              link="/categories"
            />

            <div
              className="
                flex gap-3 overflow-x-auto
                pb-2 [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                md:grid
                md:grid-cols-6
                md:overflow-visible
              "
            >
              {activeCategories.map(
                (category) => (
                  <HomeCategoryCard
                    key={category.id}
                    category={category}
                  />
                ),
              )}
            </div>
          </div>
        </section>

        {/* Offers */}
        <section
          id="offers"
          className="pt-10"
        >
          <div
            className="
              mx-auto w-full
              max-w-[1180px] px-3
              sm:px-5
            "
          >
            <div
              className="
                rounded-[28px]
                border border-[#f0eadb]
                bg-[linear-gradient(135deg,#fff8eb_0%,#fffdf7_52%,#f3f9ef_100%)]
                py-6
              "
            >
              <div className="px-5">
                <SectionHeader
                  kicker="وفر أكتر"
                  title="عروض سوقيا"
                  link="/offers"
                />
              </div>

              <ProductRail
                products={offers}
                emptyText="مفيش عروض حاليًا."
              />
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="pt-10">
          <div
            className="
              mx-auto w-full
              max-w-[1180px] px-3
              sm:px-5
            "
          >
            <div
              className="
                rounded-[28px]
                border border-gray-100
                bg-white py-6
              "
            >
              <div className="px-5">
                <SectionHeader
                  kicker="اختيارات الناس"
                  title="الأكثر مبيعًا"
                  link="/best-sellers"
                />
              </div>

              <ProductRail
                products={bestSellers}
                emptyText="مفيش منتجات مصنفة كأكثر مبيعًا حاليًا."
              />
            </div>
          </div>
        </section>
      </main>

      {/* الفوتر في نهاية الصفحة الطبيعية */}
      <HomeFooter />

      <BottomNav />
    </div>
  );
}

function SectionHeader({
  kicker,
  title,
  link,
}) {
  return (
    <div
      className="
        mb-4 flex items-end
        justify-between gap-4
      "
    >
      <div>
        <span className="text-[10px] font-bold text-secondary">
          {kicker}
        </span>

        <h2 className="mt-1 text-xl font-bold text-primary md:text-2xl">
          {title}
        </h2>
      </div>

      <Link
        to={link}
        className="
          shrink-0 text-xs
          font-bold text-secondary
        "
      >
        عرض الكل
      </Link>
    </div>
  );
}

function ProductRail({
  products,
  emptyText,
}) {
  if (products.length === 0) {
    return (
      <div className="px-5 py-10 text-center text-sm text-gray-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div
      className="
        flex gap-3 overflow-x-auto
        px-5 pb-2
        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
        md:grid md:grid-cols-4
        md:overflow-visible
      "
    >
      {products.map((product) => (
        <HomeProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}

export default HomePage;