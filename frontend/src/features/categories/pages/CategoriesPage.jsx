import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import CategoryCard from "../components/CategoryCard";

import {
  useCategories,
} from "../hooks/useCategories";

function CategoriesPage() {
  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const {
    data: categoriesData = [],
    isPending,
    isError,
    error,
  } = useCategories();

  const categories =
    useMemo(() => {
      const normalizedSearch =
        searchQuery
          .trim()
          .toLowerCase();

      if (!normalizedSearch) {
        return categoriesData;
      }

      return categoriesData.filter(
        (category) =>
          category.name
            .toLowerCase()
            .includes(
              normalizedSearch,
            ),
      );
    }, [
      categoriesData,
      searchQuery,
    ]);

  if (isPending) {
    return (
      <div
        className="
          flex min-h-[60vh]
          items-center justify-center
        "
      >
        <span
          className="
            h-8 w-8 animate-spin
            rounded-full border-2
            border-gray-200
            border-t-secondary
          "
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="
          mx-auto flex min-h-[60vh]
          w-full max-w-6xl
          items-center justify-center
          px-5
        "
      >
        <div className="text-center">
          <p className="font-semibold text-primary">
            تعذر تحميل الأقسام
          </p>

          <p className="mt-2 text-sm text-text-muted">
            {error?.message ||
              "حاول مرة أخرى"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-5">
      <section className="mb-6">
        <h1 className="mb-4 text-2xl font-bold text-primary">
          الأقسام
        </h1>

        <div className="relative">
          <Search
            size={25}
            className="
              pointer-events-none absolute
              right-4 top-1/2
              -translate-y-1/2
              text-gray-500
            "
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value,
              )
            }
            placeholder="دور على قسم..."
            aria-label="البحث عن قسم"
            className="
              w-full rounded-full
              border border-outline
              bg-white py-3 pr-12 pl-4
              text-base outline-none
              shadow-sm transition
              placeholder:text-gray-500
              focus:border-secondary
              focus:ring-1
              focus:ring-secondary
            "
          />
        </div>
      </section>

      {categories.length > 0 ? (
        <section
          className="
            grid grid-cols-2 gap-4
            md:grid-cols-4
          "
        >
          {categories.map(
            (category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ),
          )}
        </section>
      ) : (
        <div className="py-16 text-center">
          <p className="text-text-muted">
            {searchQuery.trim()
              ? "مفيش أقسام بالاسم ده"
              : "مفيش أقسام متاحة حاليًا"}
          </p>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;