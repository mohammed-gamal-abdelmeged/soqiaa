import { useState } from "react";

import { Link, Navigate, useParams } from "react-router-dom";

import { ChevronLeft } from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Modal from "../../../components/ui/Modal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import { appToast } from "../../../lib/toast";

import { queryKeys } from "../../../lib/queryKeys";

import { cacheTimes } from "../../../lib/cacheTimes";

import {
  createAdminSubcategory,
  deleteAdminSubcategory,
  getAdminCategory,
  updateAdminSubcategory,
} from "../../../services/categories.service";

import CategoryDetailsHeader from "../components/CategoryDetailsHeader";
import CategoryDetailsTabs from "../components/CategoryDetailsTabs";
import CategoryInfoPanel from "../components/CategoryInfoPanel";
import CategoryProductsPanel from "../components/CategoryProductsPanel";
import SubcategoriesPanel from "../components/SubcategoriesPanel";
import SubcategoryForm from "../components/SubcategoryForm";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getCategoryDetailQueryKey(slug) {
  return [...queryKeys.categories, "detail", slug];
}

function sortSubcategories(subcategories) {
  return [...subcategories].sort((firstSubcategory, secondSubcategory) => {
    const sortDifference =
      firstSubcategory.sortOrder - secondSubcategory.sortOrder;

    if (sortDifference !== 0) {
      return sortDifference;
    }

    if (firstSubcategory.isActive !== secondSubcategory.isActive) {
      return firstSubcategory.isActive ? -1 : 1;
    }

    return 0;
  });
}

function getApiErrorMessage(error, fallback) {
  return error?.response?.data?.error?.message ?? error?.message ?? fallback;
}

