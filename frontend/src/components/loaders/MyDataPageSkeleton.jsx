import ContentLoader from "react-content-loader";

function MyDataPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header
        className="
          sticky top-0 z-40
          flex h-16 items-center
          justify-center bg-white px-5
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <h1 className="text-xl font-bold text-primary">
          بياناتي
        </h1>
      </header>

      <main className="mx-auto w-full max-w-md px-5 py-5">
        {/* Hero */}
        <section
          className="
            overflow-hidden rounded-3xl
            bg-primary p-6
            shadow-[0_10px_30px_rgba(0,27,61,0.12)]
          "
        >
          <ContentLoader
            speed={1.6}
            width="100%"
            height={175}
            viewBox="0 0 400 175"
            preserveAspectRatio="none"
            backgroundColor="#163555"
            foregroundColor="#294766"
            style={{
              width: "100%",
              height: "175px",
            }}
          >
            <circle
              cx="34"
              cy="34"
              r="32"
            />

            <rect
              x="85"
              y="10"
              rx="5"
              ry="5"
              width="70"
              height="10"
            />

            <rect
              x="85"
              y="35"
              rx="6"
              ry="6"
              width="165"
              height="21"
            />

            <rect
              x="0"
              y="92"
              rx="16"
              ry="16"
              width="400"
              height="83"
            />

            <rect
              x="20"
              y="112"
              rx="5"
              ry="5"
              width="170"
              height="10"
            />

            <rect
              x="20"
              y="140"
              rx="6"
              ry="6"
              width="45"
              height="24"
            />

            <circle
              cx="350"
              cy="133"
              r="20"
            />
          </ContentLoader>
        </section>

        {/* Account Data */}
        <section
          className="
            mt-5 rounded-3xl
            bg-white p-5
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          "
        >
          <ContentLoader
            speed={1.6}
            width="100%"
            height={240}
            viewBox="0 0 400 240"
            preserveAspectRatio="none"
            backgroundColor="#e5e9e3"
            foregroundColor="#f5f7f4"
            style={{
              width: "100%",
              height: "240px",
            }}
          >
            <rect
              x="0"
              y="0"
              rx="6"
              ry="6"
              width="130"
              height="18"
            />

            <rect
              x="325"
              y="0"
              rx="10"
              ry="10"
              width="70"
              height="34"
            />

            {[
              62,
              125,
              188,
            ].map((y) => (
              <g key={y}>
                <circle
                  cx="20"
                  cy={y + 18}
                  r="18"
                />

                <rect
                  x="55"
                  y={y + 3}
                  rx="4"
                  ry="4"
                  width="65"
                  height="9"
                />

                <rect
                  x="55"
                  y={y + 24}
                  rx="5"
                  ry="5"
                  width="210"
                  height="13"
                />
              </g>
            ))}
          </ContentLoader>
        </section>
      </main>
    </div>
  );
}

export default MyDataPageSkeleton;