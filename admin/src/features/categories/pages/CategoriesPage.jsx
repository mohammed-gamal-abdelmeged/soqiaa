import {
  useMemo,
  useState,
} from "react";

import Modal from "../../../components/ui/Modal";

import {
  appToast,
} from "../../../lib/toast";

import CategoriesTable from "../components/CategoriesTable";
import CategoriesToolbar from "../components/CategoriesToolbar";
import CategoryForm from "../components/CategoryForm";
import CategoryMobileCard from "../components/CategoryMobileCard";

import {
  useAdminCategories,
  useCreateAdminCategory,
  useUpdateAdminCategory,
} from "../hooks/useAdminCategories";

/*
|--------------------------------------------------------------------------
| API Error Helpers
|--------------------------------------------------------------------------
*/

function getErrorCode(
  error,
) {
  return (
    error?.response?.data
      ?.error?.code ??
    error?.code ??
    null
  );
}

function getErrorDetails(
  error,
) {
  return (
    error?.response?.data
      ?.error?.details ??
    error?.details ??
    null
  );
}

export default function CategoriesPage() {
  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("all");

  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [
    formErrors,
    setFormErrors,
  ] = useState({});

  const [
    formModal,
    setFormModal,
  ] = useState({
    isOpen: false,
    mode: "add",
    category: null,
  });

  /*
  |--------------------------------------------------------------------------
  | Toggle Status State
  |--------------------------------------------------------------------------
  */

  const [
    togglingCategoryId,
    setTogglingCategoryId,
  ] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Sort Order Replacement
  |--------------------------------------------------------------------------
  */

  const [
    replacementModal,
    setReplacementModal,
  ] = useState({
    isOpen: false,

    category: null,

    conflictingCategory:
      null,

    replacementSortOrder:
      null,
  });

  /*
  |--------------------------------------------------------------------------
  | API + Cache
  |--------------------------------------------------------------------------
  */

  const {
    data: categories = [],
    isPending,
    isFetching,
    isError,
    refetch,
  } = useAdminCategories();

  const {
    mutateAsync:
      createCategory,

    isPending:
      isCreating,
  } =
    useCreateAdminCategory();

  const {
    mutateAsync:
      updateCategory,

    isPending:
      isUpdating,
  } =
    useUpdateAdminCategory();

  const isSaving =
    isCreating ||
    (isUpdating &&
      Boolean(
        formModal.isOpen,
      ));

  const isReplacing =
    isUpdating &&
    Boolean(
      replacementModal.isOpen,
    );

  /*
  |--------------------------------------------------------------------------
  | Local Search + Status Filter
  |--------------------------------------------------------------------------
  */

  const filteredCategories =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return categories
        .filter(
          (
            category,
          ) => {
            const matchesSearch =
              !normalizedSearch ||
              category.name
                .toLowerCase()
                .includes(
                  normalizedSearch,
                );

            const matchesStatus =
              status ===
                "all" ||
              (status ===
                "active" &&
                category.isActive) ||
              (status ===
                "inactive" &&
                !category.isActive);

            return (
              matchesSearch &&
              matchesStatus
            );
          },
        )
        .sort(
          (
            firstCategory,
            secondCategory,
          ) => {
            const sortDifference =
              firstCategory.sortOrder -
              secondCategory.sortOrder;

            if (
              sortDifference !==
              0
            ) {
              return sortDifference;
            }

            if (
              firstCategory.isActive !==
              secondCategory.isActive
            ) {
              return firstCategory
                .isActive
                ? -1
                : 1;
            }

            return 0;
          },
        );
    }, [
      categories,
      search,
      status,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Open Add
  |--------------------------------------------------------------------------
  */

  function handleOpenAddCategory() {
    setFormErrors({});

    setFormModal({
      isOpen: true,
      mode: "add",
      category: null,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Open Edit
  |--------------------------------------------------------------------------
  */

  function handleOpenEditCategory(
    category,
  ) {
    if (
      togglingCategoryId ||
      isReplacing
    ) {
      return;
    }

    setFormErrors({});

    setFormModal({
      isOpen: true,
      mode: "edit",
      category,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Close Form
  |--------------------------------------------------------------------------
  */

  function handleCloseFormModal() {
    if (isSaving) {
      return;
    }

    setFormErrors({});

    setFormModal({
      isOpen: false,
      mode: "add",
      category: null,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Submit Add / Edit
  |--------------------------------------------------------------------------
  */

  async function handleSubmitCategory({
    name,
    imageFile,
    bannerImageFile,
    sortOrder,
    isActive,
    banner,
  }) {
    if (isSaving) {
      return;
    }

    setFormErrors({});

    try {
      /*
       * Create
       */
      if (
        formModal.mode ===
        "add"
      ) {
        await createCategory({
          name,
          imageFile,
          bannerImageFile,
          sortOrder,
          isActive,
          banner,
        });

        appToast.success(
          `تم إضافة قسم ${name}`,
        );

        setFormModal({
          isOpen: false,
          mode: "add",
          category: null,
        });

        return;
      }

      /*
       * Update
       */
      const editedCategory =
        formModal.category;

      if (
        !editedCategory
      ) {
        return;
      }

      await updateCategory({
        categoryId:
          editedCategory.id,

        name,
        imageFile,
        bannerImageFile,
        sortOrder,
        isActive,
        banner,
      });

      appToast.success(
        `تم تعديل قسم ${name}`,
      );

      setFormModal({
        isOpen: false,
        mode: "add",
        category: null,
      });
    } catch (error) {
      const errorCode =
        getErrorCode(
          error,
        );

      if (
        errorCode ===
        "CATEGORY_SORT_ORDER_CONFLICT"
      ) {
        const details =
          getErrorDetails(
            error,
          );

        const conflictName =
          details
            ?.conflictingCategory
            ?.name;

        setFormErrors({
          sortOrder:
            conflictName
              ? `الترتيب رقم ${sortOrder} مستخدم بواسطة قسم "${conflictName}"`
              : `الترتيب رقم ${sortOrder} مستخدم بالفعل`,
        });

        return;
      }

      appToast.error(
        error?.message ||
          "تعذر حفظ بيانات القسم",
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Open Replacement Modal
  |--------------------------------------------------------------------------
  */

  function openReplacementModal({
    category,
    error,
  }) {
    const details =
      getErrorDetails(
        error,
      );

    const conflictingCategory =
      details
        ?.conflictingCategory ??
      null;

    const replacementSortOrder =
      details
        ?.replacementSortOrder ??
      null;

    if (
      !conflictingCategory
    ) {
      appToast.error(
        error?.message ||
          "تعذر تحديد القسم المتعارض",
      );

      return;
    }

    setReplacementModal({
      isOpen: true,

      category,

      conflictingCategory,

      replacementSortOrder,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Close Replacement Modal
  |--------------------------------------------------------------------------
  */

  function handleCloseReplacementModal() {
    if (isReplacing) {
      return;
    }

    setReplacementModal({
      isOpen: false,

      category: null,

      conflictingCategory:
        null,

      replacementSortOrder:
        null,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Toggle Active Status
  |--------------------------------------------------------------------------
  */

  async function handleToggleCategoryStatus(
    category,
  ) {
    if (
      isUpdating ||
      togglingCategoryId ||
      replacementModal.isOpen
    ) {
      return;
    }

    const nextStatus =
      !category.isActive;

    setTogglingCategoryId(
      category.id,
    );

    try {
      await updateCategory({
        categoryId:
          category.id,

        isActive:
          nextStatus,
      });

      appToast.success(
        nextStatus
          ? `تم تفعيل قسم ${category.name}`
          : `تم تعطيل قسم ${category.name}`,
      );
    } catch (error) {
      const errorCode =
        getErrorCode(
          error,
        );

      if (
        nextStatus &&
        errorCode ===
          "CATEGORY_SORT_ORDER_CONFLICT"
      ) {
        openReplacementModal({
          category,
          error,
        });

        return;
      }

      appToast.error(
        error?.message ||
          "تعذر تحديث حالة القسم",
      );
    } finally {
      setTogglingCategoryId(
        null,
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Confirm Sort Order Replacement
  |--------------------------------------------------------------------------
  */

  async function handleConfirmReplacement() {
    const category =
      replacementModal.category;

    const conflictingCategory =
      replacementModal
        .conflictingCategory;

    if (
      !category ||
      !conflictingCategory ||
      isReplacing
    ) {
      return;
    }

    setTogglingCategoryId(
      category.id,
    );

    try {
      const updatedCategory =
        await updateCategory({
          categoryId:
            category.id,

          isActive: true,

          replaceSortOrderConflict:
            true,
        });

      const movedCategory =
        updatedCategory
          ?.replacement
          ?.movedCategory;

      const movedToSortOrder =
        movedCategory
          ?.sortOrder ??
        replacementModal
          .replacementSortOrder;

      if (
        movedToSortOrder
      ) {
        appToast.success(
          `تم تفعيل قسم ${category.name} ونقل قسم ${conflictingCategory.name} إلى الترتيب ${movedToSortOrder}`,
        );
      } else {
        appToast.success(
          `تم تفعيل قسم ${category.name} وتحديث ترتيب قسم ${conflictingCategory.name}`,
        );
      }

      setReplacementModal({
        isOpen: false,

        category: null,

        conflictingCategory:
          null,

        replacementSortOrder:
          null,
      });
    } catch (error) {
      const errorCode =
        getErrorCode(
          error,
        );

      if (
        errorCode ===
        "CATEGORY_SORT_ORDER_CONFLICT"
      ) {
        openReplacementModal({
          category,
          error,
        });

        return;
      }

      appToast.error(
        error?.message ||
          "تعذر استبدال ترتيب القسم",
      );
    } finally {
      setTogglingCategoryId(
        null,
      );
    }
  }

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
  | Error
  |--------------------------------------------------------------------------
  */

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">
          تعذر تحميل الأقسام
        </p>

        <button
          type="button"
          onClick={() =>
            refetch()
          }
          className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <header>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                إدارة الأقسام
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                إدارة أقسام المنتجات
                وترتيب ظهورها في
                المتجر
              </p>
            </div>

            {isFetching && (
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

                جاري التحديث...
              </div>
            )}
          </div>
        </header>

        {/* Toolbar */}
        <CategoriesToolbar
          search={
            search
          }
          onSearchChange={
            setSearch
          }
          status={
            status
          }
          onStatusChange={
            setStatus
          }
          onAddCategory={
            handleOpenAddCategory
          }
        />

        {/* Count */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              الأقسام
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {search ||
              status !==
                "all"
                ? `النتائج: ${filteredCategories.length}`
                : `إجمالي الأقسام: ${categories.length}`}
            </p>
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {
              filteredCategories.length
            }{" "}
            قسم
          </span>
        </div>

        {/* Categories */}
        {filteredCategories.length >
        0 ? (
          <div
            className={[
              isFetching
                ? "opacity-70"
                : "",
              "transition-opacity",
            ].join(" ")}
          >
            {/* Desktop */}
            <CategoriesTable
              categories={
                filteredCategories
              }
              onEdit={
                handleOpenEditCategory
              }
              onToggleStatus={
                handleToggleCategoryStatus
              }
              togglingCategoryId={
                togglingCategoryId
              }
            />

            {/* Mobile */}
            <div className="space-y-3 md:hidden">
              {filteredCategories.map(
                (
                  category,
                ) => (
                  <CategoryMobileCard
                    key={
                      category.id
                    }
                    category={
                      category
                    }
                    onEdit={
                      handleOpenEditCategory
                    }
                    onToggleStatus={
                      handleToggleCategoryStatus
                    }
                    togglingCategoryId={
                      togglingCategoryId
                    }
                  />
                ),
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-sm font-semibold text-slate-700">
              لا توجد أقسام مطابقة
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {categories.length
                ? "جرّب تغيير البحث أو فلتر الحالة"
                : "لا توجد أقسام مضافة حالياً"}
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={
          formModal.isOpen
        }
        title={
          formModal.mode ===
          "edit"
            ? "تعديل القسم"
            : "إضافة قسم جديد"
        }
        description={
          formModal.mode ===
          "edit"
            ? "قم بتعديل بيانات القسم ثم احفظ التغييرات"
            : "أدخل بيانات القسم الذي تريد إضافته إلى المتجر"
        }
        onClose={
          handleCloseFormModal
        }
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={
                isSaving
              }
              onClick={
                handleCloseFormModal
              }
              className={[
                "h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50",

                isSaving
                  ? "cursor-not-allowed opacity-50"
                  : "",
              ].join(" ")}
            >
              إلغاء
            </button>

            <button
              type="submit"
              form="category-form"
              disabled={
                isSaving
              }
              className={[
                "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800",

                isSaving
                  ? "cursor-not-allowed opacity-70"
                  : "",
              ].join(" ")}
            >
              {isSaving && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}

              {isSaving
                ? "جاري الحفظ..."
                : formModal.mode ===
                    "edit"
                  ? "حفظ التعديلات"
                  : "إضافة القسم"}
            </button>
          </div>
        }
      >
        <CategoryForm
          mode={
            formModal.mode
          }
          initialData={
            formModal.category
          }
          onSubmit={
            handleSubmitCategory
          }
          externalErrors={
            formErrors
          }
        />
      </Modal>

      {/* Sort Order Replacement Modal */}
      <Modal
        isOpen={
          replacementModal.isOpen
        }
        title="تأكيد تغيير ترتيب القسم"
        description="يوجد قسم نشط يستخدم نفس رقم الترتيب"
        onClose={
          handleCloseReplacementModal
        }
        maxWidth="max-w-lg"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={
                isReplacing
              }
              onClick={
                handleCloseReplacementModal
              }
              className={[
                "h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50",

                isReplacing
                  ? "cursor-not-allowed opacity-50"
                  : "",
              ].join(" ")}
            >
              إلغاء
            </button>

            <button
              type="button"
              disabled={
                isReplacing
              }
              onClick={
                handleConfirmReplacement
              }
              className={[
                "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800",

                isReplacing
                  ? "cursor-not-allowed opacity-70"
                  : "",
              ].join(" ")}
            >
              {isReplacing && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}

              {isReplacing
                ? "جاري التبديل..."
                : "نعم، استبدال الترتيب"}
            </button>
          </div>
        }
      >
        <div className="space-y-4 p-5">
          <p className="text-sm leading-7 text-slate-700">
            القسم{" "}
            <span className="font-bold text-slate-900">
              "
              {
                replacementModal
                  .category
                  ?.name
              }
              "
            </span>{" "}
            ترتيبه رقم{" "}
            <span className="font-bold text-emerald-700">
              {
                replacementModal
                  .category
                  ?.sortOrder
              }
            </span>
            ، لكن هذا الترتيب مستخدم حاليًا بواسطة قسم{" "}
            <span className="font-bold text-slate-900">
              "
              {
                replacementModal
                  .conflictingCategory
                  ?.name
              }
              "
            </span>
            .
          </p>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              في حالة الموافقة:
            </p>

            <div className="mt-3 space-y-2 text-sm leading-6 text-amber-800">
              <p>
                •{" "}
                <span className="font-semibold">
                  {
                    replacementModal
                      .category
                      ?.name
                  }
                </span>{" "}
                سيصبح نشطًا في الترتيب{" "}
                <span className="font-bold">
                  {
                    replacementModal
                      .category
                      ?.sortOrder
                  }
                </span>
                .
              </p>

              <p>
                •{" "}
                <span className="font-semibold">
                  {
                    replacementModal
                      .conflictingCategory
                      ?.name
                  }
                </span>{" "}
                سيظل نشطًا وينتقل إلى الترتيب{" "}
                <span className="font-bold">
                  {replacementModal
                    .replacementSortOrder ??
                    "الأخير"}
                </span>
                .
              </p>
            </div>
          </div>

          <p className="text-xs leading-6 text-slate-500">
            لن يتم حذف أو تعطيل أي
            قسم؛ سيتم تغيير الترتيب
            فقط.
          </p>
        </div>
      </Modal>
    </>
  );
}