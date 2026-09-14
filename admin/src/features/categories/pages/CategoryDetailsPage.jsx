import { useMemo, useState } from "react";
import {
  Link,
  Navigate,
  useParams,
} from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import Modal from "../../../components/ui/Modal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { appToast } from "../../../lib/toast";

import CategoryDetailsHeader from "../components/CategoryDetailsHeader";
import CategoryDetailsTabs from "../components/CategoryDetailsTabs";
import CategoryInfoPanel from "../components/CategoryInfoPanel";
import CategoryProductsPanel from "../components/CategoryProductsPanel";
import SubcategoriesPanel from "../components/SubcategoriesPanel";
import SubcategoryForm from "../components/SubcategoryForm";

import { categoriesMock } from "../data/categories.mock";
import { categoryDetailsMock } from "../data/categoryDetails.mock";

export default function CategoryDetailsPage() {
  const { categorySlug } = useParams();

  const [activeTab, setActiveTab] =
    useState("subcategories");

  const category = useMemo(
    () =>
      categoriesMock.find(
        (item) => item.slug === categorySlug,
      ),
    [categorySlug],
  );

  const details = categoryDetailsMock[categorySlug];

  const [subcategories, setSubcategories] =
    useState(() => details?.subcategories ?? []);

  const [formModal, setFormModal] = useState({
    isOpen: false,
    mode: "add",
    subcategory: null,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    subcategory: null,
  });

  if (!category || !details) {
    return <Navigate to="/categories" replace />;
  }

  const products = details.products ?? [];

  const handleOpenAdd = () => {
    setFormModal({
      isOpen: true,
      mode: "add",
      subcategory: null,
    });
  };

  const handleOpenEdit = (subcategory) => {
    setFormModal({
      isOpen: true,
      mode: "edit",
      subcategory,
    });
  };

  const handleCloseForm = () => {
    setFormModal({
      isOpen: false,
      mode: "add",
      subcategory: null,
    });
  };

  const handleSubmitSubcategory = ({ name }) => {
    if (formModal.mode === "add") {
      const newSubcategory = {
        id: Date.now(),
        name,
      };

      setSubcategories((current) => [
        ...current,
        newSubcategory,
      ]);

      appToast.success(
        `تم إضافة قسم ${name} الفرعي`,
      );

      handleCloseForm();

      return;
    }

    const editedSubcategoryId =
      formModal.subcategory?.id;

    if (!editedSubcategoryId) return;

    setSubcategories((current) =>
      current.map((subcategory) =>
        subcategory.id === editedSubcategoryId
          ? {
              ...subcategory,
              name,
            }
          : subcategory,
      ),
    );

    appToast.success(
      `تم تعديل قسم ${name} الفرعي`,
    );

    handleCloseForm();
  };

  const handleOpenDelete = (subcategory) => {
    setDeleteModal({
      isOpen: true,
      subcategory,
    });
  };

  const handleCloseDelete = () => {
    setDeleteModal({
      isOpen: false,
      subcategory: null,
    });
  };

  const handleConfirmDelete = () => {
    const subcategory = deleteModal.subcategory;

    if (!subcategory) return;

    setSubcategories((current) =>
      current.filter(
        (item) => item.id !== subcategory.id,
      ),
    );

    appToast.success(
      `تم حذف قسم ${subcategory.name} الفرعي`,
    );

    handleCloseDelete();
  };

  return (
    <>
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          <Link
            to="/categories"
            className="flex items-center gap-1 text-slate-500 transition hover:text-emerald-700"
          >
            <ChevronLeft size={16} />
            الأقسام
          </Link>

          <span className="text-slate-300">/</span>

          <span className="font-medium text-slate-800">
            {category.name}
          </span>
        </nav>

        <CategoryDetailsHeader
          category={category}
          details={details}
        />

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <CategoryDetailsTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            subcategoriesCount={
              subcategories.length
            }
            productsCount={products.length}
          />

          {activeTab === "details" && (
            <CategoryInfoPanel
              category={category}
              details={details}
            />
          )}

          {activeTab === "subcategories" && (
           <SubcategoriesPanel
                    subcategories={subcategories}
                    onAdd={handleOpenAdd}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          )}

          {activeTab === "products" && (
            <CategoryProductsPanel
              products={products}
            />
          )}
        </section>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={formModal.isOpen}
        title={
          formModal.mode === "edit"
            ? "تعديل قسم فرعي"
            : "إضافة قسم فرعي"
        }
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
              onClick={handleCloseForm}
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              form="subcategory-form"
              className="h-11 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              {formModal.mode === "edit"
                ? "حفظ التعديلات"
                : "إضافة القسم الفرعي"}
            </button>
          </div>
        }
      >
        <SubcategoryForm
          mode={formModal.mode}
          initialData={formModal.subcategory}
          onSubmit={
            handleSubmitSubcategory
          }
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title="حذف القسم الفرعي"
        description={
          deleteModal.subcategory
            ? `هل أنت متأكد من حذف القسم الفرعي "${deleteModal.subcategory.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : ""
        }
        confirmText="حذف القسم"
        cancelText="إلغاء"
        variant="danger"
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}