import ContentLoader from "react-content-loader";

function ProductGridSkeleton({
  count = 8,
  className = "",
}) {
  return (
    <section className={className}>
      {Array.from({
        length: count,
      }).map((_, index) => (
        <ProductSkeleton
          key={index}
        />
      ))}
    </section>
  );
}

function ProductSkeleton() {
  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-gray-100
        bg-white
        p-3
      "
    >
      <ContentLoader
        speed={1.6}
        width="100%"
        height={255}
        viewBox="0 0 180 255"
        preserveAspectRatio="none"
        backgroundColor="#e5e9e3"
        foregroundColor="#f5f7f4"
        style={{
          width: "100%",
          height: "255px",
        }}
      >
        {/* Image */}
        <rect
          x="0"
          y="0"
          rx="18"
          ry="18"
          width="180"
          height="150"
        />

        {/* Category / small line */}
        <rect
          x="5"
          y="165"
          rx="4"
          ry="4"
          width="55"
          height="8"
        />

        {/* Product name */}
        <rect
          x="5"
          y="184"
          rx="5"
          ry="5"
          width="145"
          height="12"
        />

        <rect
          x="5"
          y="203"
          rx="5"
          ry="5"
          width="95"
          height="10"
        />

        {/* Price */}
        <rect
          x="5"
          y="230"
          rx="5"
          ry="5"
          width="65"
          height="16"
        />

        {/* Add button */}
        <rect
          x="140"
          y="219"
          rx="11"
          ry="11"
          width="35"
          height="35"
        />
      </ContentLoader>
    </div>
  );
}

export default ProductGridSkeleton;