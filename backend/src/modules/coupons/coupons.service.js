import {
  prisma,
} from "../../database/prisma.js";

import {
  AppError,
} from "../../shared/errors/AppError.js";

/*
|--------------------------------------------------------------------------
| Selects
|--------------------------------------------------------------------------
*/

const COUPON_SELECT = {
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

  createdAt: true,
  updatedAt: true,

  _count: {
    select: {
      usages: true,
    },
  },
};

/*
|--------------------------------------------------------------------------
| Serialization
|--------------------------------------------------------------------------
*/

function serializeCoupon(
  coupon,
) {
  return {
    id:
      coupon.id,

    code:
      coupon.code,

    discountType:
      coupon.discountType,

    value:
      Number(
        coupon.value,
      ),

    minOrderAmount:
      coupon.minOrderAmount ===
      null
        ? null
        : Number(
            coupon.minOrderAmount,
          ),

    maxDiscountAmount:
      coupon.maxDiscountAmount ===
      null
        ? null
        : Number(
            coupon.maxDiscountAmount,
          ),

    usageLimit:
      coupon.usageLimit,

    usagePerUser:
      coupon.usagePerUser,

    startsAt:
      coupon.startsAt,

    expiresAt:
      coupon.expiresAt,

    isActive:
      coupon.isActive,

    usedCount:
      coupon._count?.usages ??
      0,

    createdAt:
      coupon.createdAt,

    updatedAt:
      coupon.updatedAt,
  };
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function validateBusinessRules({
  discountType,
  value,
  startsAt,
  expiresAt,
}) {
  if (
    discountType ===
      "PERCENTAGE" &&
    Number(value) > 100
  ) {
    throw new AppError(
      "Percentage discount cannot exceed 100",
      400,
      "COUPON_PERCENTAGE_TOO_HIGH",
    );
  }

  if (
    startsAt &&
    expiresAt &&
    expiresAt <= startsAt
  ) {
    throw new AppError(
      "Coupon expiry date must be after start date",
      400,
      "COUPON_INVALID_DATE_RANGE",
    );
  }
}

/*
|--------------------------------------------------------------------------
| Admin List
|--------------------------------------------------------------------------
*/

export async function getAdminCoupons() {
  const coupons =
    await prisma.coupon.findMany({
      select:
        COUPON_SELECT,

      orderBy: {
        createdAt:
          "desc",
      },
    });

  return coupons.map(
    serializeCoupon,
  );
}

/*
|--------------------------------------------------------------------------
| Admin Detail
|--------------------------------------------------------------------------
*/

export async function getAdminCouponById(
  id,
) {
  const coupon =
    await prisma.coupon.findUnique({
      where: {
        id,
      },

      select:
        COUPON_SELECT,
    });

  if (!coupon) {
    throw new AppError(
      "Coupon not found",
      404,
      "COUPON_NOT_FOUND",
    );
  }

  return serializeCoupon(
    coupon,
  );
}

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export async function createCoupon(
  data,
) {
  validateBusinessRules({
    discountType:
      data.discountType,

    value:
      data.value,

    startsAt:
      data.startsAt,

    expiresAt:
      data.expiresAt,
  });

  try {
    const coupon =
      await prisma.coupon.create({
        data: {
          code:
            data.code
              .trim()
              .toUpperCase(),

          discountType:
            data.discountType,

          value:
            data.value,

          minOrderAmount:
            data.minOrderAmount,

          maxDiscountAmount:
            data.maxDiscountAmount,

          usageLimit:
            data.usageLimit,

          usagePerUser:
            data.usagePerUser,

          startsAt:
            data.startsAt,

          expiresAt:
            data.expiresAt,

          isActive:
            data.isActive,
        },

        select:
          COUPON_SELECT,
      });

    return serializeCoupon(
      coupon,
    );
  } catch (error) {
    if (
      error?.code ===
      "P2002"
    ) {
      throw new AppError(
        "Coupon code already exists",
        409,
        "COUPON_CODE_EXISTS",
      );
    }

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export async function updateCoupon(
  id,
  data,
) {
  const currentCoupon =
    await prisma.coupon.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        code: true,

        discountType:
          true,

        value: true,

        startsAt:
          true,

        expiresAt:
          true,
      },
    });

  if (
    !currentCoupon
  ) {
    throw new AppError(
      "Coupon not found",
      404,
      "COUPON_NOT_FOUND",
    );
  }

  const nextDiscountType =
    data.discountType ??
    currentCoupon.discountType;

  const nextValue =
    data.value ??
    Number(
      currentCoupon.value,
    );

  const nextStartsAt =
    data.startsAt !==
    undefined
      ? data.startsAt
      : currentCoupon.startsAt;

  const nextExpiresAt =
    data.expiresAt !==
    undefined
      ? data.expiresAt
      : currentCoupon.expiresAt;

  validateBusinessRules({
    discountType:
      nextDiscountType,

    value:
      nextValue,

    startsAt:
      nextStartsAt,

    expiresAt:
      nextExpiresAt,
  });

  const updateData = {};

  if (
    data.code !==
    undefined
  ) {
    updateData.code =
      data.code
        .trim()
        .toUpperCase();
  }

  if (
    data.discountType !==
    undefined
  ) {
    updateData.discountType =
      data.discountType;
  }

  if (
    data.value !==
    undefined
  ) {
    updateData.value =
      data.value;
  }

  if (
    data.minOrderAmount !==
    undefined
  ) {
    updateData.minOrderAmount =
      data.minOrderAmount;
  }

  if (
    data.maxDiscountAmount !==
    undefined
  ) {
    updateData.maxDiscountAmount =
      data.maxDiscountAmount;
  }

  if (
    data.usageLimit !==
    undefined
  ) {
    updateData.usageLimit =
      data.usageLimit;
  }

  if (
    data.usagePerUser !==
    undefined
  ) {
    updateData.usagePerUser =
      data.usagePerUser;
  }

  if (
    data.startsAt !==
    undefined
  ) {
    updateData.startsAt =
      data.startsAt;
  }

  if (
    data.expiresAt !==
    undefined
  ) {
    updateData.expiresAt =
      data.expiresAt;
  }

  if (
    data.isActive !==
    undefined
  ) {
    updateData.isActive =
      data.isActive;
  }

  try {
    const coupon =
      await prisma.coupon.update({
        where: {
          id,
        },

        data:
          updateData,

        select:
          COUPON_SELECT,
      });

    return serializeCoupon(
      coupon,
    );
  } catch (error) {
    if (
      error?.code ===
      "P2002"
    ) {
      throw new AppError(
        "Coupon code already exists",
        409,
        "COUPON_CODE_EXISTS",
      );
    }

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export async function deleteCoupon(
  id,
) {
  const coupon =
    await prisma.coupon.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        code: true,

        _count: {
          select: {
            usages:
              true,
          },
        },
      },
    });

  if (!coupon) {
    throw new AppError(
      "Coupon not found",
      404,
      "COUPON_NOT_FOUND",
    );
  }

  /*
   * لو الكوبون اتستخدم في طلب ناجح
   * ما نمسحوش من قاعدة البيانات.
   *
   * نقدر ببساطة نقفله من الـAdmin
   * عشان نحافظ على الـhistory.
   */
  if (
    coupon._count.usages >
    0
  ) {
    throw new AppError(
      "Coupon has already been used and cannot be deleted",
      409,
      "COUPON_IN_USE",
    );
  }

  await prisma.coupon.delete({
    where: {
      id,
    },
  });

  return {
    id:
      coupon.id,

    code:
      coupon.code,
  };
}