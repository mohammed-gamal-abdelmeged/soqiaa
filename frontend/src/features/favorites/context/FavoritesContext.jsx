import { createContext, useMemo, useState } from 'react'

export const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  const toggleFavorite = (product) => {
    setFavorites((current) => {
      const exists = current.some(
        (item) => item.id === product.id,
      )

      if (exists) {
        return current.filter(
          (item) => item.id !== product.id,
        )
      }

      return [...current, product]
    })
  }

  const isFavorite = (productId) => {
    return favorites.some(
      (item) => item.id === productId,
    )
  }

  const favoritesCount = useMemo(
    () => favorites.length,
    [favorites],
  )

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}