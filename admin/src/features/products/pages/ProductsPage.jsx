import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { appToast } from "../../../lib/toast";

import {
  useAdminCategories,
} from "../../categories/hooks/useAdminCategories";

import ProductMobileCard from "../components/ProductMobileCard";
import ProductsTable from "../components/ProductsTable";
import ProductsToolbar from "../components/ProductsToolbar";

import {
  useAdminProducts,
  useDeleteAdminProduct,
} from "../hooks/useAdminProducts";

export default function ProductsPage() {
  const navigate =
    useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  |
  | searchInput:
  | القيمة المكتوبة في الـinput.
  |
  | search:
  | القيمة اللي اتعمل لها Submit
  | واللي فعلاً تروح للـBackend.
  |--------------------------------------------------------------------------
  */

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("all");

  /*
  |--------------------------------------------------------------------------
  | Delete Modal
  |--------------------------------------------------------------------------
  */

  const [
    deleteModal,
    setDeleteModal,
  ] = useState({
    isOpen: false,
    product: null,
  });

  /*
  |--------------------------------------------------------------------------
  | Queries
  |--------------------------------------------------------------------------
  */

  const {
    data: categories = [],
    isLoading:
      isCategoriesLoading,
  } =
    useAdminCategories();

  const {
    data: products = [],
    isLoading:
      isProductsLoading,
    isError:
      isProductsError,
    error:
      productsError,
  } =
    useAdminProducts({
      search:
        search ||
        undefined,

      categorySlug:
        category === "all"
          ? undefined
          : category,
    });

  /*
  |--------------------------------------------------------------------------
  | Mutations
  |--------------------------------------------------------------------------
  */

  const deleteProductMutation =
    useDeleteAdminProduct();

  /*
  |--------------------------------------------------------------------------
  | Navigation
  |--------------------------------------------------------------------------
  */

  const handleAddProduct = () => {
    navigate(
      "/products/new",
    );
  };

  const handleEditProduct = (
    product,
  ) => {
    navigate(
      `/products/${product.id}/edit`,
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const handleSearchSubmit =
    () => {
      setSearch(
        searchInput.trim(),
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleOpenDeleteProduct = (
    product,
  ) => {
    setDeleteModal({
      isOpen: true,
      product,
    });
  };

  const handleCloseDeleteProduct =
    () => {
      if (
        deleteProductMutation.isPending
      ) {
        return;
      }

      setDeleteModal({
        isOpen: false,
        product: null,
      });
    };

  const handleConfirmDeleteProduct =
    async () => {
      const product =
        deleteModal.product;

      if (
        !product ||
        deleteProductMutation.isPending
      ) {
        return;
      }

      try {
        await deleteProductMutation.mutateAsync(
          product.id,
        );

        appToast.success(
          `تم حذف منتج ${product.name}`,
        );

        setDeleteModal({
          isOpen: false,
          product: null,
        });
      } catch (error) {
        const errorCode =
          error?.response
            ?.data
            ?.error
            ?.code;

        if (
          errorCode ===
          "PRODUCT_NOT_FOUND"
        ) {
          appToast.error(
            "المنتج غير موجود أو تم حذفه بالفعل",
          );

          setDeleteModal({
            isOpen: false,
            product: null,
          });

          return;
        }

        appToast.error(
          "تعذر حذف المنتج، حاول مرة أخرى",
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

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
          search={
            searchInput
          }
          onSearchChange={
            setSearchInput
          }
          onSearchSubmit={
            handleSearchSubmit
          }
          category={
            category
          }
          onCategoryChange={
            setCategory
          }
          categories={
            categories
          }
          onAddProduct={
            handleAddProduct
          }
        />

        {isProductsLoading ||
        isCategoriesLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <p className="text-sm font-semibold text-slate-500">
              جاري تحميل المنتجات...
            </p>
          </div>
        ) : isProductsError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center">
            <p className="text-sm font-semibold text-red-700">
              تعذر تحميل المنتجات
            </p>

            {productsError
              ?.response
              ?.data
              ?.error
              ?.message ? (
              <p className="mt-2 text-xs text-red-500">
                {
                  productsError
                    .response
                    .data
                    .error
                    .message
                }
              </p>
            ) : null}
          </div>
        ) : products.length >
          0 ? (
          <>
            <ProductsTable
              products={
                products
              }
              onEdit={
                handleEditProduct
              }
              onDelete={
                handleOpenDeleteProduct
              }
            />

            <div className="space-y-3 md:hidden">
              {products.map(
                (product) => (
                  <ProductMobileCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                    onEdit={
                      handleEditProduct
                    }
                    onDelete={
                      handleOpenDeleteProduct
                    }
                  />
                ),
              )}
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
        isOpen={
          deleteModal.isOpen
        }
        title="حذف المنتج"
        description={
          deleteModal.product
            ? `هل تريد حذف المنتج "${deleteModal.product.name}" نهائيًا؟`
            : ""
        }
        confirmText={
          deleteProductMutation.isPending
            ? "جاري الحذف..."
            : "نعم، حذف المنتج"
        }
        cancelText="إلغاء"
        variant="danger"
        onClose={
          handleCloseDeleteProduct
        }
        onConfirm={
          handleConfirmDeleteProduct
        }
      />
    </>
  );
}