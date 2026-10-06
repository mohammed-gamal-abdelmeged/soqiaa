import ContentLoader from "react-content-loader";

function OrdersPageSkeleton() {
  return (
    <section className="space-y-4">
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <OrderSkeleton
          key={index}
        />
      ))}
    </section>
  );
}

function OrderSkeleton() {
  return (
    <article
      className="
        rounded-2xl
        border border-gray-100
        bg-white p-4
        shadow-[0_4px_20px_rgba(0,27,61,0.05)]
      "
    >
      <ContentLoader
        speed={1.6}
        width="100%"
        height={220}
        viewBox="0 0 400 220"
        preserveAspectRatio="none"
        backgroundColor="#e5e9e3"
        foregroundColor="#f5f7f4"
        style={{
          width: "100%",
          height: "220px",
        }}
      >
        {/* Order number */}
        <rect
          x="0"
          y="3"
          rx="6"
          ry="6"
          width="150"
          height="18"
        />

        {/* Date */}
        <rect
          x="0"
          y="34"
          rx="5"
          ry="5"
          width="110"
          height="10"
        />

        {/* Status */}
        <rect
          x="285"
          y="2"
          rx="15"
          ry="15"
          width="110"
          height="28"
        />

        {/* Products container */}
        <rect
          x="0"
          y="67"
          rx="12"
          ry="12"
          width="400"
          height="82"
        />

        <rect
          x="14"
          y="78"
          rx="10"
          ry="10"
          width="58"
          height="58"
        />

        <rect
          x="88"
          y="78"
          rx="10"
          ry="10"
          width="58"
          height="58"
        />

        <rect
          x="162"
          y="78"
          rx="10"
          ry="10"
          width="58"
          height="58"
        />

        {/* Price */}
        <rect
          x="0"
          y="181"
          rx="4"
          ry="4"
          width="55"
          height="8"
        />

        <rect
          x="0"
          y="199"
          rx="5"
          ry="5"
          width="90"
          height="17"
        />

        {/* Button */}
        <rect
          x="275"
          y="178"
          rx="11"
          ry="11"
          width="120"
          height="40"
        />
      </ContentLoader>
    </article>
  );
}

export default OrdersPageSkeleton;