import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "./cart.service.js";

/*
|--------------------------------------------------------------------------
| Get Cart
|--------------------------------------------------------------------------
*/

export async function showCart(
  req,
  res
) {
  const cart =
    await getCart(
      req.user.id
    );

  res.status(200).json({
    success: true,

    data: {
      cart,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Add Cart Item
|--------------------------------------------------------------------------
*/

export async function addCartItemController(
  req,
  res
) {
  const cartItem =
    await addCartItem(
      req.user.id,
      req.validated.body
    );

  res.status(200).json({
    success: true,

    message:
      "Cart updated successfully",

    data: {
      cartItem,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Cart Item
|--------------------------------------------------------------------------
*/

export async function updateCartItemController(
  req,
  res
) {
  const {
    productId,
  } =
    req.validated.params;

  const cartItem =
    await updateCartItem(
      req.user.id,
      productId,
      req.validated.body
    );

  res.status(200).json({
    success: true,

    message:
      "Cart item updated successfully",

    data: {
      cartItem,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Remove Cart Item
|--------------------------------------------------------------------------
*/

export async function removeCartItemController(
  req,
  res
) {
  const {
    productId,
  } =
    req.validated.params;

  const result =
    await removeCartItem(
      req.user.id,
      productId
    );

  res.status(200).json({
    success: true,

    message:
      "Cart item removed successfully",

    data: result,
  });
}

/*
|--------------------------------------------------------------------------
| Clear Cart
|--------------------------------------------------------------------------
*/

export async function clearCartController(
  req,
  res
) {
  const result =
    await clearCart(
      req.user.id
    );

  res.status(200).json({
    success: true,

    message:
      "Cart cleared successfully",

    data: result,
  });
}