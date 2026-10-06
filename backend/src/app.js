import path from "node:path";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";

import authRouter from "./modules/auth/auth.routes.js";
import adminRouter from "./modules/admin/admin.routes.js";
import categoriesRouter from "./modules/categories/categories.routes.js";
import productsRouter from "./modules/products/products.routes.js";
import offersRouter from "./modules/offers/offers.routes.js";
import couponsRouter from "./modules/coupons/coupons.routes.js";
import cartRouter from "./modules/cart/cart.routes.js";
import favoritesRouter from "./modules/favorites/favorites.routes.js";
import ordersRouter from "./modules/orders/orders.routes.js";
import customersRouter from "./modules/customers/customers.routes.js";
import usersRouter from "./modules/users/users.routes.js";

import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.disable(
  "x-powered-by",
);

app.use(
  helmet(),
);

const allowedOrigins = [
  env.frontendOrigin,
  env.adminOrigin,
];

app.use(
  cors({
    origin(
      origin,
      callback,
    ) {
      /*
       * Requests such as Postman, curl,
       * server-to-server requests may not
       * contain an Origin header.
       */
      if (!origin) {
        return callback(
          null,
          true,
        );
      }

      if (
        allowedOrigins.includes(
          origin,
        )
      ) {
        return callback(
          null,
          true,
        );
      }

      return callback(
        null,
        false,
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],

    credentials:
      true,
  }),
);

/*
|--------------------------------------------------------------------------
| Static Assets
|--------------------------------------------------------------------------
*/

app.use(
  "/uploads",
  express.static(
    path.resolve(
      "storage",
      "uploads",
    ),
    {
      dotfiles:
        "deny",

      index:
        false,

      maxAge:
        "1y",

      immutable:
        true,

      setHeaders(
        res,
      ) {
        res.setHeader(
          "Cross-Origin-Resource-Policy",
          "cross-origin",
        );
      },
    },
  ),
);

/*
|--------------------------------------------------------------------------
| Body Parsers
|--------------------------------------------------------------------------
*/

app.use(
  cookieParser(),
);

app.use(
  express.json({
    limit:
      "100kb",
  }),
);

app.use(
  express.urlencoded({
    extended:
      true,

    limit:
      "100kb",
  }),
);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get(
  "/api/v1/health",

  (
    req,
    res,
  ) => {
    res
      .status(200)
      .json({
        success:
          true,

        message:
          "Soqiaa API is running",
      });
  },
);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use(
  "/api/v1/auth",
  authRouter,
);

app.use(
  "/api/v1/admin",
  adminRouter,
);

/*
 * Users router contains:
 *
 * /users/me
 */
app.use(
  "/api/v1",
  usersRouter,
);

/*
 * Categories router contains:
 *
 * /categories
 * /admin/categories
 * /admin/subcategories
 */
app.use(
  "/api/v1",
  categoriesRouter,
);

/*
 * Products router contains:
 *
 * /products
 * /products/:id
 * /admin/products
 * /admin/products/:id
 */
app.use(
  "/api/v1",
  productsRouter,
);

/*
 * Offers router contains:
 *
 * /admin/offers
 * /admin/offers/:id
 */
app.use(
  "/api/v1",
  offersRouter,
);

/*
 * Coupons router contains:
 *
 * /admin/coupons
 * /admin/coupons/:id
 */
app.use(
  "/api/v1",
  couponsRouter,
);

/*
 * Cart router contains:
 *
 * /cart
 * /cart/items
 * /cart/items/:productId
 */
app.use(
  "/api/v1",
  cartRouter,
);

/*
 * Favorites router contains:
 *
 * /favorites
 * /favorites/:productId
 */
app.use(
  "/api/v1",
  favoritesRouter,
);

/*
 * Orders router contains:
 *
 * /orders/preview
 * /orders
 * /orders/:id
 */
app.use(
  "/api/v1",
  ordersRouter,
);

/*
 * Customers router contains:
 *
 * /admin/customers
 */
app.use(
  "/api/v1",
  customersRouter,
);

/*
|--------------------------------------------------------------------------
| Error Handling
|--------------------------------------------------------------------------
*/

app.use(
  notFound,
);

app.use(
  errorHandler,
);

export default app;