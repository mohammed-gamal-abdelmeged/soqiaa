import ContentLoader from "react-content-loader";

function ProductDetailsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-28">
      {/* Header */}
      <header
        className="
          fixed left-0 top-0 z-40
          flex h-16 w-full items-center
          justify-center bg-white px-5
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
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
            x="25"
            y="4"
            rx="6"
            ry="6"
            width="100"
            height="22"
          />
        </ContentLoader>
      </header>

      <main className="pt-16">
        {/* Product Image */}
        <section className="overflow-hidden rounded-b-3xl bg-white">
          <ContentLoader
            speed={1.6}
            width="100%"
            height={390}
            viewBox="0 0 400 390"
            preserveAspectRatio="none"
            backgroundColor="#e5e9e3"
            foregroundColor="#f5f7f4"
            style={{
              width: "100%",
              height: "390px",
            }}
          >
            <rect
              x="35"
              y="30"
              rx="28"
              ry="28"
              width="330"
              height="330"
            />
          </ContentLoader>
        </section>

        {/* Info */}
        <section className="px-5 py-6">
          <ContentLoader
            speed={1.6}
            width="100%"
            height={145}
            viewBox="0 0 400 145"
            preserveAspectRatio="none"
            backgroundColor="#e5e9e3"
            foregroundColor="#f5f7f4"
            style={{
              width: "100%",
              height: "145px",
            }}
          >
            <rect
              x="0"
              y="5"
              rx="6"
              ry="6"
              width="270"
              height="22"
            />

            <rect
              x="0"
              y="40"
              rx="5"
              ry="5"
              width="90"
              height="11"
            />

            <rect
              x="0"
              y="67"
              rx="5"
              ry="5"
              width="125"
              height="12"
            />

            <circle
              cx="375"
              cy="20"
              r="20"
            />

            <rect
              x="0"
              y="106"
              rx="6"
              ry="6"
              width="120"
              height="28"
            />

            <rect
              x="135"
              y="114"
              rx="5"
              ry="5"
              width="70"
              height="15"
            />
          </ContentLoader>
        </section>

        {/* Delivery */}
        <section className="mb-6 px-5">
          <div
            className="
              rounded-3xl
              border border-gray-100
              bg-white p-4
            "
          >
            <ContentLoader
              speed={1.6}
              width="100%"
              height={62}
              viewBox="0 0 400 62"
              preserveAspectRatio="none"
              backgroundColor="#e5e9e3"
              foregroundColor="#f5f7f4"
              style={{
                width: "100%",
                height: "62px",
              }}
            >
              <circle
                cx="28"
                cy="31"
                r="24"
              />

              <rect
                x="68"
                y="12"
                rx="5"
                ry="5"
                width="120"
                height="16"
              />

              <rect
                x="68"
                y="38"
                rx="5"
                ry="5"
                width="210"
                height="11"
              />
            </ContentLoader>
          </div>
        </section>

        {/* Description */}
        <section className="px-5 pb-6">
          <ContentLoader
            speed={1.6}
            width="100%"
            height={135}
            viewBox="0 0 400 135"
            preserveAspectRatio="none"
            backgroundColor="#e5e9e3"
            foregroundColor="#f5f7f4"
            style={{
              width: "100%",
              height: "135px",
            }}
          >
            <rect
              x="0"
              y="0"
              rx="6"
              ry="6"
              width="120"
              height="20"
            />

            <rect
              x="0"
              y="40"
              rx="5"
              ry="5"
              width="390"
              height="11"
            />

            <rect
              x="0"
              y="65"
              rx="5"
              ry="5"
              width="360"
              height="11"
            />

            <rect
              x="0"
              y="90"
              rx="5"
              ry="5"
              width="325"
              height="11"
            />

            <rect
              x="0"
              y="115"
              rx="5"
              ry="5"
              width="210"
              height="11"
            />
          </ContentLoader>
        </section>
      </main>

      {/* Bottom CTA */}
      <div
        className="
          fixed bottom-0 left-0 z-50
          w-full border-t
          border-gray-100 bg-white p-4
        "
      >
        <ContentLoader
          speed={1.6}
          width="100%"
          height={48}
          viewBox="0 0 400 48"
          preserveAspectRatio="none"
          backgroundColor="#e5e9e3"
          foregroundColor="#f5f7f4"
          style={{
            width: "100%",
            height: "48px",
          }}
        >
          <rect
            x="0"
            y="0"
            rx="12"
            ry="12"
            width="125"
            height="48"
          />

          <rect
            x="140"
            y="0"
            rx="12"
            ry="12"
            width="260"
            height="48"
          />
        </ContentLoader>
      </div>
    </div>
  );
}

export default ProductDetailsPageSkeleton;