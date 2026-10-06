import ContentLoader from "react-content-loader";

function FavoritesPageSkeleton() {
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
          المفضلة
        </h1>
      </header>

      <main className="mx-auto w-full max-w-md px-5 py-5">
        <ContentLoader
          speed={1.6}
          width="100%"
          height={58}
          viewBox="0 0 400 58"
          preserveAspectRatio="none"
          backgroundColor="#e5e9e3"
          foregroundColor="#f5f7f4"
          style={{
            width: "100%",
            height: "58px",
          }}
        >
          <rect
            x="0"
            y="2"
            rx="6"
            ry="6"
            width="175"
            height="22"
          />

          <rect
            x="0"
            y="38"
            rx="5"
            ry="5"
            width="95"
            height="10"
          />
        </ContentLoader>

        <section className="mt-3 grid grid-cols-2 gap-4">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <FavoriteCardSkeleton
              key={index}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

function FavoriteCardSkeleton() {
  return (
    <article
      className="
        overflow-hidden
        rounded-3xl
        bg-white p-3
        shadow-[0_4px_20px_rgba(0,27,61,0.05)]
      "
    >
      <ContentLoader
        speed={1.6}
        width="100%"
        height={245}
        viewBox="0 0 180 245"
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
          width="180"
          height="155"
        />

        <circle
          cx="155"
          cy="25"
          r="18"
        />

        <rect
          x="4"
          y="172"
          rx="5"
          ry="5"
          width="145"
          height="13"
        />

        <rect
          x="4"
          y="195"
          rx="5"
          ry="5"
          width="75"
          height="9"
        />

        <rect
          x="4"
          y="222"
          rx="6"
          ry="6"
          width="70"
          height="18"
        />
      </ContentLoader>
    </article>
  );
}

export default FavoritesPageSkeleton;