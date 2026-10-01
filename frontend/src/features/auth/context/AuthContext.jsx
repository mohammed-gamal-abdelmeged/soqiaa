import { createContext } from "react";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import api from "../../../services/api";

export const AuthContext =
  createContext(null);

const AUTH_QUERY_KEY = [
  "auth",
  "me",
];

async function getAuthenticatedUser() {
  const response =
    await api.get("/auth/me");

  return response.data.data.user;
}

export function AuthProvider({
  children,
}) {
  const queryClient =
    useQueryClient();

  const {
    data: user = null,
    isPending: isAuthLoading,
  } = useQuery({
    queryKey:
      AUTH_QUERY_KEY,

    queryFn:
      getAuthenticatedUser,

    staleTime:
      5 * 60 * 1000,

    retry: false,
  });

  const isAuthenticated =
    Boolean(user);

  /*
   * Login already returns the user.
   * We put it directly in the auth cache
   * instead of making another /auth/me request.
   */
  const setAuthData = ({
    user: authenticatedUser,
  }) => {
    queryClient.setQueryData(
      AUTH_QUERY_KEY,
      authenticatedUser,
    );
  };

  const updateUser = (
    updatedData,
  ) => {
    queryClient.setQueryData(
      AUTH_QUERY_KEY,
      (currentUser) => {
        if (!currentUser) {
          return currentUser;
        }

        return {
          ...currentUser,
          ...updatedData,
        };
      },
    );
  };

  const logout = async () => {
    await api.post(
      "/auth/logout",
    );

    /*
     * Clear authenticated data only.
     *
     * Public catalog cache such as
     * products/categories stays intact.
     */
    queryClient.setQueryData(
      AUTH_QUERY_KEY,
      null,
    );

    queryClient.removeQueries({
      queryKey: ["profile"],
    });

    queryClient.removeQueries({
      queryKey: ["cart"],
    });

    queryClient.removeQueries({
      queryKey: ["favorites"],
    });

    queryClient.removeQueries({
      queryKey: ["orders"],
    });
  };

  const value = {
    user,
    isAuthenticated,
    isAuthLoading,
    setAuthData,
    updateUser,
    logout,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}