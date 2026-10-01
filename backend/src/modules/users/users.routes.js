import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { requireCsrf } from "../../middlewares/requireCsrf.js";
import { validate } from "../../middlewares/validate.js";

import {
  showMyProfile,
  updateMyProfileController,
} from "./users.controller.js";

import {
  updateMyProfileSchema,
} from "./users.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| My Profile
|--------------------------------------------------------------------------
*/

router.get(
  "/users/me",
  authenticate,
  showMyProfile
);

router.patch(
  "/users/me",
  authenticate,
  requireCsrf,

  validate(
    updateMyProfileSchema,
    "body"
  ),

  updateMyProfileController
);

export default router;