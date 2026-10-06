import {
  createAdminAccount,
} from "./adminAccounts.service.js";

export async function createAdminAccountController(
  req,
  res,
) {
  const admin =
    await createAdminAccount(
      req.validated.body,
    );

  res.status(201).json({
    success: true,

    message:
      "Admin account created successfully",

    data: {
      admin,
    },
  });
}