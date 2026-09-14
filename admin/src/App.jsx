import { Toaster } from "sonner";

import AppRouter from "./routes/AppRouter";
import { ProductsProvider } from "./features/products/context/ProductsContext";

export default function App() {
  return (
    <ProductsProvider>
      <AppRouter />

      <Toaster
        position="top-left"
        richColors
        closeButton
        dir="rtl"
      />
    </ProductsProvider>
  );
}