import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
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
        {/* Auth */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<AccountPage />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/offers" element={<OffersPage />} />

        <Route path="/best-sellers" element={<BestSellersPage />} />

        <Route path="/favorites" element={<FavoritesPage />} />

        <Route path="/my-data" element={<MyDataPage />} />

        {/* Store */}
        <Route element={<MainLayout />}>
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Route>
        <Route path="/categories/:slug" element={<CategoryProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CheckoutPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
