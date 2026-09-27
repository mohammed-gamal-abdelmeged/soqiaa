-- Prevent two non-deleted categories
-- from using the same display order.
CREATE UNIQUE INDEX
"Category_active_sortOrder_key"
ON "Category" ("sortOrder")
WHERE "deletedAt" IS NULL;


-- Prevent two non-deleted subcategories
-- inside the same category
-- from using the same display order.
CREATE UNIQUE INDEX
"Subcategory_category_active_sortOrder_key"
ON "Subcategory" ("categoryId", "sortOrder")
WHERE "deletedAt" IS NULL;