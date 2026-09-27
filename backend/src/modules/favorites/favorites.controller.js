import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "./favorites.service.js";

/*
|--------------------------------------------------------------------------
| Get Favorites
|--------------------------------------------------------------------------
*/

export async function listFavorites(
  req,
  res
) {
  const favorites =
    await getFavorites(
      req.user.id
    );

  res.status(200).json({
    success: true,

    data: {
      favorites,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Add Favorite
|--------------------------------------------------------------------------
*/

export async function addFavoriteController(
  req,
  res
) {
  const favorite =
    await addFavorite(
      req.user.id,
      req.validated.body.productId
    );

  res.status(201).json({
    success: true,

    message:
      "Product added to favorites successfully",

    data: {
      favorite,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Remove Favorite
|--------------------------------------------------------------------------
*/

export async function removeFavoriteController(
  req,
  res
) {
  const {
    productId,
  } =
    req.validated.params;

  const result =
    await removeFavorite(
      req.user.id,
      productId
    );

  res.status(200).json({
    success: true,

    message:
      "Product removed from favorites successfully",

    data: result,
  });
}