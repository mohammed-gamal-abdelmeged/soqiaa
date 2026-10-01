import { randomUUID } from "node:crypto";

import { prisma } from "../../database/prisma.js";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/AppError.js";
import { toPublicAssetUrl } from "../../shared/uploads/assetUrl.js";

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const SERIALIZABLE_RETRIES = 3;

const USER_ORDERS_LIMIT = 20;

const ORDER_STATUS_TRANSITIONS = {
  RECEIVED: [
    "CONFIRMED",
    "CANCELLED",
  ],

  CONFIRMED: [
    "PREPARING",
    "CANCELLED",
  ],

  PREPARING: [
    "OUT_FOR_DELIVERY",
    "CANCELLED",
  ],

  OUT_FOR_DELIVERY: [
    "DELIVERED",
    "CANCELLED",
  ],

  DELIVERED: [],

  CANCELLED: [],
};

/*
|--------------------------------------------------------------------------
| Prisma Selects
|--------------------------------------------------------------------------
*/

const ORDER_PRODUCT_SELECT = {
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
};

/*
|--------------------------------------------------------------------------
| Order Created Response
|--------------------------------------------------------------------------
|
| Used immediately after checkout.
|--------------------------------------------------------------------------
*/

const CREATED_ORDER_SELECT = {
  id: true,
  orderNumber: true,
  status: true,

  customerName: true,
  customerPhone: true,
  deliveryAddress: true,

  subtotal: true,
  discountAmount: true,
  deliveryFee: true,
  total: true,

  couponCode: true,

  createdAt: true,

  items: {
    select: {
      id: true,
      productId: true,
      productName: true,
      productImageUrl: true,
      unit: true,
      unitPrice: true,
      discountPercentage: true,
      finalUnitPrice: true,
      quantity: true,
      lineTotal: true,
    },
  },
};

/*
|--------------------------------------------------------------------------
| Orders List
|--------------------------------------------------------------------------
|
| Lightweight select for:
|
| GET /orders
|
| We do NOT load:
| - customer data
| - subtotal
| - discount details
| - coupon details
| - full order items
| - status history
|
| Only the first 3 products are loaded
| for the order card preview.
|--------------------------------------------------------------------------
*/

const ORDER_LIST_SELECT = {
  id: true,
  orderNumber: true,
  status: true,
  total: true,
  createdAt: true,

  items: {
    take: 3,

    orderBy: {
      createdAt: "asc",
    },

    select: {
      id: true,
      productId: true,
      productName: true,
      productImageUrl: true,
      unit: true,
      quantity: true,
    },
  },

  _count: {
    select: {
      items: true,
    },
  },
};

/*
|--------------------------------------------------------------------------
| Admin Orders List
|--------------------------------------------------------------------------
|
| Lightweight data for the admin orders page.
| Full details are loaded only when an order is opened.
|--------------------------------------------------------------------------
*/

const ADMIN_ORDER_LIST_SELECT = {
  id: true,
  orderNumber: true,
  status: true,

  customerName: true,

  total: true,

  createdAt: true,

  _count: {
    select: {
      items: true,
    },
  },
};

/*
|--------------------------------------------------------------------------
| Order Details
|--------------------------------------------------------------------------
|
| Used only when the user opens one specific order:
|
| GET /orders/:id
|
| This is intentionally heavier than ORDER_LIST_SELECT.
|--------------------------------------------------------------------------
*/

const ORDER_DETAIL_SELECT = {
  id: true,
  orderNumber: true,
  status: true,

  customerName: true,
  customerPhone: true,
  deliveryAddress: true,

  subtotal: true,
  discountAmount: true,
  deliveryFee: true,
  total: true,

  couponCode: true,

  createdAt: true,
  updatedAt: true,

  items: {
    orderBy: {
      createdAt: "asc",
    },

    select: {
      id: true,
      productId: true,
      productName: true,
      productImageUrl: true,
      unit: true,
      unitPrice: true,
      discountPercentage: true,
      finalUnitPrice: true,
      quantity: true,
      lineTotal: true,
    },
  },

  statusHistory: {
    orderBy: {
      createdAt: "asc",
    },

    select: {
      id: true,
      fromStatus: true,
      toStatus: true,
      note: true,
      createdAt: true,
    },
  },
};

