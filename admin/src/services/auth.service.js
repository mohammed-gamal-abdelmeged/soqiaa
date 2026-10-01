import api from "./api";

export async function getAdminUser() {
  const response =
    await api.get(
      "/admin/access-check",
    );

  return response.data.data.user;
}

export async function loginAdmin(
  credentials,
) {
  const response =
    await api.post(
      "/auth/login",
      credentials,
    );

  const user =
    response.data.data.user;

  /*
   * Login endpoint is shared between
   * customers and admins.
   *
   * Verify the account really has
   * admin access before keeping
   * the session.
   */
  try {
    await api.get(
      "/admin/access-check",
    );
  } catch (error) {
    /*
     * Login already created a session,
     * so remove it if this user is not
     * allowed inside the admin panel.
     */
    try {
      await api.post(
        "/auth/logout",
      );
    } catch {
      // Ignore logout failure here.
    }

    throw error;
  }

  return user;
}

export async function logoutAdmin() {
  await api.post(
    "/auth/logout",
  );
}