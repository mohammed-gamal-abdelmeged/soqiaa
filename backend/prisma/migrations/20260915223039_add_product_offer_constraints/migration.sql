-- Product price must always be greater than zero.
ALTER TABLE "Product"
ADD CONSTRAINT "Product_price_positive_check"
CHECK (price > 0);


-- Product stock cannot be negative.
ALTER TABLE "Product"
ADD CONSTRAINT "Product_stock_nonnegative_check"
CHECK (stock >= 0);


-- Product rating must stay between 0 and 5.
ALTER TABLE "Product"
ADD CONSTRAINT "Product_rating_range_check"
CHECK (
  "ratingAverage" >= 0
  AND "ratingAverage" <= 5
);


-- Product reviews count cannot be negative.
ALTER TABLE "Product"
ADD CONSTRAINT "Product_reviewsCount_nonnegative_check"
CHECK ("reviewsCount" >= 0);


-- Offer discount must be greater than 0
-- and cannot exceed 100 percent.
ALTER TABLE "Offer"
ADD CONSTRAINT "Offer_discountPercentage_range_check"
CHECK (
  "discountPercentage" > 0
  AND "discountPercentage" <= 100
);


-- When both dates exist,
-- the offer must end after it starts.
ALTER TABLE "Offer"
ADD CONSTRAINT "Offer_dates_order_check"
CHECK (
  "startsAt" IS NULL
  OR "endsAt" IS NULL
  OR "endsAt" > "startsAt"
);