import {
  getAdminDashboard,
} from "./admin.service.js";

/*
|--------------------------------------------------------------------------
| Admin Access Check
|--------------------------------------------------------------------------
*/

export async function accessCheck(
  req,
  res
) {
  res.status(200).json({
    success: true,

    message:
      "Admin access granted",

    data: {
      user: req.user,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

export async function dashboard(
  req,
  res
) {
  const data =
    await getAdminDashboard();

  res.status(200).json({
    success: true,

    data,
  });
}