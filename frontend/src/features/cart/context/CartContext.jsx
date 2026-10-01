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
  showSuccess,
} from "../../../lib/toast";

import {
  queryKeys,
} from "../../../lib/queryKeys";

import {
  cacheTimes,
} from "../../../lib/cacheTimes";

import {
  addCartItem,
  clearCart as clearCartRequest,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../../../services/cart.service";

import {
  useAuth,
} from "../../auth/context/useAuth";

export const CartContext =
  createContext(null);

const EMPTY_CART = {
  items: [],
  totalItems: 0,
  subtotal: 0,
};

function getFinalPrice(product) {
  if (
    typeof product.finalPrice ===
    "number"
  ) {
    return product.finalPrice;
  }

  if (
    !product.discountPercentage
  ) {
    return product.price;
  }

  return Math.round(
    product.price -
      product.price *
        (
          product.discountPercentage /
          100
        ),
  );
}

function buildCart(items) {
  const totalItems =
    items.reduce(
      (total, item) =>
        total +
        item.quantity,
      0,
    );

  const subtotal =
    items.reduce(
      (total, item) =>
        total +
        getFinalPrice(item) *
          item.quantity,
      0,
    );

  return {
    items,
    totalItems,
    subtotal,
  };
}

function upsertCartItem(
  currentCart,
  cartItem,
) {
  const cart =
    currentCart ||
    EMPTY_CART;

  const exists =
    cart.items.some(
      (item) =>
        item.id ===
        cartItem.id,
    );

  const items =
    exists
      ? cart.items.map(
          (item) =>
            item.id ===
            cartItem.id
              ? cartItem
              : item,
        )
      : [
          ...cart.items,
          cartItem,
        ];

  return buildCart(items);
}

function removeItemFromCart(
  currentCart,
  productId,
) {
  const cart =
    currentCart ||
    EMPTY_CART;

  return buildCart(
    cart.items.filter(
      (item) =>
        item.id !==
        productId,
    ),
  );
}

export function CartProvider({
  children,
}) {
  const queryClient =
    useQueryClient();

  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const {
    data: cart = EMPTY_CART,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey:
      queryKeys.cart,

    queryFn:
      getCart,

    staleTime:
      cacheTimes.cart,

    enabled:
      isAuthenticated &&
      !isAuthLoading,

    retry: false,
  });

  const addMutation =
    useMutation({
      mutationFn:
        addCartItem,

      onSuccess(cartItem) {
        queryClient.setQueryData(
          queryKeys.cart,
          (currentCart) =>
            upsertCartItem(
              currentCart,
              cartItem,
            ),
        );
      },
    });

  const updateMutation =
    useMutation({
      mutationFn:
        updateCartItem,

      onSuccess(cartItem) {
        queryClient.setQueryData(
          queryKeys.cart,
          (currentCart) =>
            upsertCartItem(
              currentCart,
              cartItem,
            ),
        );
      },
    });

  const removeMutation =
    useMutation({
      mutationFn:
        removeCartItem,

      onSuccess(result) {
        queryClient.setQueryData(
          queryKeys.cart,
          (currentCart) =>
            removeItemFromCart(
              currentCart,
              result.productId,
            ),
        );
      },
    });

  const clearMutation =
    useMutation({
      mutationFn:
        clearCartRequest,

      onSuccess() {
        queryClient.setQueryData(
          queryKeys.cart,
          EMPTY_CART,
        );
      },
    });

  const addToCart = async (
    product,
    quantity = 1,
  ) => {
    if (!isAuthenticated) {
      showError(
        "سجل دخولك الأول عشان تضيف للسلة",
      );

      return;
    }

    try {
      await addMutation.mutateAsync({
        productId:
          product.id,

        quantity,
      });

      showSuccess(
        `تم إضافة ${product.name} للسلة`,
      );
    } catch (mutationError) {
      showError(
        mutationError?.message ||
          "تعذر إضافة المنتج للسلة",
      );
    }
  };

  const removeFromCart = async (
    productId,
  ) => {
    try {
      await removeMutation.mutateAsync(
        productId,
      );
    } catch (mutationError) {
      showError(
        mutationError?.message ||
          "تعذر حذف المنتج من السلة",
      );
    }
  };

  const increaseQuantity = async (
    productId,
  ) => {
    const currentCart =
      queryClient.getQueryData(
        queryKeys.cart,
      );

    const item =
      currentCart?.items?.find(
        (cartItem) =>
          cartItem.id ===
          productId,
      );

    if (!item) {
      return;
    }

    if (
      item.quantity >=
      item.stock
    ) {
      showError(
        "لا توجد كمية أكبر متاحة من هذا المنتج",
      );

      return;
    }

    try {
      await updateMutation.mutateAsync({
        productId,
        quantity:
          item.quantity + 1,
      });
    } catch (mutationError) {
      showError(
        mutationError?.message ||
          "تعذر تحديث الكمية",
      );
    }
  };

  const decreaseQuantity = async (
    productId,
  ) => {
    const currentCart =
      queryClient.getQueryData(
        queryKeys.cart,
      );

    const item =
      currentCart?.items?.find(
        (cartItem) =>
          cartItem.id ===
          productId,
      );

    if (
      !item ||
      item.quantity <= 1
    ) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        productId,
        quantity:
          item.quantity - 1,
      });
    } catch (mutationError) {
      showError(
        mutationError?.message ||
          "تعذر تحديث الكمية",
      );
    }
  };

  const clearCart = async () => {
    if (
      !isAuthenticated
    ) {
      return;
    }

    try {
      await clearMutation.mutateAsync();
    } catch (mutationError) {
      showError(
        mutationError?.message ||
          "تعذر تفريغ السلة",
      );
    }
  };

  const value = {
    items:
      cart.items,

    subtotal:
      cart.subtotal,

    totalItems:
      cart.totalItems,

    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getFinalPrice,

    isCartLoading:
      isAuthLoading ||
      (
        isAuthenticated &&
        isPending
      ),

    isCartError:
      isError,

    cartError:
      error,

    isCartUpdating:
      addMutation.isPending ||
      updateMutation.isPending ||
      removeMutation.isPending ||
      clearMutation.isPending,
  };

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}