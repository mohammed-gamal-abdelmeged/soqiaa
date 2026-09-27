import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { requireCsrf } from "../../middlewares/requireCsrf.js";
import { validate } from "../../middlewares/validate.js";

import {
  addFavoriteController,
  listFavorites,
  removeFavoriteController,
} from "./favorites.controller.js";

import {
  addFavoriteSchema,
  favoriteProductParamsSchema,
} from "./favorites.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Favorites
|--------------------------------------------------------------------------
*/

router.get(
  "/favorites",
  authenticate,
  listFavorites
);

router.post(
  "/favorites",
  authenticate,
  requireCsrf,

  validate(
    addFavoriteSchema,
    "body"
  ),

  addFavoriteController
);

router.delete(
  "/favorites/:productId",
  authenticate,
  requireCsrf,

  validate(
    favoriteProductParamsSchema,
    "params"
  ),

  removeFavoriteController
);

export default router;