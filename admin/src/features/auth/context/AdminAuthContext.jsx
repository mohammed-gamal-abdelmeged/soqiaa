import {
  createContext,
} from "react";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminUser,
  logoutAdmin,
} from "../../../services/auth.service";

export const AdminAuthContext =
  createContext(null);

const ADMIN_AUTH_QUERY_KEY = [
  "admin",
  "auth",
  "me",
];

export function AdminAuthProvider({
  children,
}) {
  const queryClient =
    useQueryClient();

  const {
    data: user = null,
    isPending:
      isAuthLoading,
  } = useQuery({
    queryKey:
      ADMIN_AUTH_QUERY_KEY,

    queryFn:
      getAdminUser,

    staleTime:
      5 * 60 * 1000,

    retry: false,
  });

  const isAuthenticated =
    Boolean(user);

  const setAuthData = (
    authenticatedUser,
  ) => {
    queryClient.setQueryData(
      ADMIN_AUTH_QUERY_KEY,
      authenticatedUser,
    );
  };

  const logout =
    async () => {
      await logoutAdmin();

      /*
       * Remove all cached admin data
       * from the previous session,
       * while keeping the auth query
       * itself under our control.
       */
      queryClient.removeQueries({
        predicate: (query) =>
          query.queryKey[0] ===
            "admin" &&
          query.queryKey[1] !==
            "auth",
      });

      queryClient.setQueryData(
        ADMIN_AUTH_QUERY_KEY,
        null,
      );
    };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        setAuthData,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}