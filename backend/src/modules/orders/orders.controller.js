import {
  createOrder,
  getAdminOrderById,
  getAdminOrders,
  getUserOrderById,
  getUserOrders,
  previewOrder,
  updateOrderStatus,
} from "./orders.service.js";

/*
|--------------------------------------------------------------------------
| Checkout Preview
|--------------------------------------------------------------------------
*/

export async function previewOrderController(
  req,
  res,
) {
  const preview =
    await previewOrder(
      req.user.id,
      req.validated.body,
    );

  res.status(200).json({
    success: true,

    data: {
      preview,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
*/

export async function createOrderController(
  req,
  res,
) {
  const order =
    await createOrder(
      req.user.id,
      req.validated.body,
    );

  res.status(201).json({
    success: true,

    message:
      "Order created successfully",

    data: {
      order,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Get User Orders
|--------------------------------------------------------------------------
*/

export async function getUserOrdersController(
  req,
  res,
) {
  const orders =
    await getUserOrders(
      req.user.id,
    );

  res.status(200).json({
    success: true,

    data: {
      orders,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Get User Order By ID
|--------------------------------------------------------------------------
*/

export async function getUserOrderByIdController(
  req,
  res,
) {
  const order =
    await getUserOrderById(
      req.user.id,
      req.validated.params.id,
    );

  res.status(200).json({
    success: true,

    data: {
      order,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Admin - Update Order Status
|--------------------------------------------------------------------------
*/

export async function updateOrderStatusController(
  req,
  res,
) {
  const order =
    await updateOrderStatus(
      req.user.id,
      req.validated.params.id,
      req.validated.body,
    );

  res.status(200).json({
    success: true,

    message:
      "Order status updated successfully",

    data: {
      order,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Admin - Get Orders
|--------------------------------------------------------------------------
|
| Supports:
|
| page
| limit
| status
|
| The temporary Array.isArray compatibility below means this controller
| keeps working with the current service until we upgrade the service
| to return pagination metadata in the next step.
|--------------------------------------------------------------------------
*/

export async function getAdminOrdersController(
  req,
  res,
) {
  const result =
    await getAdminOrders(
      req.validated.query,
    );

  /*
   * Current service:
   *   returns orders[]
   *
   * New paginated service:
   *   returns {
   *     orders,
   *     pagination
   *   }
   */
  const orders =
    Array.isArray(result)
      ? result
      : result.orders;

  const pagination =
    Array.isArray(result)
      ? null
      : result.pagination;

  res.status(200).json({
    success: true,

    data: {
      orders,

      ...(pagination
        ? {
            pagination,
          }
        : {}),
    },
  });
}

/*
|--------------------------------------------------------------------------
| Admin - Get Order By ID
|--------------------------------------------------------------------------
*/

export async function getAdminOrderByIdController(
  req,
  res,
) {
  const order =
    await getAdminOrderById(
      req.validated.params.id,
    );

  res.status(200).json({
    success: true,

    data: {
      order,
    },
  });
}