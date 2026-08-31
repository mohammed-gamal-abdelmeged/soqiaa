import { Toaster } from 'sonner'

import AppRouter from './routes/AppRouter'

import { AuthProvider } from './features/auth/context/AuthContext'
import { CartProvider } from './features/cart/context/CartContext'
import { FavoritesProvider } from './features/favorites/context/FavoritesContext'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <AppRouter />

          <Toaster
            position="top-center"
            richColors
            closeButton
            duration={3000}
          />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App