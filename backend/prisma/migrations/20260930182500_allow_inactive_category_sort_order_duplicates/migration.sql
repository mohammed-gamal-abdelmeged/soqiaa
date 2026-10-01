/*
|--------------------------------------------------------------------------
| Category Active Sort Order
|--------------------------------------------------------------------------
|
| Inactive categories must NOT reserve a storefront sort order.
|
| Only one active, non-deleted category may use a given sortOrder.
|--------------------------------------------------------------------------
*/

DROP INDEX IF EXISTS
"Category_active_sortOrder_key";


CREATE UNIQUE INDEX
"Category_active_sortOrder_key"
ON "Category" ("sortOrder")
WHERE
  "deletedAt" IS NULL
  AND "isActive" = TRUE;