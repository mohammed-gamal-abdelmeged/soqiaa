DROP INDEX IF EXISTS
"Subcategory_category_active_sortOrder_key";

CREATE UNIQUE INDEX
"Subcategory_category_active_sortOrder_key"
ON "Subcategory" ("categoryId", "sortOrder")
WHERE
  "deletedAt" IS NULL
  AND "isActive" = TRUE;