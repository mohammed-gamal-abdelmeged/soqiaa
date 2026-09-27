import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { validate } from "../../middlewares/validate.js";
import { requireCsrf } from "../../middlewares/requireCsrf.js";

import {
  csrf,
  login,
  logout,
  me,
  register,
} from "./auth.controller.js";

import {
  loginSchema,
  registerSchema,
} from "./auth.validation.js";

import {
  loginRateLimiter,
  registerRateLimiter,
} from "../../middlewares/rateLimiters.js";

const router = Router();

router.post(
  "/register",
  registerRateLimiter,
  validate(registerSchema),
  register
);

router.post(
  "/login",
  loginRateLimiter,
  validate(loginSchema),
  login
);

router.get(
  "/me",
  authenticate,
  me
);

router.post(
  "/logout",
  authenticate,
  requireCsrf,
  logout
);
router.get(
  "/csrf",
  authenticate,
  csrf
);

export default router;