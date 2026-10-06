import ContentLoader from "react-content-loader";

function OrderDetailsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-8">
      <header
        className="
          sticky top-0 z-50
          flex h-16 items-center
          justify-center bg-white px-5
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <ContentLoader
          speed={1.6}
          width={150}
          height={28}
          viewBox="0 0 150 28"
          backgroundColor="#e5e9e3"
          foregroundColor="#f5f7f4"
        >
          <rect
            x="15"
            y="4"
            rx="6"
            ry="6"
            width="120"
            height="20"
          />
        </ContentLoader>
      </header>

      <main
        className="
          mx-auto flex w-full
          max-w-md flex-col
          gap-5 px-5 py-5
        "
      >
        <SkeletonCard height={90}>
          <rect
            x="0"
            y="5"
            rx="6"
            ry="6"
            width="145"
            height="18"
          />

          <rect
            x="0"
            y="38"
            rx="5"
            ry="5"
            width="120"
            height="10"
          />

          <rect
            x="270"
            y="4"
            rx="14"
            ry="14"
            width="110"
            height="28"
          />
        </SkeletonCard>

        <SkeletonCard height={255}>
          <rect
            x="0"
            y="0"
            rx="6"
            ry="6"
            width="100"
            height="18"
          />

          <circle
            cx="18"
            cy="62"
            r="15"
          />

          <rect
            x="50"
            y="54"
            rx="5"
            ry="5"
            width="125"
            height="13"
          />

          <circle
            cx="18"
            cy="110"
            r="15"
          />

          <rect
            x="50"
            y="102"
            rx="5"
            ry="5"
            width="145"
            height="13"
          />

          <circle
            cx="18"
            cy="158"
            r="15"
          />

          <rect
            x="50"
            y="150"
            rx="5"
            ry="5"
            width="160"
            height="13"
          />

          <circle
            cx="18"
            cy="206"
            r="15"
          />

          <rect
            x="50"
            y="198"
            rx="5"
            ry="5"
            width="120"
            height="13"
          />

          <rect
            x="16"
            y="70"
            rx="1"
            ry="1"
            width="4"
            height="125"
          />
        </SkeletonCard>

        <SkeletonCard height={95}>
          <circle
            cx="25"
            cy="35"
            r="20"
          />

          <rect
            x="60"
            y="14"
            rx="5"
            ry="5"
            width="100"
            height="10"
          />

          <rect
            x="60"
            y="38"
            rx="5"
            ry="5"
            width="260"
            height="13"
          />

          <rect
            x="60"
            y="64"
            rx="5"
            ry="5"
            width="130"
            height="10"
          />
        </SkeletonCard>

        <SkeletonCard height={255}>
          <rect
            x="0"
            y="0"
            rx="6"
            ry="6"
            width="115"
            height="18"
          />

          {[
            45,
            115,
            185,
          ].map((y) => (
            <g key={y}>
              <rect
                x="0"
                y={y}
                rx="12"
                ry="12"
                width="58"
                height="58"
              />

              <rect
                x="75"
                y={y + 5}
                rx="5"
                ry="5"
                width="160"
                height="12"
              />

              <rect
                x="75"
                y={y + 27}
                rx="5"
                ry="5"
                width="75"
                height="9"
              />

              <rect
                x="300"
                y={y + 18}
                rx="5"
                ry="5"
                width="75"
                height="13"
              />
            </g>
          ))}
        </SkeletonCard>

        <SkeletonCard height={175}>
          <rect
            x="0"
            y="5"
            rx="5"
            ry="5"
            width="100"
            height="11"
          />

          <rect
            x="310"
            y="5"
            rx="5"
            ry="5"
            width="70"
            height="11"
          />

          <rect
            x="0"
            y="45"
            rx="5"
            ry="5"
            width="70"
            height="11"
          />

          <rect
            x="310"
            y="45"
            rx="5"
            ry="5"
            width="70"
            height="11"
          />

          <rect
            x="0"
            y="100"
            rx="6"
            ry="6"
            width="80"
            height="18"
          />

          <rect
            x="290"
            y="100"
            rx="6"
            ry="6"
            width="90"
            height="18"
          />
        </SkeletonCard>
      </main>
    </div>
  );
}

function SkeletonCard({
  children,
  height,
}) {
  return (
    <section
      className="
        rounded-3xl
        border border-gray-100
        bg-white p-5
        shadow-[0_4px_20px_rgba(0,27,61,0.05)]
      "
    >
      <ContentLoader
        speed={1.6}
        width="100%"
        height={height}
        viewBox={`0 0 400 ${height}`}
        preserveAspectRatio="none"
        backgroundColor="#e5e9e3"
        foregroundColor="#f5f7f4"
        style={{
          width: "100%",
          height: `${height}px`,
        }}
      >
        {children}
      </ContentLoader>
    </section>
  );
}

export default OrderDetailsPageSkeleton;