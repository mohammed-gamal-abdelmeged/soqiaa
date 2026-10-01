import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import AdminLoginPage from "../features/auth/pages/AdminLoginPage";

import AdminProtectedRoute from "../features/auth/components/AdminProtectedRoute";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CategoriesPage from "../features/categories/pages/CategoriesPage";
import CategoryDetailsPage from "../features/categories/pages/CategoryDetailsPage";
import ProductsPage from "../features/products/pages/ProductsPage";
import ProductFormPage from "../features/products/pages/ProductFormPage";
import OffersPage from "../features/offers/pages/OffersPage";
import BestSellersPage from "../features/bestSellers/pages/BestSellersPage";
import OrdersPage from "../features/orders/pages/OrdersPage";
import OrderDetailsPage from "../features/orders/pages/OrderDetailsPage";
import CustomersPage from "../features/customers/pages/CustomersPage";

import AdminLayout from "../layouts/AdminLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Auth */}
        <Route
          path="/login"
          element={<AdminLoginPage />}
        />

        {/* Protected Admin Area */}
        <Route
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route
            index
            element={<DashboardPage />}
          />

          <Route
            path="/categories"
            element={<CategoriesPage />}
          />

          <Route
            path="/categories/:categorySlug"
            element={<CategoryDetailsPage />}
          />

          <Route
            path="/products"
            element={<ProductsPage />}
          />

          <Route
            path="/products/new"
            element={
              <ProductFormPage mode="add" />
            }
          />

          <Route
            path="/products/:productId/edit"
            element={
              <ProductFormPage mode="edit" />
            }
          />

          <Route
            path="/offers"
            element={<OffersPage />}
          />

          <Route
            path="/best-sellers"
            element={<BestSellersPage />}
          />

          <Route
            path="/orders"
            element={<OrdersPage />}
          />

          <Route
            path="/orders/:orderId"
            element={<OrderDetailsPage />}
          />

          <Route
            path="/customers"
            element={<CustomersPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}