import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import LandingPage from "../features/landing/pages/LandingPage";

import ProtectedRoute from "../features/auth/components/ProtectedRoute";

import CategoriesPage from "../features/categories/pages/CategoriesPage";
import CategoryProductsPage from "../features/categories/pages/CategoryProductsPage";
import ProductDetailsPage from "../features/products/pages/ProductDetailsPage";
import CheckoutPage from "../features/checkout/pages/CheckoutPage";
import OrdersPage from "../features/orders/pages/OrdersPage";
import OrderDetailsPage from "../features/orders/pages/OrderDetailsPage";
import AccountPage from "../features/account/pages/AccountPage";
import FavoritesPage from "../features/account/pages/FavoritesPage";
import MyDataPage from "../features/account/pages/MyDataPage";
import HomePage from "../features/home/pages/HomePage";
import OffersPage from "../features/offers/pages/OffersPage";
import BestSellersPage from "../features/bestSellers/pages/BestSellersPage";

import MainLayout from "../layouts/MainLayout";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        {/* Protected Store */}
        <Route
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          {/* Home */}
          <Route
            path="/home"
            element={<HomePage />}
          />

          {/* Offers */}
          <Route
            path="/offers"
            element={<OffersPage />}
          />

          <Route
            path="/best-sellers"
            element={<BestSellersPage />}
          />

          {/* Main Layout Pages */}
          <Route
            element={<MainLayout />}
          >
            <Route
              path="/categories"
              element={<CategoriesPage />}
            />

            <Route
              path="/orders"
              element={<OrdersPage />}
            />
          </Route>

          {/* Categories */}
          <Route
            path="/categories/:slug"
            element={<CategoryProductsPage />}
          />

          {/* Products */}
          <Route
            path="/products/:id"
            element={<ProductDetailsPage />}
          />

          {/* User */}
          <Route
            path="/favorites"
            element={<FavoritesPage />}
          />

          <Route
            path="/profile"
            element={<AccountPage />}
          />

          <Route
            path="/my-data"
            element={<MyDataPage />}
          />

          {/* Checkout */}
          <Route
            path="/cart"
            element={<CheckoutPage />}
          />

          {/* Orders */}
          <Route
            path="/orders/:id"
            element={<OrderDetailsPage />}
          />
        </Route>

        {/* Unknown URLs */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
