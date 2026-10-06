import {
  useMemo,
  useState,
} from "react";

import {
  Search,
} from "lucide-react";

import CategoryCard from "../components/CategoryCard";

import CategoriesPageSkeleton from "../../../components/loaders/CategoriesPageSkeleton";

import {
  useCategories,
} from "../hooks/useCategories";

function CategoriesPage() {
  const [
    searchInput,
    setSearchInput,
  ] = useState("");

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

      if (
        !normalizedSearch
      ) {
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

  const handleSearch = (
    event,
  ) => {
    event.preventDefault();

    setSearchQuery(
      searchInput.trim(),
    );
  };

  if (isError) {
    return (
      <div
        className="
          mx-auto
          flex
          min-h-[60vh]
          w-full
          max-w-6xl
          items-center
          justify-center
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
    <div
      className="
        mx-auto
        w-full
        max-w-6xl
        px-5
        pt-5

        md:px-6
        md:pt-8

        lg:max-w-[1180px]
        lg:pt-10
      "
    >
      <section
        className="
          mb-6

          md:mb-8
        "
      >
        <div
          className="
            md:flex
            md:items-end
            md:justify-between
            md:gap-8
          "
        >
          <div
            className="
              md:shrink-0
            "
          >
            <h1
              className="
                mb-4
                text-2xl
                font-bold
                text-primary

                md:mb-1
                md:text-3xl

                lg:text-4xl
              "
            >
              الأقسام
            </h1>

            <p
              className="
                hidden
                text-sm
                text-text-muted

                md:block

                lg:text-base
              "
            >
              اختار القسم اللي محتاجه وابدأ التسوق.
            </p>
          </div>

          <form
            onSubmit={
              handleSearch
            }
            className="
              relative

              md:w-full
              md:max-w-md

              lg:max-w-lg
            "
          >
            <input
              type="search"
              value={
                searchInput
              }
              onChange={(
                event,
              ) =>
                setSearchInput(
                  event.target
                    .value,
                )
              }
              disabled={
                isPending
              }
              placeholder="دور على قسم..."
              aria-label="البحث عن قسم"
              className="
                w-full
                rounded-full
                border
                border-outline
                bg-white
                py-3
                pr-4
                pl-14
                text-base
                outline-none
                shadow-sm
                transition
                placeholder:text-gray-500
                focus:border-secondary
                focus:ring-1
                focus:ring-secondary
                disabled:cursor-wait
                disabled:opacity-70

                md:py-3.5
              "
            />

            <button
              type="submit"
              disabled={
                isPending
              }
              aria-label="بحث"
              className="
                absolute
                left-2
                top-1/2
                flex
                h-9
                w-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-secondary
                text-white
                transition
                hover:opacity-90
                active:scale-90
                disabled:cursor-not-allowed
                disabled:opacity-50

                md:h-10
                md:w-10
              "
            >
              <Search
                size={19}
              />
            </button>
          </form>
        </div>
      </section>

      {isPending ? (
        <CategoriesPageSkeleton />
      ) : categories.length >
        0 ? (
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
          {categories.map(
            (
              category,
              index,
            ) => (
              <CategoryCard
                key={
                  category.id
                }
                category={
                  category
                }
                index={
                  index
                }
              />
            ),
          )}
        </section>
      ) : (
        <div className="py-16 text-center">
          <p className="text-text-muted">
            {searchQuery
              ? "مفيش أقسام بالاسم ده"
              : "مفيش أقسام متاحة حاليًا"}
          </p>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;