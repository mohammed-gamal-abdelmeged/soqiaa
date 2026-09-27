import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";
import { requireCsrf } from "../../middlewares/requireCsrf.js";
import { validate } from "../../middlewares/validate.js";

import {
  createOfferController,
  deleteOfferController,
  listAdminOffers,
  showAdminOffer,
  updateOfferController,
} from "./offers.controller.js";

import {
  createOfferSchema,
  offerIdParamsSchema,
  updateOfferSchema,
} from "./offers.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Admin Offers
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/offers",
  authenticate,
  authorizeRole("ADMIN"),
  listAdminOffers
);

router.get(
  "/admin/offers/:id",
  authenticate,
  authorizeRole("ADMIN"),

  validate(
    offerIdParamsSchema,
    "params"
  ),

  showAdminOffer
);

router.post(
  "/admin/offers",
  authenticate,
  requireCsrf,
  authorizeRole("ADMIN"),

  validate(
    createOfferSchema,
    "body"
  ),

  createOfferController
);

router.patch(
  "/admin/offers/:id",
  authenticate,
  requireCsrf,
  authorizeRole("ADMIN"),

  validate(
    offerIdParamsSchema,
    "params"
  ),

  validate(
    updateOfferSchema,
    "body"
  ),

  updateOfferController
);

router.delete(
  "/admin/offers/:id",
  authenticate,
  requireCsrf,
  authorizeRole("ADMIN"),

  validate(
    offerIdParamsSchema,
    "params"
  ),

  deleteOfferController
);

export default router;