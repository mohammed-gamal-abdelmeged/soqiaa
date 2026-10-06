import ContentLoader from "react-content-loader";

function HomePageSkeleton() {
  return (
    <div className="pb-10">
      {/* Categories Skeleton */}
      <section
        className="
          pt-10

          md:pt-14

          lg:pt-16
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1180px]
            px-5

            lg:px-6
          "
        >
          <SectionTitleSkeleton />

          <div
            className="
              flex
              gap-3
              overflow-hidden

              md:grid
              md:grid-cols-4
              md:gap-5

              lg:grid-cols-6
              lg:gap-6
            "
          >
            {Array.from({
              length: 6,
            }).map(
              (
                _,
                index,
              ) => (
                <CategorySkeleton
                  key={
                    index
                  }
                />
              ),
            )}
          </div>
        </div>
      </section>

      {/* Offers Skeleton */}
      <section
        className="
          pt-10

          md:pt-14

          lg:pt-16
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1180px]
            px-3
            sm:px-5

            lg:px-6
          "
        >
          <div
            className="
              rounded-[28px]
              border
              border-gray-100
              bg-white/70
              py-6

              md:rounded-[32px]
              md:py-8

              lg:py-10
            "
          >
            <div
              className="
                px-5

                md:px-7

                lg:px-8
              "
            >
              <SectionTitleSkeleton />
            </div>

            <ProductRowSkeleton />
          </div>
        </div>
      </section>

      {/* Best Sellers Skeleton */}
      <section
        className="
          pt-10

          md:pt-14

          lg:pt-16
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1180px]
            px-3
            sm:px-5

            lg:px-6
          "
        >
          <div
            className="
              rounded-[28px]
              border
              border-gray-100
              bg-white
              py-6

              md:rounded-[32px]
              md:py-8

              lg:py-10
            "
          >
            <div
              className="
                px-5

                md:px-7

                lg:px-8
              "
            >
              <SectionTitleSkeleton />
            </div>

            <ProductRowSkeleton />
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionTitleSkeleton() {
  return (
    <div
      className="
        mb-4
        flex
        items-end
        justify-between
        gap-4

        md:mb-6
      "
    >
      <ContentLoader
        speed={1.6}
        width={180}
        height={50}
        viewBox="0 0 180 50"
        backgroundColor="#e5e9e3"
        foregroundColor="#f5f7f4"
      >
        <rect
          x="0"
          y="4"
          rx="4"
          ry="4"
          width="60"
          height="8"
        />

        <rect
          x="0"
          y="22"
          rx="6"
          ry="6"
          width="150"
          height="20"
        />
      </ContentLoader>

      <ContentLoader
        speed={1.6}
        width={55}
        height={18}
        viewBox="0 0 55 18"
        backgroundColor="#e5e9e3"
        foregroundColor="#f5f7f4"
      >
        <rect
          x="0"
          y="4"
          rx="4"
          ry="4"
          width="55"
          height="10"
        />
      </ContentLoader>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div
      className="
        w-[110px]
        shrink-0

        md:w-full
      "
    >
      <ContentLoader
        speed={1.6}
        width="100%"
        height={118}
        viewBox="0 0 110 118"
        preserveAspectRatio="none"
        backgroundColor="#e5e9e3"
        foregroundColor="#f5f7f4"
        style={{
          width: "100%",
          height: "118px",
        }}
      >
        <rect
          x="10"
          y="0"
          rx="22"
          ry="22"
          width="90"
          height="82"
        />

        <rect
          x="20"
          y="94"
          rx="5"
          ry="5"
          width="70"
          height="12"
        />
      </ContentLoader>
    </div>
  );
}

function ProductRowSkeleton() {
  return (
    <div
      className="
        flex
        gap-3
        overflow-hidden
        px-5
        pb-2

        md:grid
        md:grid-cols-3
        md:gap-5
        md:px-7

        lg:grid-cols-4
        lg:gap-6
        lg:px-8
      "
    >
      {Array.from({
        length: 4,
      }).map(
        (
          _,
          index,
        ) => (
          <ProductCardSkeleton
            key={
              index
            }
          />
        ),
      )}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div
      className="
        w-[165px]
        shrink-0
        overflow-hidden
        rounded-3xl
        border
        border-gray-100
        bg-white
        p-3

        md:w-full
        md:p-3

        lg:p-4
      "
    >
      <ContentLoader
        speed={1.6}
        width="100%"
        height={245}
        viewBox="0 0 165 245"
        preserveAspectRatio="none"
        backgroundColor="#e5e9e3"
        foregroundColor="#f5f7f4"
        style={{
          width: "100%",
          height: "245px",
        }}
      >
        <rect
          x="0"
          y="0"
          rx="18"
          ry="18"
          width="165"
          height="145"
        />

        <rect
          x="4"
          y="161"
          rx="5"
          ry="5"
          width="135"
          height="13"
        />

        <rect
          x="4"
          y="181"
          rx="5"
          ry="5"
          width="85"
          height="10"
        />

        <rect
          x="4"
          y="211"
          rx="6"
          ry="6"
          width="70"
          height="17"
        />

        <rect
          x="119"
          y="204"
          rx="12"
          ry="12"
          width="38"
          height="38"
        />
      </ContentLoader>
    </div>
  );
}

export default HomePageSkeleton;