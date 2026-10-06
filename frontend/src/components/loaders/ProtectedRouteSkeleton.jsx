import ContentLoader from "react-content-loader";

function ProtectedRouteSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header
        className="
          h-20
          border-b
          border-gray-100
          bg-white
        "
      >
        <div
          className="
            mx-auto
            flex
            h-full
            w-full
            max-w-[1180px]
            items-center
            justify-center
            px-5
          "
        >
          <ContentLoader
            speed={1.6}
            width={64}
            height={64}
            viewBox="0 0 64 64"
            backgroundColor="#e5e9e3"
            foregroundColor="#f5f7f4"
          >
            <rect
              x="4"
              y="4"
              rx="16"
              ry="16"
              width="56"
              height="56"
            />
          </ContentLoader>
        </div>
      </header>

      <main
        className="
          mx-auto
          w-full
          max-w-md
          px-5
          py-5
        "
      >
        <ContentLoader
          speed={1.6}
          width="100%"
          height={420}
          viewBox="0 0 400 420"
          preserveAspectRatio="none"
          backgroundColor="#e5e9e3"
          foregroundColor="#f5f7f4"
          style={{
            width: "100%",
            height: "420px",
          }}
        >
          <rect
            x="0"
            y="0"
            rx="7"
            ry="7"
            width="165"
            height="25"
          />

          <rect
            x="0"
            y="42"
            rx="5"
            ry="5"
            width="220"
            height="11"
          />

          <rect
            x="0"
            y="85"
            rx="24"
            ry="24"
            width="400"
            height="145"
          />

          <rect
            x="0"
            y="250"
            rx="24"
            ry="24"
            width="400"
            height="145"
          />
        </ContentLoader>
      </main>
    </div>
  );
}

export default ProtectedRouteSkeleton;