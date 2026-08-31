import { createContext, useMemo, useState } from 'react'
import { showSuccess } from '../../../lib/toast'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addToCart = (product, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id,
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        )
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity,
        },
      ]
    })

    showSuccess(
      `تم إضافة ${product.name} للسلة`,
    );

  }

  const removeFromCart = (productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    )
  }

  const increaseQuantity = (productId) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    )
  }

  const decreaseQuantity = (productId) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getFinalPrice = (product) => {
    if (!product.discountPercentage) {
      return product.price
    }

    return Math.round(
      product.price -
        product.price * (product.discountPercentage / 100),
    )
  }

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      return (
        total +
        getFinalPrice(item) * item.quantity
      )
    }, 0)
  }, [items])

  const totalItems = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity,
      0,
    )
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        totalItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getFinalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}