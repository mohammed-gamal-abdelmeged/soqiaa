import {
  useMemo,
  useState,
} from "react";

import {
  useQueries,
} from "@tanstack/react-query";

import {
  Plus,
} from "lucide-react";

import Modal from "../../../components/ui/Modal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import {
  appToast,
} from "../../../lib/toast";

import {
  getAdminCategory,
} from "../../../services/categories.service";

import {
  cacheTimes,
} from "../../../lib/cacheTimes";

import {
  useAdminCategories,
} from "../../categories/hooks/useAdminCategories";

import {
  useAdminProducts,
  useUpdateAdminProduct,
} from "../../products/hooks/useAdminProducts";

import BestSellerForm from "../components/BestSellerForm";
import BestSellersTable from "../components/BestSellersTable";
import BestSellerMobileCard from "../components/BestSellerMobileCard";

export default function BestSellersPage() {
  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const {
    data: categories = [],
    isLoading:
      isCategoriesLoading,
    isError:
      isCategoriesError,
    error:
      categoriesError,
  } =
    useAdminCategories();

  /*
  |--------------------------------------------------------------------------
  | All Products
  |--------------------------------------------------------------------------
  |
  | محتاجين كل المنتجات عشان الـAdd Form
  | يقدر يختار منتج مش موجود في Best Sellers.
  |
  */

  const {
    data: products = [],
    isLoading:
      isProductsLoading,
    isError:
      isProductsError,
    error:
      productsError,
  } =
    useAdminProducts();

  /*
  |--------------------------------------------------------------------------
  | Best Seller Products
  |--------------------------------------------------------------------------
  |
  | القائمة الأساسية للصفحة جاية من Backend
  | باستخدام isBestSeller=true.
  |
  */

  const {
    data: bestSellerProducts = [],
    isLoading:
      isBestSellersLoading,
    isError:
      isBestSellersError,
    error:
      bestSellersError,
  } =
    useAdminProducts({
      isBestSeller: true,
    });

  /*
  |--------------------------------------------------------------------------
  | Category Details
  |--------------------------------------------------------------------------
  |
  | BestSellerForm محتاج Subcategories
  | لكل Category.
  |
  | بدل categoryDetailsMock:
  | نجيب البيانات من Backend.
  |
  */

  const categoryDetailQueries =
    useQueries({
      queries:
        categories.map(
          (category) => ({
            queryKey: [
              "admin",
              "categories",
              "detail",
              category.slug,
            ],

            queryFn: () =>
              getAdminCategory(
                category.slug,
              ),

            enabled:
              Boolean(
                category.slug,
              ),

            staleTime:
              cacheTimes.categories,
          }),
        ),
    });

  const categoryDetails =
    useMemo(() => {
      const details = {};

      categoryDetailQueries.forEach(
        (
          query,
          index,
        ) => {
          const category =
            categories[index];

          if (
            !category?.slug ||
            !query.data
          ) {
            return;
          }

          details[
            category.slug
          ] = query.data;
        },
      );

      return details;
    }, [
      categories,
      categoryDetailQueries,
    ]);

  const isCategoryDetailsLoading =
    categoryDetailQueries.some(
      (query) =>
        query.isLoading,
    );

  const categoryDetailsError =
    categoryDetailQueries.find(
      (query) =>
        query.isError,
    )?.error;

  /*
  |--------------------------------------------------------------------------
  | Add Modal
  |--------------------------------------------------------------------------
  */

  const [
    isAddModalOpen,
    setIsAddModalOpen,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Remove Confirmation
  |--------------------------------------------------------------------------
  */

  const [
    removeConfirm,
    setRemoveConfirm,
  ] = useState({
    isOpen: false,
    product: null,
  });

  /*
  |--------------------------------------------------------------------------
  | Mutation
  |--------------------------------------------------------------------------
  */

  const updateProductMutation =
    useUpdateAdminProduct();

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  const isPageLoading =
    isCategoriesLoading ||
    isProductsLoading ||
    isBestSellersLoading ||
    isCategoryDetailsLoading;

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  const isPageError =
    isCategoriesError ||
    isProductsError ||
    isBestSellersError ||
    categoryDetailQueries.some(
      (query) =>
        query.isError,
    );

  const errorMessage =
    bestSellersError
      ?.response
      ?.data
      ?.error
      ?.message ||
    productsError
      ?.response
      ?.data
      ?.error
      ?.message ||
    categoriesError
      ?.response
      ?.data
      ?.error
      ?.message ||
    categoryDetailsError
      ?.response
      ?.data
      ?.error
      ?.message;

  /*
  |--------------------------------------------------------------------------
  | Add Modal
  |--------------------------------------------------------------------------
  */

  function handleOpenAddModal() {
    setIsAddModalOpen(true);
  }

  function handleCloseAddModal() {
    if (
      updateProductMutation.isPending
    ) {
      return;
    }

    setIsAddModalOpen(false);
  }

  /*
  |--------------------------------------------------------------------------
  | Add Best Seller
  |--------------------------------------------------------------------------
  */

  async function handleAddBestSeller({
    productId,
  }) {
    if (
      updateProductMutation.isPending
    ) {
      return;
    }

    const product =
      products.find(
        (item) =>
          String(item.id) ===
          String(productId),
      );

    if (!product) {
      appToast.error(
        "المنتج غير موجود",
      );

      return;
    }

    if (
      product.isBestSeller ===
      true
    ) {
      appToast.error(
        "المنتج موجود بالفعل في الأكثر مبيعاً",
      );

      return;
    }

    try {
      await updateProductMutation.mutateAsync(
        {
          productId:
            product.id,

          isBestSeller:
            true,
        },
      );

      appToast.success(
        `تم إضافة ${product.name} إلى الأكثر مبيعاً`,
      );

      setIsAddModalOpen(
        false,
      );
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

        return;
      }

      appToast.error(
        "تعذر إضافة المنتج إلى الأكثر مبيعاً، حاول مرة أخرى",
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Toggle Best Seller
  |--------------------------------------------------------------------------
  */

  function handleToggleBestSeller(
    product,
    value,
  ) {
    if (
      updateProductMutation.isPending
    ) {
      return;
    }

    if (value === true) {
      handleAddBestSeller({
        productId:
          product.id,
      });

      return;
    }

    setRemoveConfirm({
      isOpen: true,
      product,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Close Remove Confirmation
  |--------------------------------------------------------------------------
  */

  function handleCloseRemoveConfirm() {
    if (
      updateProductMutation.isPending
    ) {
      return;
    }

    setRemoveConfirm({
      isOpen: false,
      product: null,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Confirm Remove
  |--------------------------------------------------------------------------
  */

  async function handleConfirmRemove() {
    const product =
      removeConfirm.product;

    if (
      !product ||
      updateProductMutation.isPending
    ) {
      return;
    }

    try {
      await updateProductMutation.mutateAsync(
        {
          productId:
            product.id,

          isBestSeller:
            false,
        },
      );

      appToast.success(
        `تم إزالة ${product.name} من الأكثر مبيعاً`,
      );

      setRemoveConfirm({
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

        setRemoveConfirm({
          isOpen: false,
          product: null,
        });

        return;
      }

      appToast.error(
        "تعذر إزالة المنتج من الأكثر مبيعاً، حاول مرة أخرى",
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            الأكثر مبيعاً
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            إدارة المنتجات التي تظهر
            ضمن الأكثر مبيعاً
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleOpenAddModal
          }
          disabled={
            isPageLoading ||
            updateProductMutation.isPending
          }
          className={[
            "inline-flex items-center justify-center",
            "gap-2 rounded-xl bg-emerald-700",
            "px-4 py-3 text-sm font-semibold",
            "text-white transition",
            "hover:bg-emerald-800",
            "focus:outline-none focus:ring-2",
            "focus:ring-emerald-200",
            "disabled:cursor-not-allowed",
            "disabled:opacity-60",
          ].join(" ")}
        >
          <Plus size={18} />

          إضافة منتج
        </button>
      </div>

      {/* Loading */}

      {isPageLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
          <p className="text-sm font-semibold text-slate-500">
            جاري تحميل الأكثر مبيعاً...
          </p>
        </div>
      ) : isPageError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center">
          <p className="text-sm font-semibold text-red-700">
            تعذر تحميل الأكثر مبيعاً
          </p>

          {errorMessage ? (
            <p className="mt-2 text-xs text-red-500">
              {errorMessage}
            </p>
          ) : null}
        </div>
      ) : bestSellerProducts.length >
        0 ? (
        <>
          {/* Desktop */}

          <div className="hidden md:block">
            <BestSellersTable
              products={
                bestSellerProducts
              }
              onToggle={
                handleToggleBestSeller
              }
            />
          </div>

          {/* Mobile */}

          <div className="grid gap-4 md:hidden">
            {bestSellerProducts.map(
              (product) => (
                <BestSellerMobileCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                  onToggle={
                    handleToggleBestSeller
                  }
                />
              ),
            )}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
          <p className="text-base font-semibold text-slate-700">
            لا توجد منتجات في الأكثر
            مبيعاً حالياً
          </p>

          <p className="mt-2 text-sm text-slate-500">
            يمكنك إضافة منتج جديد من زر
            إضافة منتج.
          </p>
        </div>
      )}

      {/* Add Modal */}

      <Modal
        isOpen={
          isAddModalOpen
        }
        onClose={
          handleCloseAddModal
        }
        title="إضافة منتج للأكثر مبيعاً"
        description="اختر القسم والقسم الفرعي ثم حدد المنتج الذي تريد إضافته."
        maxWidth="max-w-lg"
        footer={
          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                handleCloseAddModal
              }
              disabled={
                updateProductMutation.isPending
              }
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              إلغاء
            </button>

            <button
              type="submit"
              form="best-seller-form"
              disabled={
                updateProductMutation.isPending ||
                isPageLoading
              }
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateProductMutation.isPending
                ? "جاري الإضافة..."
                : "إضافة المنتج"}
            </button>
          </div>
        }
      >
        {isPageLoading ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-semibold text-slate-500">
              جاري تحميل البيانات...
            </p>
          </div>
        ) : (
          <BestSellerForm
            categories={
              categories
            }
            categoryDetails={
              categoryDetails
            }
            products={
              products
            }
            onSubmit={
              handleAddBestSeller
            }
          />
        )}
      </Modal>

      {/* Remove Confirmation */}

      <ConfirmDialog
        isOpen={
          removeConfirm.isOpen
        }
        onClose={
          handleCloseRemoveConfirm
        }
        onConfirm={
          handleConfirmRemove
        }
        title="إزالة من الأكثر مبيعاً"
        description={
          removeConfirm.product
            ? `هل تريد إزالة المنتج "${removeConfirm.product.name}" من الأكثر مبيعاً؟`
            : ""
        }
        confirmText={
          updateProductMutation.isPending
            ? "جاري الإزالة..."
            : "إزالة"
        }
        cancelText="إلغاء"
      />
    </div>
  );
}