import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import {
  appToast,
} from "../../../lib/toast";

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
  | النص اللي الأدمن بيكتبه فقط.
  |
  | submittedSearch:
  | النص اللي تم تنفيذ البحث به.
  |
  | الكتابة وحدها لا تغير Query Key
  | وبالتالي لا تعمل Request.
  |--------------------------------------------------------------------------
  */

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    submittedSearch,
    setSubmittedSearch,
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
    isFetching:
      isProductsFetching,
    isError:
      isProductsError,
    error:
      productsError,
  } =
    useAdminProducts({
      search:
        submittedSearch ||
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

  function handleSearchSubmit() {
    const normalizedSearch =
      searchInput.trim();

    setSubmittedSearch(
      normalizedSearch,
    );
  }

  function handleClearSearch() {
    setSearchInput("");
    setSubmittedSearch("");
  }

  /*
  |--------------------------------------------------------------------------
  | Category Filter
  |--------------------------------------------------------------------------
  */

  function handleCategoryChange(
    nextCategory,
  ) {
    setCategory(
      nextCategory,
    );
  }

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
        deleteProductMutation
          .isPending
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
        deleteProductMutation
          .isPending
      ) {
        return;
      }

      try {
        await deleteProductMutation
          .mutateAsync(
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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                إدارة المنتجات
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                عرض وإدارة جميع المنتجات المتاحة في المتجر
              </p>
            </div>

            {isProductsFetching &&
              !isProductsLoading && (
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

                جاري التحديث...
              </div>
            )}
          </div>
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
          onSearchClear={
            handleClearSearch
          }
          category={
            category
          }
          onCategoryChange={
            handleCategoryChange
          }
          categories={
            categories
          }
          onAddProduct={
            handleAddProduct
          }
        />

        {submittedSearch && (
          <div className="flex items-center gap-2 text-xs text-violet-600">
            نتائج البحث عن "
            {
              submittedSearch
            }
            "
          </div>
        )}

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
          <div
            className={[
              isProductsFetching
                ? "opacity-70"
                : "",
              "transition-opacity",
            ].join(
              " ",
            )}
          >
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

            <div className="mt-3 space-y-3 md:hidden">
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
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-sm font-semibold text-slate-700">
              لا توجد منتجات مطابقة
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {submittedSearch
                ? `لا يوجد منتج مطابق للبحث عن "${submittedSearch}"`
                : "لا توجد منتجات مطابقة للفلاتر الحالية"}
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
          deleteProductMutation
            .isPending
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