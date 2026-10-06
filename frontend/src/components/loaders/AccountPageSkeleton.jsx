import ContentLoader from "react-content-loader";

function AccountPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      <header
        className="
          sticky top-0 z-40
          flex h-16 items-center
          justify-center bg-white
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <h1 className="text-2xl font-bold text-secondary">
          حسابي
        </h1>
      </header>

      <main className="mx-auto w-full max-w-md px-5 py-5">
        {/* Profile */}
        <section
          className="
            rounded-3xl bg-white p-5
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          "
        >
          <ContentLoader
            speed={1.6}
            width="100%"
            height={105}
            viewBox="0 0 400 105"
            preserveAspectRatio="none"
            backgroundColor="#e5e9e3"
            foregroundColor="#f5f7f4"
            style={{
              width: "100%",
              height: "105px",
            }}
          >
            <circle
              cx="45"
              cy="50"
              r="40"
            />

            <rect
              x="105"
              y="10"
              rx="6"
              ry="6"
              width="170"
              height="20"
            />

            <rect
              x="105"
              y="48"
              rx="5"
              ry="5"
              width="125"
              height="11"
            />

            <rect
              x="105"
              y="76"
              rx="5"
              ry="5"
              width="240"
              height="11"
            />
          </ContentLoader>
        </section>

        {/* Menu */}
        <section
          className="
            mt-5 overflow-hidden
            rounded-3xl bg-white
            p-5
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          "
        >
          <ContentLoader
            speed={1.6}
            width="100%"
            height={245}
            viewBox="0 0 400 245"
            preserveAspectRatio="none"
            backgroundColor="#e5e9e3"
            foregroundColor="#f5f7f4"
            style={{
              width: "100%",
              height: "245px",
            }}
          >
            {[
              10,
              70,
              130,
              190,
            ].map((y) => (
              <g key={y}>
                <circle
                  cx="22"
                  cy={y + 18}
                  r="17"
                />

                <rect
                  x="55"
                  y={y + 10}
                  rx="5"
                  ry="5"
                  width="120"
                  height="15"
                />

                <rect
                  x="365"
                  y={y + 13}
                  rx="4"
                  ry="4"
                  width="20"
                  height="10"
                />
              </g>
            ))}

            <rect
              x="0"
              y="58"
              rx="1"
              ry="1"
              width="400"
              height="1"
            />

            <rect
              x="0"
              y="118"
              rx="1"
              ry="1"
              width="400"
              height="1"
            />

            <rect
              x="0"
              y="178"
              rx="1"
              ry="1"
              width="400"
              height="1"
            />
          </ContentLoader>
        </section>
      </main>
    </div>
  );
}

export default AccountPageSkeleton;