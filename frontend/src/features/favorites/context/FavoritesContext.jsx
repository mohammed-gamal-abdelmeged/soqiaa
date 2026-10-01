import {
  createContext,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  showError,
} from "../../../lib/toast";

import {
  queryKeys,
} from "../../../lib/queryKeys";

import {
  cacheTimes,
} from "../../../lib/cacheTimes";

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../../services/favorites.service";

import {
  useAuth,
} from "../../auth/context/useAuth";

export const FavoritesContext =
  createContext(null);

export function FavoritesProvider({
  children,
}) {
  const queryClient =
    useQueryClient();

  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const {
    data: favorites = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey:
      queryKeys.favorites,

    queryFn:
      getFavorites,

    staleTime:
      cacheTimes.favorites,

    enabled:
      isAuthenticated &&
      !isAuthLoading,

    retry: false,
  });

  const addMutation =
    useMutation({
      mutationFn:
        addFavorite,

      onSuccess(favorite) {
        queryClient.setQueryData(
          queryKeys.favorites,
          (currentFavorites = []) => {
            const exists =
              currentFavorites.some(
                (item) =>
                  item.id ===
                  favorite.id,
              );

            if (exists) {
              return currentFavorites;
            }

            return [
              favorite,
              ...currentFavorites,
            ];
          },
        );
      },
    });

  const removeMutation =
    useMutation({
      mutationFn:
        removeFavorite,

      onSuccess(result) {
        queryClient.setQueryData(
          queryKeys.favorites,
          (currentFavorites = []) =>
            currentFavorites.filter(
              (item) =>
                item.id !==
                result.productId,
            ),
        );
      },
    });

  const isFavorite = (
    productId,
  ) => {
    return favorites.some(
      (item) =>
        item.id ===
        productId,
    );
  };

  const toggleFavorite = async (
    product,
  ) => {
    if (!isAuthenticated) {
      showError(
        "سجل دخولك الأول عشان تستخدم المفضلة",
      );

      return;
    }

    const exists =
      favorites.some(
        (item) =>
          item.id ===
          product.id,
      );

    try {
      if (exists) {
        await removeMutation.mutateAsync(
          product.id,
        );

        return;
      }

      await addMutation.mutateAsync(
        product.id,
      );
    } catch (mutationError) {
      showError(
        mutationError?.message ||
          "تعذر تحديث المفضلة",
      );
    }
  };

  const favoritesCount =
    favorites.length;

  const value = {
    favorites,
    favoritesCount,
    toggleFavorite,
    isFavorite,

    isFavoritesLoading:
      isAuthLoading ||
      (
        isAuthenticated &&
        isPending
      ),

    isFavoritesError:
      isError,

    favoritesError:
      error,

    isFavoritesUpdating:
      addMutation.isPending ||
      removeMutation.isPending,
  };

  return (
    <FavoritesContext.Provider
      value={value}
    >
      {children}
    </FavoritesContext.Provider>
  );
}