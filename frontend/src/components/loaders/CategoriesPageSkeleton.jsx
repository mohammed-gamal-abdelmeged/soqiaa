import ContentLoader from "react-content-loader";

function CategoriesPageSkeleton() {
  return (
    <section
      className="
        grid
        grid-cols-2
        gap-4
        md:grid-cols-4
      "
    >
      {Array.from({
        length: 8,
      }).map((_, index) => (
        <CategorySkeleton
          key={index}
          index={index}
        />
      ))}
    </section>
  );
}

function CategorySkeleton({
  index,
}) {
  const isWide =
    index % 3 === 0;

  return (
    <div
      className={`
        overflow-hidden
        rounded-3xl
        ${
          isWide
            ? "col-span-2 h-48"
            : "col-span-1 h-40"
        }
      `}
    >
      <ContentLoader
        speed={1.6}
        width="100%"
        height="100%"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        backgroundColor="#e5e9e3"
        foregroundColor="#f5f7f4"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <rect
          x="0"
          y="0"
          rx="24"
          ry="24"
          width="400"
          height="200"
        />
      </ContentLoader>
    </div>
  );
}

export default CategoriesPageSkeleton;