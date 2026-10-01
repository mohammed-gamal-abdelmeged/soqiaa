import { Toaster } from "sonner";

import AppRouter from "./routes/AppRouter";

import {
  AdminAuthProvider,
} from "./features/auth/context/AdminAuthContext";

import {
  ProductsProvider,
} from "./features/products/context/ProductsContext";

export default function App() {
  return (
    <AdminAuthProvider>
      <ProductsProvider>
        <AppRouter />

        <Toaster
          position="top-left"
          richColors
          closeButton
          dir="rtl"
        />
      </ProductsProvider>
    </AdminAuthProvider>
  );
}