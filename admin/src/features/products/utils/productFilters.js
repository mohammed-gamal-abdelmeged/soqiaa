// src/features/products/utils/productFilters.js

export function filterProducts({
  products,
  search,
  category,
}) {
  const normalizedSearch =
    search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      !normalizedSearch ||
      product.name
        ?.toLowerCase()
        .includes(normalizedSearch) ||
      product.unit
        ?.toLowerCase()
        .includes(normalizedSearch);

    const matchesCategory =
      category === "all" ||
      product.categorySlug === category;

    return matchesSearch && matchesCategory;
  });
}