/*
|--------------------------------------------------------------------------
| Product Helpers
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

function isCurrentOffer(
  offer,
  now = new Date()
) {
  if (
    !offer ||
    !offer.isActive
  ) {
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
  now
) {
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

/*
|--------------------------------------------------------------------------
| Money Helpers
|--------------------------------------------------------------------------
*/

function getFinalUnitPrice(
  unitPrice,
  discountPercentage
) {
  if (!discountPercentage) {
    return unitPrice;
  }

  /*
   * Matches the current frontend/cart behavior.
   *
   * Example:
   * 42.5 with 20% discount => 34
   */
  return Math.round(
    unitPrice -
      unitPrice *
        (
          discountPercentage /
          100
        )
  );
}

function roundMoney(value) {
  return Math.round(
    (value + Number.EPSILON) *
      100
  ) / 100;
}

/*
|--------------------------------------------------------------------------
| Cart Checkout Data
|--------------------------------------------------------------------------
*/

async function getCheckoutCart(
  client,
  userId
) {
  const cart =
    await client.cart.findUnique({
      where: {
        userId,
      },

      select: {
        id: true,

        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,

            product: {
              select:
                ORDER_PRODUCT_SELECT,
            },
          },

          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

  if (
    !cart ||
    cart.items.length === 0
  ) {
    throw new AppError(
      "Cart is empty",
      409,
      "CART_EMPTY"
    );
  }

  return cart;
}

/*
|--------------------------------------------------------------------------
| Calculate Cart
|--------------------------------------------------------------------------
*/

function calculateCart(
  cart,
  now = new Date()
) {
  const items = [];

  let subtotal = 0;

  for (
    const cartItem of cart.items
  ) {
    const product =
      cartItem.product;

    if (
      !isProductVisible(
        product
      )
    ) {
      throw new AppError(
        `Product "${product.name}" is currently unavailable`,
        409,
        "PRODUCT_UNAVAILABLE"
      );
    }

    if (
      product.stock <= 0
    ) {
      throw new AppError(
        `Product "${product.name}" is out of stock`,
        409,
        "PRODUCT_OUT_OF_STOCK"
      );
    }

    if (
      cartItem.quantity >
      product.stock
    ) {
      throw new AppError(
        `Only ${product.stock} item(s) of "${product.name}" are currently available`,
        409,
        "INSUFFICIENT_STOCK"
      );
    }

    const unitPrice =
      Number(
        product.price
      );

    const discountPercentage =
      getDiscountPercentage(
        product,
        now
      );

    const finalUnitPrice =
      getFinalUnitPrice(
        unitPrice,
        discountPercentage
      );

    const lineTotal =
      roundMoney(
        finalUnitPrice *
          cartItem.quantity
      );

    subtotal =
      roundMoney(
        subtotal +
          lineTotal
      );

    items.push({
      cartItemId:
        cartItem.id,

      productId:
        product.id,

      productName:
        product.name,

      productImageUrl:
        product.imageUrl,

      unit:
        product.unit,

      unitPrice,

      discountPercentage,

      finalUnitPrice,

      quantity:
        cartItem.quantity,

      lineTotal,
    });
  }

  return {
    items,
    subtotal,
  };
}

/*
|--------------------------------------------------------------------------
| Coupon Helpers
|--------------------------------------------------------------------------
*/

async function getValidatedCoupon(
  client,
  {
    userId,
    couponCode,
    subtotal,
    now,
  }
) {
  if (!couponCode) {
    return null;
  }

  const coupon =
    await client.coupon.findUnique({
      where: {
        code: couponCode,
      },

      select: {
        id: true,
        code: true,
        discountType: true,
        value: true,
        minOrderAmount: true,
        maxDiscountAmount: true,
        usageLimit: true,
        usagePerUser: true,
        startsAt: true,
        expiresAt: true,
        isActive: true,
      },
    });

  if (!coupon) {
    throw new AppError(
      "Coupon not found",
      404,
      "COUPON_NOT_FOUND"
    );
  }

  if (!coupon.isActive) {
    throw new AppError(
      "Coupon is inactive",
      409,
      "COUPON_INACTIVE"
    );
  }

  if (
    coupon.startsAt &&
    coupon.startsAt > now
  ) {
    throw new AppError(
      "Coupon is not active yet",
      409,
      "COUPON_NOT_STARTED"
    );
  }

  if (
    coupon.expiresAt &&
    coupon.expiresAt <= now
  ) {
    throw new AppError(
      "Coupon has expired",
      409,
      "COUPON_EXPIRED"
    );
  }

  const minOrderAmount =
    coupon.minOrderAmount === null
      ? null
      : Number(
          coupon.minOrderAmount
        );

  if (
    minOrderAmount !== null &&
    subtotal < minOrderAmount
  ) {
    throw new AppError(
      `Minimum order amount for this coupon is ${minOrderAmount}`,
      409,
      "COUPON_MIN_ORDER_NOT_MET"
    );
  }

  if (
    coupon.usageLimit !== null
  ) {
    const totalUsage =
      await client.couponUsage.count({
        where: {
          couponId:
            coupon.id,
        },
      });

    if (
      totalUsage >=
      coupon.usageLimit
    ) {
      throw new AppError(
        "Coupon usage limit has been reached",
        409,
        "COUPON_USAGE_LIMIT_REACHED"
      );
    }
  }

  if (
    coupon.usagePerUser !==
    null
  ) {
    const userUsage =
      await client.couponUsage.count({
        where: {
          couponId:
            coupon.id,

          userId,
        },
      });

    if (
      userUsage >=
      coupon.usagePerUser
    ) {
      throw new AppError(
        "You have reached the usage limit for this coupon",
        409,
        "COUPON_USER_LIMIT_REACHED"
      );
    }
  }

  return coupon;
}

function calculateCouponDiscount(
  coupon,
  subtotal
) {
  if (!coupon) {
    return 0;
  }

  const value =
    Number(
      coupon.value
    );

  let discountAmount;

  if (
    coupon.discountType ===
    "PERCENTAGE"
  ) {
    /*
     * Matches the current frontend
     * coupon calculation behavior.
     */
    discountAmount =
      Math.round(
        subtotal *
          (
            value /
            100
          )
      );
  } else {
    discountAmount =
      value;
  }

  if (
    coupon.maxDiscountAmount !==
    null
  ) {
    discountAmount =
      Math.min(
        discountAmount,
        Number(
          coupon.maxDiscountAmount
        )
      );
  }

  discountAmount =
    Math.min(
      discountAmount,
      subtotal
    );

  return roundMoney(
    discountAmount
  );
}

/*
|--------------------------------------------------------------------------
| Totals
|--------------------------------------------------------------------------
*/

function calculateCheckoutTotals(
  subtotal,
  discountAmount
) {
  const deliveryFee =
    roundMoney(
      env.deliveryFee
    );

  const total =
    roundMoney(
      subtotal -
        discountAmount +
        deliveryFee
    );

  return {
    subtotal,
    discountAmount,
    deliveryFee,
    total,
  };
}

/*
|--------------------------------------------------------------------------
| Order Number
|--------------------------------------------------------------------------
*/

function createOrderNumber() {
  const now = new Date();

  const datePart =
    now
      .toISOString()
      .slice(0, 10)
      .replaceAll("-", "");

  const randomPart =
    randomUUID()
      .replaceAll("-", "")
      .slice(0, 10)
      .toUpperCase();

  return `SQ${datePart}${randomPart}`;
}

/*
|--------------------------------------------------------------------------
| Serialization
|--------------------------------------------------------------------------
*/

function serializeOrderItem(
  item
) {
  return {
    id:
      item.productId ??
      item.id,

    orderItemId:
      item.id,

    productId:
      item.productId,

    name:
      item.productName,

    image:
      toPublicAssetUrl(
        item.productImageUrl
      ),

    unit:
      item.unit,

    price:
      Number(
        item.unitPrice
      ),

    discountPercentage:
      Number(
        item.discountPercentage
      ),

    finalPrice:
      Number(
        item.finalUnitPrice
      ),

    quantity:
      item.quantity,

    lineTotal:
      Number(
        item.lineTotal
      ),
  };
}

function serializeOrderPreviewItem(
  item
) {
  return {
    id:
      item.productId ??
      item.id,

    orderItemId:
      item.id,

    productId:
      item.productId,

    name:
      item.productName,

    image:
      toPublicAssetUrl(
        item.productImageUrl
      ),

    unit:
      item.unit,

    quantity:
      item.quantity,
  };
}

function serializeOrderStatusHistory(
  history
) {
  return {
    id:
      history.id,

    fromStatus:
      history.fromStatus
        ? history.fromStatus.toLowerCase()
        : null,

    toStatus:
      history.toStatus.toLowerCase(),

    note:
      history.note,

    createdAt:
      history.createdAt,
  };
}

function serializeOrder(
  order
) {
  const result = {
    id:
      order.id,

    orderNumber:
      order.orderNumber,

    status:
      order.status.toLowerCase(),

    customer: {
      name:
        order.customerName,

      phone:
        order.customerPhone,

      address:
        order.deliveryAddress,
    },

    subtotal:
      Number(
        order.subtotal
      ),

    discountAmount:
      Number(
        order.discountAmount
      ),

    deliveryFee:
      Number(
        order.deliveryFee
      ),

    total:
      Number(
        order.total
      ),

    appliedCoupon:
      order.couponCode,

    createdAt:
      order.createdAt,

    items:
      order.items.map(
        serializeOrderItem
      ),
  };

  if (
    order.updatedAt !==
    undefined
  ) {
    result.updatedAt =
      order.updatedAt;
  }

  if (
    order.statusHistory
  ) {
    result.statusHistory =
      order.statusHistory.map(
        serializeOrderStatusHistory
      );
  }

  return result;
}

function serializeOrderListItem(
  order
) {
  return {
    id:
      order.id,

    orderNumber:
      order.orderNumber,

    status:
      order.status.toLowerCase(),

    total:
      Number(
        order.total
      ),

    createdAt:
      order.createdAt,

    itemsCount:
      order._count.items,

    items:
      order.items.map(
        serializeOrderPreviewItem
      ),
  };
}

/*
|--------------------------------------------------------------------------
| Serializable Transaction
|--------------------------------------------------------------------------
*/

async function runSerializableTransaction(
  callback
) {
  let lastError;

  for (
    let attempt = 1;
    attempt <=
    SERIALIZABLE_RETRIES;
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
       * transaction conflict / deadlock.
       */
      if (
        error?.code !==
          "P2034" ||
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
| Checkout Preview
|--------------------------------------------------------------------------
*/

export async function previewOrder(
  userId,
  {
    couponCode,
  }
) {
  /*
   * Preview does not modify anything,
   * but it always uses current DB data.
   */
  const cart =
    await getCheckoutCart(
      prisma,
      userId
    );

  const now = new Date();

  const {
    items,
    subtotal,
  } =
    calculateCart(
      cart,
      now
    );

  const coupon =
    await getValidatedCoupon(
      prisma,
      {
        userId,
        couponCode,
        subtotal,
        now,
      }
    );

  const discountAmount =
    calculateCouponDiscount(
      coupon,
      subtotal
    );

  const totals =
    calculateCheckoutTotals(
      subtotal,
      discountAmount
    );

  return {
    items:
      items.map(
        (item) => ({
          id:
            item.productId,

          name:
            item.productName,

          image:
            toPublicAssetUrl(
              item.productImageUrl
            ),

          unit:
            item.unit,

          price:
            item.unitPrice,

          discountPercentage:
            item.discountPercentage,

          finalPrice:
            item.finalUnitPrice,

          quantity:
            item.quantity,

          lineTotal:
            item.lineTotal,
        })
      ),

    ...totals,

    couponCode:
      coupon?.code ??
      null,
  };
}

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
*/

export async function createOrder(
  userId,
  {
    customerName,
    customerPhone,
    deliveryAddress,
    couponCode,
  }
) {
  return runSerializableTransaction(
    async (tx) => {
      /*
       * Read everything again INSIDE
       * the transaction.
       *
       * Never trust the previous preview.
       */
      const cart =
        await getCheckoutCart(
          tx,
          userId
        );

      const now =
        new Date();

      const {
        items,
        subtotal,
      } =
        calculateCart(
          cart,
          now
        );

      const coupon =
        await getValidatedCoupon(
          tx,
          {
            userId,
            couponCode,
            subtotal,
            now,
          }
        );

      const discountAmount =
        calculateCouponDiscount(
          coupon,
          subtotal
        );

      const {
        deliveryFee,
        total,
      } =
        calculateCheckoutTotals(
          subtotal,
          discountAmount
        );

      /*
       * Inventory deduction.
       *
       * The WHERE condition is critical:
       * stock must still be >= quantity
       * at the exact moment of update.
       */
      for (
        const item of items
      ) {
        const updated =
          await tx.product.updateMany({
            where: {
              id:
                item.productId,

              isActive:
                true,

              deletedAt:
                null,

              stock: {
                gte:
                  item.quantity,
              },

              subcategory: {
                is: {
                  isActive:
                    true,

                  deletedAt:
                    null,

                  category: {
                    is: {
                      isActive:
                        true,

                      deletedAt:
                        null,
                    },
                  },
                },
              },
            },

            data: {
              stock: {
                decrement:
                  item.quantity,
              },
            },
          });

        if (
          updated.count !== 1
        ) {
          throw new AppError(
            `Product "${item.productName}" no longer has enough stock`,
            409,
            "INSUFFICIENT_STOCK"
          );
        }
      }

      const order =
        await tx.order.create({
          data: {
            orderNumber:
              createOrderNumber(),

            userId,

            status:
              "RECEIVED",

            customerName,
            customerPhone,
            deliveryAddress,

            subtotal,
            discountAmount,
            deliveryFee,
            total,

            couponId:
              coupon?.id ??
              null,

            couponCode:
              coupon?.code ??
              null,

            items: {
              create:
                items.map(
                  (item) => ({
                    productId:
                      item.productId,

                    productName:
                      item.productName,

                    productImageUrl:
                      item.productImageUrl,

                    unit:
                      item.unit,

                    unitPrice:
                      item.unitPrice,

                    discountPercentage:
                      item.discountPercentage,

                    finalUnitPrice:
                      item.finalUnitPrice,

                    quantity:
                      item.quantity,

                    lineTotal:
                      item.lineTotal,
                  })
                ),
            },

            statusHistory: {
              create: {
                fromStatus:
                  null,

                toStatus:
                  "RECEIVED",

                changedByUserId:
                  userId,

                note:
                  "Order created",
              },
            },
          },

          select:
            CREATED_ORDER_SELECT,
        });

      /*
       * Record coupon usage only
       * after the order exists.
       */
      if (coupon) {
        await tx.couponUsage.create({
          data: {
            couponId:
              coupon.id,

            userId,

            orderId:
              order.id,
          },
        });
      }

      /*
       * Successful order means
       * the purchased cart items
       * are cleared.
       *
       * Keep the Cart row itself.
       */
      await tx.cartItem.deleteMany({
        where: {
          cartId:
            cart.id,
        },
      });

      return serializeOrder(
        order
      );
    }
  );
}

/*
|--------------------------------------------------------------------------
| Get User Orders
|--------------------------------------------------------------------------
|
| Lightweight orders list.
|
| Only the data required by the orders cards is loaded.
| Full order details are NOT loaded here.
|--------------------------------------------------------------------------
*/

export async function getUserOrders(
  userId
) {
  const orders =
    await prisma.order.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      take:
        USER_ORDERS_LIMIT,

      select:
        ORDER_LIST_SELECT,
    });

  return orders.map(
    serializeOrderListItem
  );
}

/*
|--------------------------------------------------------------------------
| Get User Order By ID
|--------------------------------------------------------------------------
|
| Full order details are loaded only
| when the user opens a specific order.
|--------------------------------------------------------------------------
*/

export async function getUserOrderById(
  userId,
  orderId
) {
  const order =
    await prisma.order.findFirst({
      where: {
        id:
          orderId,

        userId,
      },

      select:
        ORDER_DETAIL_SELECT,
    });

  if (!order) {
    throw new AppError(
      "Order not found",
      404,
      "ORDER_NOT_FOUND"
    );
  }

  return serializeOrder(
    order
  );
}

/*
|--------------------------------------------------------------------------
| Order Status Transition
|--------------------------------------------------------------------------
*/

function assertOrderStatusTransition(
  currentStatus,
  nextStatus
) {
  if (
    currentStatus ===
    nextStatus
  ) {
    throw new AppError(
      "Order already has this status",
      409,
      "ORDER_STATUS_UNCHANGED"
    );
  }

  const allowedStatuses =
    ORDER_STATUS_TRANSITIONS[
      currentStatus
    ] ?? [];

  if (
    !allowedStatuses.includes(
      nextStatus
    )
  ) {
    throw new AppError(
      `Cannot change order status from ${currentStatus} to ${nextStatus}`,
      409,
      "INVALID_ORDER_STATUS_TRANSITION"
    );
  }
}

/*
|--------------------------------------------------------------------------
| Update Order Status
|--------------------------------------------------------------------------
|
| Admin only.
|
| Status flow:
|
| RECEIVED
|   -> CONFIRMED
|   -> CANCELLED
|
| CONFIRMED
|   -> PREPARING
|   -> CANCELLED
|
| PREPARING
|   -> OUT_FOR_DELIVERY
|   -> CANCELLED
|
| OUT_FOR_DELIVERY
|   -> DELIVERED
|   -> CANCELLED
|
| DELIVERED and CANCELLED are terminal.
|
| Cancelling an order restores its stock
| inside the same transaction.
|--------------------------------------------------------------------------
*/

export async function updateOrderStatus(
  adminUserId,
  orderId,
  {
    status,
    note,
  }
) {
  return runSerializableTransaction(
    async (tx) => {
      /*
       * Load only what is required
       * to validate the transition
       * and restore inventory.
       */
      const currentOrder =
        await tx.order.findUnique({
          where: {
            id:
              orderId,
          },

          select: {
            id: true,

            status: true,

            items: {
              select: {
                productId: true,
                quantity: true,
              },
            },
          },
        });

      if (!currentOrder) {
        throw new AppError(
          "Order not found",
          404,
          "ORDER_NOT_FOUND"
        );
      }

      /*
       * Prevent skipping statuses,
       * going backwards,
       * or changing a terminal order.
       */
      assertOrderStatusTransition(
        currentOrder.status,
        status
      );

      /*
       * Conditional update.
       *
       * This is important for concurrency.
       *
       * If two admin requests try to
       * change the same order at once,
       * only one can successfully update
       * from the status we originally read.
       */
      const updated =
        await tx.order.updateMany({
          where: {
            id:
              orderId,

            status:
              currentOrder.status,
          },

          data: {
            status,
          },
        });

      if (
        updated.count !== 1
      ) {
        throw new AppError(
          "Order status changed while processing the request",
          409,
          "ORDER_STATUS_CONFLICT"
        );
      }

      /*
       * Restore inventory only when
       * transitioning INTO CANCELLED.
       *
       * CANCELLED is terminal, so the
       * same order can never restore
       * stock a second time.
       */
      if (
  status ===
  "CANCELLED"
) {
  /*
   * Restore purchased quantities.
   */
  for (
    const item of
    currentOrder.items
  ) {
    /*
     * productId can be null if
     * the original product was deleted.
     */
    if (
      !item.productId
    ) {
      continue;
    }

    const restored =
      await tx.product.updateMany({
        where: {
          id:
            item.productId,
        },

        data: {
          stock: {
            increment:
              item.quantity,
          },
        },
      });

    if (
      restored.count !== 1
    ) {
      throw new AppError(
        "Could not restore product stock",
        409,
        "STOCK_RESTORE_FAILED"
      );
    }
  }

  /*
   * A cancelled order should not consume
   * the customer's coupon usage.
   *
   * If the order had no coupon,
   * deleteMany simply removes nothing.
   */
  await tx.couponUsage.deleteMany({
    where: {
      orderId:
        currentOrder.id,
    },
  });
}

      /*
       * Store full status history.
       */
      await tx.orderStatusHistory.create({
        data: {
          orderId,

          fromStatus:
            currentOrder.status,

          toStatus:
            status,

          changedByUserId:
            adminUserId,

          note:
            note?.trim() ||
            null,
        },
      });

      /*
       * Return the fresh full order
       * so the admin details page can
       * update immediately without
       * another request.
       */
      const order =
        await tx.order.findUnique({
          where: {
            id:
              orderId,
          },

          select:
            ORDER_DETAIL_SELECT,
        });

      return serializeOrder(
        order
      );
    }
  );
}
/*
|--------------------------------------------------------------------------
| Admin - Get Orders
|--------------------------------------------------------------------------
*/

export async function getAdminOrders(
  {
    page = 1,
    limit = 20,
    status,
    search,
  } = {},
) {
  const normalizedSearch =
    search?.trim();

  const where = {
    ...(status
      ? {
          status,
        }
      : {}),

    ...(normalizedSearch
      ? {
          OR: [
            {
              orderNumber: {
                contains:
                  normalizedSearch,

                mode:
                  "insensitive",
              },
            },

            {
              customerName: {
                contains:
                  normalizedSearch,

                mode:
                  "insensitive",
              },
            },

            {
              customerPhone: {
                contains:
                  normalizedSearch,
              },
            },
          ],
        }
      : {}),
  };

  const skip =
    (page - 1) * limit;

  const [
    total,
    orders,
  ] =
    await prisma.$transaction([
      prisma.order.count({
        where,
      }),

      prisma.order.findMany({
        where,

        orderBy: [
          {
            createdAt:
              "desc",
          },
          {
            id:
              "desc",
          },
        ],

        skip,

        take:
          limit,

        select:
          ADMIN_ORDER_LIST_SELECT,
      }),
    ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        total / limit,
      ),
    );

  return {
    orders:
      orders.map(
        (order) => ({
          id:
            order.id,

          orderNumber:
            order.orderNumber,

          status:
            order.status.toLowerCase(),

          customer: {
            name:
              order.customerName,
          },

          total:
            Number(
              order.total,
            ),

          createdAt:
            order.createdAt,

          itemsCount:
            order._count.items,
        }),
      ),

    pagination: {
      page,
      limit,
      total,
      totalPages,

      hasNextPage:
        page < totalPages,

      hasPreviousPage:
        page > 1,
    },
  };
}

/*
|--------------------------------------------------------------------------
| Admin - Get Order By ID
|--------------------------------------------------------------------------
*/

export async function getAdminOrderById(
  orderId
) {
  const order =
    await prisma.order.findUnique({
      where: {
        id:
          orderId,
      },

      select:
        ORDER_DETAIL_SELECT,
    });

  if (!order) {
    throw new AppError(
      "Order not found",
      404,
      "ORDER_NOT_FOUND"
    );
  }

  return serializeOrder(
    order
  );
}