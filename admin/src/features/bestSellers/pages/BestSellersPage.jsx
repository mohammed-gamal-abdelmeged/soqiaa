import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import Modal from "../../../components/ui/Modal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import { appToast } from "../../../lib/toast";

import BestSellerForm from "../components/BestSellerForm";
import BestSellersTable from "../components/BestSellersTable";
import BestSellerMobileCard from "../components/BestSellerMobileCard";

import { categoriesMock } from "../../categories/data/categories.mock";
import { categoryDetailsMock } from "../../categories/data/categoryDetails.mock";

import { useProducts } from "../../products/context/ProductsContext";

export default function BestSellersPage() {
  const {
    products,
    updateProduct,
  } = useProducts();

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const [
    removeConfirm,
    setRemoveConfirm,
  ] = useState({
    isOpen: false,
    product: null,
  });

  const bestSellerProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.isBestSeller === true,
    );
  }, [products]);

  function handleOpenAddModal() {
    setIsAddModalOpen(true);
  }

  function handleCloseAddModal() {
    setIsAddModalOpen(false);
  }

  function handleAddBestSeller({
    productId,
  }) {
    const product = products.find(
      (item) =>
        String(item.id) ===
        String(productId),
    );

    if (!product) return;

    if (product.isBestSeller) {
      appToast.error(
        "المنتج موجود بالفعل في الأكثر مبيعاً",
      );
      return;
    }

    updateProduct(product.id, {
      isBestSeller: true,
    });

    appToast.success(
      `تم إضافة ${product.name} إلى الأكثر مبيعاً`,
    );

    setIsAddModalOpen(false);
  }

  function handleToggleBestSeller(
    product,
    value,
  ) {
    if (value === true) {
      updateProduct(product.id, {
        isBestSeller: true,
      });

      appToast.success(
        `تم إضافة ${product.name} إلى الأكثر مبيعاً`,
      );

      return;
    }

    setRemoveConfirm({
      isOpen: true,
      product,
    });
  }

  function handleCloseRemoveConfirm() {
    setRemoveConfirm({
      isOpen: false,
      product: null,
    });
  }

  function handleConfirmRemove() {
    const product =
      removeConfirm.product;

    if (!product) return;

    updateProduct(product.id, {
      isBestSeller: false,
    });

    appToast.success(
      `تم إزالة ${product.name} من الأكثر مبيعاً`,
    );

    handleCloseRemoveConfirm();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            الأكثر مبيعاً
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            إدارة المنتجات التي تظهر ضمن
            الأكثر مبيعاً
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className={[
            "inline-flex items-center justify-center",
            "gap-2 rounded-xl bg-emerald-700",
            "px-4 py-3 text-sm font-semibold",
            "text-white transition",
            "hover:bg-emerald-800",
            "focus:outline-none focus:ring-2",
            "focus:ring-emerald-200",
          ].join(" ")}
        >
          <Plus size={18} />

          إضافة منتج
        </button>
      </div>

      {bestSellerProducts.length > 0 ? (
        <>
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

          <div className="grid gap-4 md:hidden">
            {bestSellerProducts.map(
              (product) => (
                <BestSellerMobileCard
                  key={product.id}
                  product={product}
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

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="إضافة منتج للأكثر مبيعاً"
        footer={
          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                handleCloseAddModal
              }
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              form="best-seller-form"
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              إضافة المنتج
            </button>
          </div>
        }
      >
        <BestSellerForm
          categories={categoriesMock}
          categoryDetails={
            categoryDetailsMock
          }
          products={products}
          onSubmit={
            handleAddBestSeller
          }
        />
      </Modal>

      <ConfirmDialog
        isOpen={removeConfirm.isOpen}
        onClose={
          handleCloseRemoveConfirm
        }
        onConfirm={
          handleConfirmRemove
        }
        title="إزالة من الأكثر مبيعاً"
        message={
          removeConfirm.product
            ? `هل تريد إزالة المنتج "${removeConfirm.product.name}" من الأكثر مبيعاً؟`
            : ""
        }
        confirmText="إزالة"
        cancelText="إلغاء"
      />
    </div>
  );
}