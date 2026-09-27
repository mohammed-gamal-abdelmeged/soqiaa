import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";
import { validate } from "../../middlewares/validate.js";

import {
  getAdminCustomersController,
} from "./customers.controller.js";

import {
  adminCustomersQuerySchema,
} from "./customers.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Admin - Get Customers
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/customers",
  authenticate,
  authorizeRole("ADMIN"),

  validate(
    adminCustomersQuerySchema,
    "query"
  ),

  getAdminCustomersController
);

export default router;