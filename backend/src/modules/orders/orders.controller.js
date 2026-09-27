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
  res
) {
  const preview =
    await previewOrder(
      req.user.id,
      req.validated.body
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
  res
) {
  const order =
    await createOrder(
      req.user.id,
      req.validated.body
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
  res
) {
  const orders =
    await getUserOrders(
      req.user.id
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
  res
) {
  const order =
    await getUserOrderById(
      req.user.id,
      req.validated.params.id
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
  res
) {
  const order =
    await updateOrderStatus(
      req.user.id,
      req.validated.params.id,
      req.validated.body
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
*/

export async function getAdminOrdersController(
  req,
  res
) {
  const orders =
    await getAdminOrders();

  res.status(200).json({
    success: true,

    data: {
      orders,
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
  res
) {
  const order =
    await getAdminOrderById(
      req.validated.params.id
    );

  res.status(200).json({
    success: true,

    data: {
      order,
    },
  });
}