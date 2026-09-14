import {
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { appToast } from "../../../lib/toast";

import ProductMobileCard from "../components/ProductMobileCard";
import ProductsTable from "../components/ProductsTable";
import ProductsToolbar from "../components/ProductsToolbar";

import { categoriesMock } from "../../categories/data/categories.mock";
import { productsMock } from "../data/products.mock";

import { filterProducts } from "../utils/productFilters";

export default function ProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState(
    () => [...productsMock],
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [deleteModal, setDeleteModal] =
    useState({
      isOpen: false,
      product: null,
    });

  const filteredProducts = useMemo(
    () =>
      filterProducts({
        products,
        search,
        category,
      }),
    [products, search, category],
  );

  const handleAddProduct = () => {
    navigate("/products/new");
  };

  const handleEditProduct = (product) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleOpenDeleteProduct = (product) => {
    setDeleteModal({
      isOpen: true,
      product,
    });
  };

  const handleCloseDeleteProduct = () => {
    setDeleteModal({
      isOpen: false,
      product: null,
    });
  };

  const handleConfirmDeleteProduct = () => {
    const product = deleteModal.product;

    if (!product) return;

    setProducts((current) =>
      current.filter(
        (item) => item.id !== product.id,
      ),
    );

    appToast.success(
      `تم حذف منتج ${product.name}`,
    );

    handleCloseDeleteProduct();
  };

  return (
    <>
      <div className="space-y-6">
        <header>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            إدارة المنتجات
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            عرض وإدارة جميع المنتجات المتاحة في المتجر
          </p>
        </header>

        <ProductsToolbar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          categories={categoriesMock}
          onAddProduct={handleAddProduct}
        />

        {filteredProducts.length > 0 ? (
          <>
            <ProductsTable
              products={filteredProducts}
              onEdit={handleEditProduct}
              onDelete={handleOpenDeleteProduct}
            />

            <div className="space-y-3 md:hidden">
              {filteredProducts.map((product) => (
                <ProductMobileCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleOpenDeleteProduct}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-sm font-semibold text-slate-700">
              لا توجد منتجات مطابقة
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title="حذف المنتج"
        description={
          deleteModal.product
            ? `هل تريد حذف المنتج "${deleteModal.product.name}"؟`
            : ""
        }
        confirmText="نعم، حذف المنتج"
        cancelText="إلغاء"
        variant="danger"
        onClose={handleCloseDeleteProduct}
        onConfirm={handleConfirmDeleteProduct}
      />
    </>
  );
}