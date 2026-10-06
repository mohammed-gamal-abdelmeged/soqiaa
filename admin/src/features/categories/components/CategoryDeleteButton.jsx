import {
  useState,
} from "react";

import {
  Trash2,
} from "lucide-react";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import {
  appToast,
} from "../../../lib/toast";

import {
  useDeleteAdminCategory,
} from "../hooks/useAdminCategories";

export default function CategoryDeleteButton({
  category,
  disabled = false,
}) {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const {
    mutateAsync:
      deleteCategory,

    isPending,
  } =
    useDeleteAdminCategory();

  function handleOpen(
    event,
  ) {
    event.stopPropagation();

    if (
      disabled ||
      isPending
    ) {
      return;
    }

    setIsOpen(
      true,
    );
  }

  function handleClose() {
    if (isPending) {
      return;
    }

    setIsOpen(
      false,
    );
  }

  async function handleDelete() {
    if (isPending) {
      return;
    }

    try {
      const result =
        await deleteCategory(
          category.id,
        );

      setIsOpen(
        false,
      );

      const productsCount =
        result?.deletedProducts ??
        0;

      const subcategoriesCount =
        result
          ?.deletedSubcategories ??
        0;

      appToast.success(
        `تم حذف قسم ${category.name} بأمان`,
      );

      /*
       * للتأكد من إن العملية واضحة
       * أثناء التطوير.
       */
      if (
        import.meta.env.DEV
      ) {
        console.info(
          "Category soft deleted:",
          {
            category:
              category.name,

            subcategories:
              subcategoriesCount,

            products:
              productsCount,
          },
        );
      }
    } catch (error) {
      appToast.error(
        error?.message ||
          "تعذر حذف القسم",
      );
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={
          handleOpen
        }
        disabled={
          disabled ||
          isPending
        }
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-red-200
          text-red-600
          transition
          hover:bg-red-50
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
        aria-label={`حذف ${category.name}`}
        title="حذف القسم"
      >
        <Trash2
          size={16}
        />
      </button>

      <ConfirmDialog
        isOpen={
          isOpen
        }
        title="حذف القسم"
        description={`سيتم حذف قسم "${category.name}" من المتجر مع الأقسام الفرعية والمنتجات الموجودة بداخله. لن يتم حذف أي سجل طلبات أو فواتير قديمة. هل أنت متأكد؟`}
        confirmText={
          isPending
            ? "جاري الحذف..."
            : "حذف القسم"
        }
        cancelText="إلغاء"
        variant="danger"
        onClose={
          handleClose
        }
        onConfirm={
          handleDelete
        }
      />
    </>
  );
}