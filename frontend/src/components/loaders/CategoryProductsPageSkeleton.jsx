import ContentLoader from "react-content-loader";

import ProductGridSkeleton from "./ProductGridSkeleton";

function CategoryProductsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-8">
      {/* Header */}
      <header
        className="
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
            max-w-md
            items-center
            justify-center
            px-5

            md:h-20
            md:max-w-5xl
            md:px-6

            lg:max-w-[1180px]
          "
        >
          <ContentLoader
            speed={1.6}
            width={150}
            height={30}
            viewBox="0 0 150 30"
            backgroundColor="#e5e9e3"
            foregroundColor="#f5f7f4"
          >
            <rect
              x="15"
              y="5"
              rx="6"
              ry="6"
              width="120"
              height="20"
            />
          </ContentLoader>
        </div>
      </header>

      <main
        className="
          mx-auto
          w-full
          max-w-md

          md:max-w-5xl
          md:px-6

          lg:max-w-[1180px]
        "
      >
        {/* Banner */}
        <section
          className="
            px-5
            pt-4

            md:px-0
            md:pt-6

            lg:pt-8
          "
        >
          <ContentLoader
            speed={1.6}
            width="100%"
            height={128}
            viewBox="0 0 400 128"
            preserveAspectRatio="none"
            backgroundColor="#e5e9e3"
            foregroundColor="#f5f7f4"
            className="
              h-32

              md:h-52

              lg:h-64
            "
            style={{
              width: "100%",
            }}
          >
            <rect
              x="0"
              y="0"
              rx="24"
              ry="24"
              width="400"
              height="128"
            />
          </ContentLoader>
        </section>

        {/* Subcategories */}
        <section
          className="
            mt-6

            md:mt-8
          "
        >
          <div
            className="
              flex
              gap-3
              overflow-hidden
              px-5

              md:flex-wrap
              md:px-0
            "
          >
            {Array.from({
              length: 5,
            }).map(
              (
                _,
                index,
              ) => (
                <ContentLoader
                  key={
                    index
                  }
                  speed={1.6}
                  width={85}
                  height={38}
                  viewBox="0 0 85 38"
                  backgroundColor="#e5e9e3"
                  foregroundColor="#f5f7f4"
                  style={{
                    flexShrink: 0,
                  }}
                >
                  <rect
                    x="0"
                    y="0"
                    rx="19"
                    ry="19"
                    width="85"
                    height="38"
                  />
                </ContentLoader>
              ),
            )}
          </div>
        </section>

        {/* Count + Filter */}
        <section
          className="
            mt-5
            flex
            items-center
            justify-between
            px-5

            md:mt-8
            md:px-0
          "
        >
          <ContentLoader
            speed={1.6}
            width={70}
            height={20}
            viewBox="0 0 70 20"
            backgroundColor="#e5e9e3"
            foregroundColor="#f5f7f4"
          >
            <rect
              x="0"
              y="4"
              rx="4"
              ry="4"
              width="60"
              height="10"
            />
          </ContentLoader>

          <ContentLoader
            speed={1.6}
            width={115}
            height={40}
            viewBox="0 0 115 40"
            backgroundColor="#e5e9e3"
            foregroundColor="#f5f7f4"
          >
            <rect
              x="0"
              y="0"
              rx="10"
              ry="10"
              width="115"
              height="40"
            />
          </ContentLoader>
        </section>

        <ProductGridSkeleton
          count={8}
          className="
            mt-4
            grid
            grid-cols-2
            gap-4
            px-5

            md:mt-6
            md:grid-cols-3
            md:gap-5
            md:px-0

            lg:grid-cols-4
            lg:gap-6
          "
        />
      </main>
    </div>
  );
}

export default CategoryProductsPageSkeleton;