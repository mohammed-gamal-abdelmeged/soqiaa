import { useMemo, useState } from "react";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Modal from "../../../components/ui/Modal";
import { appToast } from "../../../lib/toast";

import CategoriesTable from "../components/CategoriesTable";
import CategoriesToolbar from "../components/CategoriesToolbar";
import CategoryForm from "../components/CategoryForm";
import CategoryMobileCard from "../components/CategoryMobileCard";

import { categoriesMock } from "../data/categories.mock";
import { categoryDetailsMock } from "../data/categoryDetails.mock";

export default function CategoriesPage() {
  const [categories, setCategories] = useState(() =>
    categoriesMock.map((category) => ({
      ...category,

      // ندمج بيانات البانر مؤقتًا مع بيانات القسم
      // عشان الـ Add/Edit Modal يشتغل من مصدر واحد
      banner: categoryDetailsMock[category.slug]?.banner ?? {
        title: "",
        subtitle: "",
      },
    })),
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [formErrors, setFormErrors] = useState({});

  const [formModal, setFormModal] = useState({
    isOpen: false,
    mode: "add",
    category: null,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    category: null,
  });

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return categories
      .filter((category) => {
        const matchesSearch =
          !normalizedSearch ||
          category.name
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesStatus =
          status === "all" ||
          (status === "active" && category.isActive) ||
          (status === "inactive" && !category.isActive);

        return matchesSearch && matchesStatus;
      })
      .sort(
        (firstCategory, secondCategory) =>
          firstCategory.sortOrder -
          secondCategory.sortOrder,
      );
  }, [categories, search, status]);

  // ================================
  // OPEN ADD
  // ================================

  const handleOpenAddCategory = () => {
    setFormErrors({});

    setFormModal({
      isOpen: true,
      mode: "add",
      category: null,
    });
  };

  // ================================
  // OPEN EDIT
  // ================================

  const handleOpenEditCategory = (category) => {
    setFormErrors({});

    setFormModal({
      isOpen: true,
      mode: "edit",
      category,
    });
  };

  // ================================
  // CLOSE FORM
  // ================================

  const handleCloseFormModal = () => {
    setFormErrors({});

    setFormModal({
      isOpen: false,
      mode: "add",
      category: null,
    });
  };

  // ================================
  // ADD / EDIT
  // ================================

  const handleSubmitCategory = ({
    name,
    image,
    imageFile,
    sortOrder,
    isActive,
    banner,
  }) => {
    // ================================
    // ADD
    // ================================

    if (formModal.mode === "add") {
      const isSortOrderUsed = categories.some(
        (category) =>
          category.sortOrder === sortOrder,
      );

      if (isSortOrderUsed) {
        setFormErrors({
          sortOrder: `الترتيب رقم ${sortOrder} مستخدم بالفعل`,
        });

        return;
      }

      setFormErrors({});

      const id = Date.now();

      const newCategory = {
        id,
        name,

        /*
          مؤقت للـ mock فقط.
          لاحقًا الـ Backend هو اللي يرجع الـ slug الحقيقي.
        */
        slug: `category-${id}`,

        image,
        imageFile,
        sortOrder,
        isActive,

        banner: {
          title: banner.title,
          subtitle: banner.subtitle,
        },
      };

      setCategories((current) => [
        ...current,
        newCategory,
      ]);

      appToast.success(
        `تم إضافة قسم ${name}`,
      );

      handleCloseFormModal();

      return;
    }

    // ================================
    // EDIT
    // ================================

    const editedCategory = formModal.category;

    if (!editedCategory) return;

    /*
      نمنع استخدام ترتيب موجود لقسم آخر.

      لكن لو القسم الحالي ترتيبه 1 مثلًا
      وفضل على 1، ده مسموح.
    */
    const isSortOrderUsed = categories.some(
      (category) =>
        category.id !== editedCategory.id &&
        category.sortOrder === sortOrder,
    );

    if (isSortOrderUsed) {
      setFormErrors({
        sortOrder: `الترتيب رقم ${sortOrder} مستخدم بالفعل`,
      });

      return;
    }

    setFormErrors({});

    setCategories((current) =>
      current.map((category) =>
        category.id === editedCategory.id
          ? {
              ...category,

              /*
                مهم:
                id و slug يفضلوا كما هم.
              */
              name,
              image,
              imageFile,
              sortOrder,
              isActive,

              banner: {
                title: banner.title,
                subtitle: banner.subtitle,
              },
            }
          : category,
      ),
    );

    appToast.success(
      `تم تعديل قسم ${name}`,
    );

    handleCloseFormModal();
  };

  // ================================
  // OPEN DELETE
  // ================================

  const handleOpenDeleteCategory = (category) => {
    setDeleteModal({
      isOpen: true,
      category,
    });
  };

  // ================================
  // CLOSE DELETE
  // ================================

  const handleCloseDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      category: null,
    });
  };

  // ================================
  // CONFIRM DELETE
  // ================================

  const handleConfirmDeleteCategory = () => {
    const category = deleteModal.category;

    if (!category) return;

    setCategories((current) =>
      current.filter(
        (item) => item.id !== category.id,
      ),
    );

    appToast.success(
      `تم حذف قسم ${category.name}`,
    );

    handleCloseDeleteModal();
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <header>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            إدارة الأقسام
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            إدارة أقسام المنتجات وترتيب ظهورها في المتجر
          </p>
        </header>

        {/* Toolbar */}
        <CategoriesToolbar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          onAddCategory={handleOpenAddCategory}
        />

        {/* Categories */}
        {filteredCategories.length > 0 ? (
          <>
            {/* Desktop */}
            <CategoriesTable
              categories={filteredCategories}
              onEdit={handleOpenEditCategory}
              onDelete={handleOpenDeleteCategory}
            />

            {/* Mobile */}
            <div className="space-y-3 md:hidden">
              {filteredCategories.map(
                (category) => (
                  <CategoryMobileCard
                    key={category.id}
                    category={category}
                    onEdit={handleOpenEditCategory}
                    onDelete={
                      handleOpenDeleteCategory
                    }
                  />
                ),
              )}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-sm font-semibold text-slate-700">
              لا توجد أقسام مطابقة
            </p>

            <p className="mt-1 text-xs text-slate-500">
              جرّب تغيير البحث أو فلتر الحالة
            </p>
          </div>
        )}
      </div>

      {/* =================================
          ADD / EDIT MODAL
      ================================= */}

      <Modal
        isOpen={formModal.isOpen}
        title={
          formModal.mode === "edit"
            ? "تعديل القسم"
            : "إضافة قسم جديد"
        }
        description={
          formModal.mode === "edit"
            ? "قم بتعديل بيانات القسم ثم احفظ التغييرات"
            : "أدخل بيانات القسم الذي تريد إضافته إلى المتجر"
        }
        onClose={handleCloseFormModal}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCloseFormModal}
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              form="category-form"
              className="h-11 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              {formModal.mode === "edit"
                ? "حفظ التعديلات"
                : "إضافة القسم"}
            </button>
          </div>
        }
      >
        <CategoryForm
          mode={formModal.mode}
          initialData={formModal.category}
          onSubmit={handleSubmitCategory}
          externalErrors={formErrors}
        />
      </Modal>

      {/* =================================
          DELETE CONFIRMATION
      ================================= */}

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title="حذف القسم"
        description={
          deleteModal.category
            ? `هل تريد حذف قسم "${deleteModal.category.name}"؟`
            : ""
        }
        confirmText="نعم، حذف القسم"
        cancelText="إلغاء"
        variant="danger"
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteCategory}
      />
    </>
  );
}