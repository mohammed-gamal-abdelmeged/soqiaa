import api from "./api";

/*
|--------------------------------------------------------------------------
| Create Admin Account
|--------------------------------------------------------------------------
*/

export async function createAdminAccount(
  payload,
) {
  const response =
    await api.post(
      "/admin/accounts",
      payload,
    );

  return (
    response.data.data
      .admin
  );
}