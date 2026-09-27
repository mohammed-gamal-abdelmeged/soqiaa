import {
  getAdminCustomers,
} from "./customers.service.js";

/*
|--------------------------------------------------------------------------
| Admin - Get Customers
|--------------------------------------------------------------------------
*/

export async function getAdminCustomersController(
  req,
  res
) {
  const data =
    await getAdminCustomers(
      req.validated.query
    );

  res.status(200).json({
    success: true,

    data,
  });
}