import { Link } from "react-router-dom";

function HomeCategoryCard({ category }) {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group w-[78px] shrink-0 text-center"
    >
      <div
        className="
          aspect-square overflow-hidden
          rounded-[20px] border
          border-gray-100 bg-white p-1
          shadow-[0_5px_18px_rgba(9,43,80,0.035)]
          transition
          group-hover:-translate-y-1
        "
      >
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="
            h-full w-full rounded-2xl
            object-cover transition duration-300
            group-hover:scale-105
          "
        />
      </div>

      <span
        className="
          mt-2 block truncate
          text-[11px] font-bold
          text-[#3c4b59]
        "
      >
        {category.name}
      </span>
    </Link>
  );
}

export default HomeCategoryCard;