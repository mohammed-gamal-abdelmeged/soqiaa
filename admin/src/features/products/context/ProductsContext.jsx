// src/features/products/context/ProductsContext.jsx

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { productsMock } from "../data/products.mock";

const ProductsContext =
  createContext(null);

export function ProductsProvider({
  children,
}) {
  const [products, setProducts] =
    useState(() => [
      ...productsMock,
    ]);

  const value = useMemo(
    () => ({
      products,

      getProductById(id) {
        return products.find(
          (product) =>
            String(product.id) ===
            String(id),
        );
      },

      addProduct(product) {
        setProducts((current) => [
          ...current,
          product,
        ]);
      },

      updateProduct(id, data) {
        setProducts((current) =>
          current.map(
            (product) =>
              String(product.id) ===
              String(id)
                ? {
                    ...product,
                    ...data,

                    id: product.id,
                    slug:
                      product.slug,
                  }
                : product,
          ),
        );
      },

      deleteProduct(id) {
        setProducts((current) =>
          current.filter(
            (product) =>
              String(product.id) !==
              String(id),
          ),
        );
      },
    }),
    [products],
  );

  return (
    <ProductsContext.Provider
      value={value}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context =
    useContext(
      ProductsContext,
    );

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductsProvider",
    );
  }

  return context;
}