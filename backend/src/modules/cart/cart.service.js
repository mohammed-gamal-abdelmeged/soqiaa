import { prisma } from "../../database/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import { toPublicAssetUrl } from "../../shared/uploads/assetUrl.js";

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const SERIALIZABLE_RETRIES = 3;

/*
|--------------------------------------------------------------------------
| Prisma Selects
|--------------------------------------------------------------------------
*/

const PRODUCT_AVAILABILITY_SELECT = {
  id: true,
  stock: true,
  isActive: true,
  deletedAt: true,

  subcategory: {
    select: {
      isActive: true,
      deletedAt: true,

      category: {
        select: {
          isActive: true,
          deletedAt: true,
        },
      },
    },
  },
};

const CART_ITEM_SELECT = {
  id: true,
  productId: true,
  quantity: true,

  product: {
    select: {
      id: true,
      name: true,
      imageUrl: true,
      unit: true,
      price: true,
      stock: true,
      isActive: true,
      deletedAt: true,

      offer: {
        select: {
          discountPercentage: true,
          isActive: true,
          startsAt: true,
          endsAt: true,
        },
      },

      subcategory: {
        select: {
          isActive: true,
          deletedAt: true,

          category: {
            select: {
              isActive: true,
              deletedAt: true,
            },
          },
        },
      },
    },
  },
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function isProductVisible(product) {
  if (!product) {
    return false;
  }

  if (
    product.deletedAt ||
    !product.isActive
  ) {
    return false;
  }

  if (
    product.subcategory.deletedAt ||
    !product.subcategory.isActive
  ) {
    return false;
  }

  if (
    product.subcategory.category.deletedAt ||
    !product.subcategory.category.isActive
  ) {
    return false;
  }

  return true;
}

function isCurrentOffer(offer, now = new Date()) {
  if (!offer || !offer.isActive) {
    return false;
  }

  if (
    offer.startsAt &&
    offer.startsAt > now
  ) {
    return false;
  }

  if (
    offer.endsAt &&
    offer.endsAt <= now
  ) {
    return false;
  }

  return true;
}

function getDiscountPercentage(
  product,
  now = new Date()
) {
  if (!isProductVisible(product)) {
    return 0;
  }

  if (
    !isCurrentOffer(
      product.offer,
      now
    )
  ) {
    return 0;
  }

  return Number(
    product.offer.discountPercentage
  );
}

function getFinalPrice(
  price,
  discountPercentage
) {
  if (!discountPercentage) {
    return price;
  }

  /*
   * Matches the current frontend behavior.
   *
   * Checkout will later recalculate prices
   * authoritatively on the server.
   */
  return Math.round(
    price -
      price *
        (discountPercentage / 100)
  );
}

function serializeCartItem(
  cartItem,
  now = new Date()
) {
  const product =
    cartItem.product;

  const price =
    Number(product.price);

  const discountPercentage =
    getDiscountPercentage(
      product,
      now
    );

  const finalPrice =
    getFinalPrice(
      price,
      discountPercentage
    );

  const visible =
    isProductVisible(product);

  const hasEnoughStock =
    product.stock >=
    cartItem.quantity;

  return {
    /*
     * Keep id equal to Product ID because
     * the current frontend cart works with
     * item.id as the product identifier.
     */
    id: product.id,

    cartItemId: cartItem.id,

    name: product.name,

    image:
      toPublicAssetUrl(
        product.imageUrl
      ),

    unit: product.unit,

    price,

    discountPercentage,

    finalPrice,

    quantity:
      cartItem.quantity,

    stock:
      product.stock,

    isAvailable:
      visible &&
      product.stock > 0 &&
      hasEnoughStock,
  };
}

async function ensureSellableProduct(
  client,
  productId
) {
  const product =
    await client.product.findUnique({
      where: {
        id: productId,
      },

      select:
        PRODUCT_AVAILABILITY_SELECT,
    });

  if (!product) {
    throw new AppError(
      "Product not found",
      404,
      "PRODUCT_NOT_FOUND"
    );
  }

  if (!isProductVisible(product)) {
    throw new AppError(
      "Product is currently unavailable",
      409,
      "PRODUCT_UNAVAILABLE"
    );
  }

  if (product.stock <= 0) {
    throw new AppError(
      "Product is out of stock",
      409,
      "PRODUCT_OUT_OF_STOCK"
    );
  }

  return product;
}

function ensureEnoughStock(
  stock,
  requestedQuantity
) {
  if (requestedQuantity > stock) {
    throw new AppError(
      `Only ${stock} item(s) are currently available`,
      409,
      "INSUFFICIENT_STOCK"
    );
  }
}

/*
|--------------------------------------------------------------------------
| Serializable Transaction
|--------------------------------------------------------------------------
|
| This protects cart quantity changes from race conditions such as:
|
| Request A reads quantity = 2
| Request B reads quantity = 2
|
| and both try to increase it simultaneously.
|
| The final checkout will still perform its own stock-safe transaction,
| because adding to cart does NOT reserve inventory.
|--------------------------------------------------------------------------
*/

async function runSerializableTransaction(
  callback
) {
  let lastError;

  for (
    let attempt = 1;
    attempt <= SERIALIZABLE_RETRIES;
    attempt += 1
  ) {
    try {
      return await prisma.$transaction(
        callback,
        {
          isolationLevel:
            "Serializable",
        }
      );
    } catch (error) {
      lastError = error;

      /*
       * Prisma P2034:
       * Transaction conflict / deadlock.
       */
      if (
        error?.code !== "P2034" ||
        attempt ===
          SERIALIZABLE_RETRIES
      ) {
        throw error;
      }
    }
  }

  throw lastError;
}

/*
|--------------------------------------------------------------------------
| Get Cart
|--------------------------------------------------------------------------
*/

export async function getCart(
  userId
) {
  const cart =
    await prisma.cart.findUnique({
      where: {
        userId,
      },

      select: {
        id: true,

        items: {
          select:
            CART_ITEM_SELECT,

          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
    };
  }

  const now = new Date();

  const items =
    cart.items.map(
      (item) =>
        serializeCartItem(
          item,
          now
        )
    );

  const totalItems =
    items.reduce(
      (total, item) =>
        total +
        item.quantity,
      0
    );

  /*
   * This subtotal is for cart display.
   *
   * Checkout will NEVER trust this value.
   * It will recalculate everything from DB.
   */
  const subtotal =
    items.reduce(
      (total, item) =>
        total +
        item.finalPrice *
          item.quantity,
      0
    );

  return {
    items,
    totalItems,
    subtotal,
  };
}

/*
|--------------------------------------------------------------------------
| Add Item
|--------------------------------------------------------------------------
*/

export async function addCartItem(
  userId,
  {
    productId,
    quantity,
  }
) {
  return runSerializableTransaction(
    async (tx) => {
      const product =
        await ensureSellableProduct(
          tx,
          productId
        );

      const cart =
        await tx.cart.upsert({
          where: {
            userId,
          },

          update: {},

          create: {
            userId,
          },

          select: {
            id: true,
          },
        });

      const existingItem =
        await tx.cartItem.findUnique({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId,
            },
          },

          select: {
            id: true,
            quantity: true,
          },
        });

      const nextQuantity =
        existingItem
          ? existingItem.quantity +
            quantity
          : quantity;

      ensureEnoughStock(
        product.stock,
        nextQuantity
      );

      let cartItem;

      if (existingItem) {
        cartItem =
          await tx.cartItem.update({
            where: {
              id:
                existingItem.id,
            },

            data: {
              quantity:
                nextQuantity,
            },

            select:
              CART_ITEM_SELECT,
          });
      } else {
        cartItem =
          await tx.cartItem.create({
            data: {
              cartId:
                cart.id,

              productId,

              quantity,
            },

            select:
              CART_ITEM_SELECT,
          });
      }

      return serializeCartItem(
        cartItem
      );
    }
  );
}

/*
|--------------------------------------------------------------------------
| Update Item Quantity
|--------------------------------------------------------------------------
*/

export async function updateCartItem(
  userId,
  productId,
  {
    quantity,
  }
) {
  return runSerializableTransaction(
    async (tx) => {
      const cartItem =
        await tx.cartItem.findFirst({
          where: {
            productId,

            cart: {
              userId,
            },
          },

          select:
            CART_ITEM_SELECT,
        });

      if (!cartItem) {
        throw new AppError(
          "Cart item not found",
          404,
          "CART_ITEM_NOT_FOUND"
        );
      }

      const product =
        cartItem.product;

      if (
        !isProductVisible(
          product
        )
      ) {
        throw new AppError(
          "Product is currently unavailable",
          409,
          "PRODUCT_UNAVAILABLE"
        );
      }

      if (
        product.stock <= 0
      ) {
        throw new AppError(
          "Product is out of stock",
          409,
          "PRODUCT_OUT_OF_STOCK"
        );
      }

      ensureEnoughStock(
        product.stock,
        quantity
      );

      const updatedItem =
        await tx.cartItem.update({
          where: {
            id:
              cartItem.id,
          },

          data: {
            quantity,
          },

          select:
            CART_ITEM_SELECT,
        });

      return serializeCartItem(
        updatedItem
      );
    }
  );
}

/*
|--------------------------------------------------------------------------
| Remove Item
|--------------------------------------------------------------------------
*/

export async function removeCartItem(
  userId,
  productId
) {
  const result =
    await prisma.cartItem.deleteMany({
      where: {
        productId,

        cart: {
          userId,
        },
      },
    });

  if (result.count === 0) {
    throw new AppError(
      "Cart item not found",
      404,
      "CART_ITEM_NOT_FOUND"
    );
  }

  return {
    productId,
  };
}

/*
|--------------------------------------------------------------------------
| Clear Cart
|--------------------------------------------------------------------------
*/

export async function clearCart(
  userId
) {
  const result =
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId,
        },
      },
    });

  return {
    removedItems:
      result.count,
  };
}