export default function CategoryDetailsPage() {
  const { categorySlug } = useParams();

  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("subcategories");

  /*
  |--------------------------------------------------------------------------
  | Form Modal
  |--------------------------------------------------------------------------
  */

  const [formModal, setFormModal] = useState({
    isOpen: false,
    mode: "add",
    subcategory: null,
  });

  /*
  |--------------------------------------------------------------------------
  | Delete Modal
  |--------------------------------------------------------------------------
  */

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    subcategory: null,
  });

  const [conflictModal, setConflictModal] = useState({
    isOpen: false,
    subcategory: null,
    error: null,
  });

  /*
  |--------------------------------------------------------------------------
  | Category Query
  |--------------------------------------------------------------------------
  */

  const detailQueryKey = getCategoryDetailQueryKey(categorySlug);

  const {
    data: category,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: detailQueryKey,

    queryFn: () => getAdminCategory(categorySlug),

    enabled: Boolean(categorySlug),

    staleTime: cacheTimes.categories,
  });

  /*
  |--------------------------------------------------------------------------
  | Create Subcategory
  |--------------------------------------------------------------------------
  */

  const {
    mutateAsync: createSubcategory,

    isPending: isCreating,
  } = useMutation({
    mutationFn: createAdminSubcategory,

    onSuccess: (createdSubcategory) => {
      queryClient.setQueryData(detailQueryKey, (currentCategory) => {
        if (!currentCategory) {
          return currentCategory;
        }

        return {
          ...currentCategory,

          subcategories: sortSubcategories([
            ...(currentCategory.subcategories ?? []),

            createdSubcategory,
          ]),
        };
      });
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Update Subcategory
  |--------------------------------------------------------------------------
  */

  const {
    mutateAsync: updateSubcategory,

    isPending: isUpdating,
  } = useMutation({
    mutationFn: updateAdminSubcategory,

    onSuccess: (updatedSubcategory) => {
      const { replacement, ...subcategoryForCache } = updatedSubcategory;

      const movedSubcategory = replacement?.movedSubcategory ?? null;

      queryClient.setQueryData(detailQueryKey, (currentCategory) => {
        if (!currentCategory) {
          return currentCategory;
        }

        return {
          ...currentCategory,

          subcategories: sortSubcategories(
            (currentCategory.subcategories ?? []).map((subcategory) => {
              if (subcategory.id === subcategoryForCache.id) {
                return subcategoryForCache;
              }

              if (movedSubcategory && subcategory.id === movedSubcategory.id) {
                return movedSubcategory;
              }

              return subcategory;
            }),
          ),
        };
      });
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Delete Subcategory
  |--------------------------------------------------------------------------
  */

  const {
    mutateAsync: deleteSubcategory,

    isPending: isDeleting,
  } = useMutation({
    mutationFn: deleteAdminSubcategory,

    onSuccess: (deletedSubcategory) => {
      queryClient.setQueryData(detailQueryKey, (currentCategory) => {
        if (!currentCategory) {
          return currentCategory;
        }

        return {
          ...currentCategory,

          subcategories: (currentCategory.subcategories ?? []).filter(
            (subcategory) => subcategory.id !== deletedSubcategory.id,
          ),
        };
      });
    },
  });

  const isSaving = isCreating || isUpdating;

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Not Found
  |--------------------------------------------------------------------------
  */

  if (isError && error?.response?.status === 404) {
    return <Navigate to="/categories" replace />;
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (isError || !category) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">تعذر تحميل بيانات القسم</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const subcategories = category.subcategories ?? [];

  /*
   * الـBackend الحالي لتفاصيل القسم
   * لا يرجع Products حتى الآن.
   *
   * لو أضفناها لاحقًا، الصفحة
   * ستلتقطها تلقائيًا.
   */
  const products = category.products ?? [];

  /*
  |--------------------------------------------------------------------------
  | Form Actions
  |--------------------------------------------------------------------------
  */

  function handleOpenAdd() {
    if (isSaving) {
      return;
    }

    setFormModal({
      isOpen: true,
      mode: "add",
      subcategory: null,
    });
  }

  function handleOpenEdit(subcategory) {
    if (isSaving) {
      return;
    }

    setFormModal({
      isOpen: true,
      mode: "edit",
      subcategory,
    });
  }

  function handleCloseForm() {
    if (isSaving) {
      return;
    }

    setFormModal({
      isOpen: false,
      mode: "add",
      subcategory: null,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Submit Subcategory
  |--------------------------------------------------------------------------
  */

  async function handleSubmitSubcategory({ name }) {
    if (isSaving) {
      return;
    }

    try {
      /*
       * Create
       */
      if (formModal.mode === "add") {
        await createSubcategory({
          categoryId: category.id,

          name,
        });

        appToast.success(`تم إضافة قسم ${name} الفرعي`);

        setFormModal({
          isOpen: false,
          mode: "add",
          subcategory: null,
        });

        return;
      }

      /*
       * Update
       */
      const editedSubcategory = formModal.subcategory;

      if (!editedSubcategory) {
        return;
      }

      await updateSubcategory({
        subcategoryId: editedSubcategory.id,

        data: {
          name,
        },
      });

      appToast.success(`تم تعديل قسم ${name} الفرعي`);

      setFormModal({
        isOpen: false,
        mode: "add",
        subcategory: null,
      });
    } catch (mutationError) {
      appToast.error(
        getApiErrorMessage(mutationError, "تعذر حفظ القسم الفرعي"),
      );
    }
  }

  async function handleToggleSubcategory(subcategory) {
    if (isSaving) {
      return;
    }

    try {
      await updateSubcategory({
        subcategoryId: subcategory.id,

        data: {
          isActive: !subcategory.isActive,
        },
      });

      appToast.success(
        subcategory.isActive
          ? `تم تعطيل قسم ${subcategory.name} الفرعي`
          : `تم تفعيل قسم ${subcategory.name} الفرعي`,
      );
    } catch (mutationError) {
      const errorCode = mutationError?.response?.data?.error?.code;

      if (errorCode === "SUBCATEGORY_SORT_ORDER_CONFLICT") {
        setConflictModal({
          isOpen: true,
          subcategory,
          error: mutationError,
        });

        return;
      }

      appToast.error(
        getApiErrorMessage(mutationError, "تعذر تحديث حالة القسم الفرعي"),
      );
    }
  }

  async function handleConfirmSubcategoryConflict() {
    const subcategory = conflictModal.subcategory;

    if (!subcategory || isUpdating) {
      return;
    }

    try {
      await updateSubcategory({
        subcategoryId: subcategory.id,

        data: {
          isActive: true,
        },

        replaceSortOrderConflict: true,
      });

      appToast.success(`تم تفعيل قسم ${subcategory.name} الفرعي`);

      setConflictModal({
        isOpen: false,
        subcategory: null,
        error: null,
      });
    } catch (mutationError) {
      appToast.error(
        getApiErrorMessage(mutationError, "تعذر تفعيل القسم الفرعي"),
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Actions
  |--------------------------------------------------------------------------
  */

  function handleOpenDelete(subcategory) {
    if (isDeleting) {
      return;
    }

    setDeleteModal({
      isOpen: true,
      subcategory,
    });
  }

  function handleCloseDelete() {
    if (isDeleting) {
      return;
    }

    setDeleteModal({
      isOpen: false,
      subcategory: null,
    });
  }

  async function handleConfirmDelete() {
    const subcategory = deleteModal.subcategory;

    if (!subcategory || isDeleting) {
      return;
    }

    try {
      await deleteSubcategory(subcategory.id);

      appToast.success(`تم حذف قسم ${subcategory.name} الفرعي`);

      setDeleteModal({
        isOpen: false,
        subcategory: null,
      });
    } catch (mutationError) {
      appToast.error(
        getApiErrorMessage(mutationError, "تعذر حذف القسم الفرعي"),
      );
    }
  }

  return (
    <>
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <Link
              to="/categories"
              className="flex items-center gap-1 text-slate-500 transition hover:text-emerald-700"
            >
              <ChevronLeft size={16} />
              الأقسام
            </Link>

            <span className="text-slate-300">/</span>

            <span className="font-medium text-slate-800">{category.name}</span>
          </div>

          {isFetching && (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
              جاري التحديث...
            </div>
          )}
        </nav>

        {/* Header */}
        <CategoryDetailsHeader category={category} details={category} />

        {/* Tabs */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <CategoryDetailsTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            subcategoriesCount={subcategories.length}
            productsCount={products.length}
          />

          {/* Details */}
          {activeTab === "details" && (
            <CategoryInfoPanel category={category} details={category} />
          )}

          {/* Subcategories */}
          {activeTab === "subcategories" && (
            <SubcategoriesPanel
              subcategories={subcategories}
              onAdd={handleOpenAdd}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onToggleActive={handleToggleSubcategory}
            />
          )}

          {/* Products */}
          {activeTab === "products" && (
            <CategoryProductsPanel products={products} />
          )}
        </section>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={formModal.isOpen}
        title={formModal.mode === "edit" ? "تعديل قسم فرعي" : "إضافة قسم فرعي"}
        description={
          formModal.mode === "edit"
            ? "قم بتعديل بيانات القسم الفرعي"
            : "أدخل بيانات القسم الفرعي الجديد"
        }
        onClose={handleCloseForm}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleCloseForm}
              className={[
                "h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50",

                isSaving ? "cursor-not-allowed opacity-50" : "",
              ].join(" ")}
            >
              إلغاء
            </button>

            <button
              type="submit"
              form="subcategory-form"
              disabled={isSaving}
              className={[
                "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800",

                isSaving ? "cursor-not-allowed opacity-70" : "",
              ].join(" ")}
            >
              {isSaving && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}

              {isSaving
                ? "جاري الحفظ..."
                : formModal.mode === "edit"
                  ? "حفظ التعديلات"
                  : "إضافة القسم الفرعي"}
            </button>
          </div>
        }
      >
        <SubcategoryForm
          mode={formModal.mode}
          initialData={formModal.subcategory}
          onSubmit={handleSubmitSubcategory}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title="حذف القسم الفرعي"
        description={
          deleteModal.subcategory
            ? isDeleting
              ? `جاري حذف القسم الفرعي "${deleteModal.subcategory.name}"...`
            : `سيتم حذف القسم الفرعي "${deleteModal.subcategory.name}" من المتجر مع المنتجات الموجودة بداخله. لن يتم حذف أي سجل طلبات أو فواتير قديمة. هل أنت متأكد؟`
            : ""
        }
        confirmText={isDeleting ? "جاري الحذف..." : "حذف القسم"}
        cancelText="إلغاء"
        variant="danger"
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
      <ConfirmDialog
        isOpen={conflictModal.isOpen}
        title="تفعيل القسم الفرعي"
        description={
          conflictModal.subcategory
            ? `يوجد قسم فرعي نشط بنفس الترتيب. هل تريد تفعيل "${conflictModal.subcategory.name}" ونقل القسم الحالي لآخر الترتيب؟`
            : ""
        }
        confirmText="تفعيل ونقل"
        cancelText="إلغاء"
        variant="warning"
        onClose={() =>
          setConflictModal({
            isOpen: false,
            subcategory: null,
            error: null,
          })
        }
        onConfirm={handleConfirmSubcategoryConflict}
      />
    </>
  );
}
