import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

import CategoryCard from '../components/CategoryCard'
import { categoriesMock } from '../data/categories.mock'

function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const categories = useMemo(() => {
    return categoriesMock
      .filter((category) => category.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .filter((category) =>
        category.name
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      )
  }, [searchQuery])

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-5">
      <section className="mb-6">
        <h1 className="mb-4 text-2xl font-bold text-primary">
          الأقسام
        </h1>

        <div className="relative">
          <Search
            size={25}
            className="
              pointer-events-none absolute
              right-4 top-1/2
              -translate-y-1/2 text-gray-500
            "
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="دور على قسم..."
            aria-label="البحث عن قسم"
            className="
              w-full rounded-full border border-outline
              bg-white py-3 pr-12 pl-4
              text-base outline-none
              shadow-sm transition
              placeholder:text-gray-500
              focus:border-secondary focus:ring-1 focus:ring-secondary
            "
          />
        </div>
      </section>

      {categories.length > 0 ? (
        <section
          className="
            grid grid-cols-2 gap-4
            md:grid-cols-4
          "
        >
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </section>
      ) : (
        <div className="py-16 text-center">
          <p className="text-text-muted">
            مفيش أقسام بالاسم ده
          </p>
        </div>
      )}
    </div>
  )
}

export default CategoriesPage