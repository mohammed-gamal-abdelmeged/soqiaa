import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CategoriesPage from "../features/categories/pages/CategoriesPage";
import CategoryDetailsPage from "../features/categories/pages/CategoryDetailsPage";
import ProductsPage from "../features/products/pages/ProductsPage";
import ProductFormPage from "../features/products/pages/ProductFormPage";
import OffersPage from "../features/offers/pages/OffersPage";
import BestSellersPage from "../features/bestSellers/pages/BestSellersPage";
import OrdersPage from "../features/orders/pages/OrdersPage";
import AdminLayout from "../layouts/AdminLayout";
import OrderDetailsPage from "../features/orders/pages/OrderDetailsPage";
import CustomersPage from "../features/customers/pages/CustomersPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
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