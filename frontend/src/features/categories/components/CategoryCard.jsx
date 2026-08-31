import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const getCardPattern = (index) => {
  const position = index % 3

  if (position === 0) {
    return 'col-span-2 h-48'
  }

  return 'col-span-1 h-40'
}

function CategoryCard({ category, index }) {
  const pattern = getCardPattern(index)

  return (
    <Link
      to={`/categories/${category.slug}`}
      className={`
        group relative overflow-hidden rounded-3xl
        shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        transition duration-300
        hover:shadow-[0_10px_30px_rgba(0,27,61,0.12)]
        ${pattern}
      `}
    >
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="
          absolute inset-0 h-full w-full object-cover
          transition-transform duration-500
          group-hover:scale-105
          opacity-85
        "
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#001b3d]/85 via-[#001b3d]/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
        <h2 className="text-xl font-semibold text-white">
          {category.name}
        </h2>

        {index % 3 === 0 && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white">
            <ChevronLeft size={20} />
          </div>
        )}
      </div>
    </Link>
  )
}

export default CategoryCard