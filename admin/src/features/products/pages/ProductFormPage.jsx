import {
  useState,
} from "react";

import {
  ArrowRight,
  Save,
} from "lucide-react";

import {
  Link,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  appToast,
} from "../../../lib/toast";

import ProductForm from "../components/ProductForm";

import {
  useAdminCategories,
} from "../../categories/hooks/useAdminCategories";

import {
  useAdminCategory,
} from "../../categories/hooks/useAdminCategory";

import {
  useAdminProduct,
  useCreateAdminProduct,
  useUpdateAdminProduct,
} from "../hooks/useAdminProducts";


export default function ProductFormPage({
  mode = "add",
}) {
  const navigate =
    useNavigate();

  const {
    productId,
  } = useParams();


  const isEdit =
    mode === "edit";


  /*
  |--------------------------------------------------------------------------
  | Category
  |--------------------------------------------------------------------------
  */

  const {
    data: categories = [],
  } =
    useAdminCategories();


  const [
    selectedCategorySlug,
    setSelectedCategorySlug,
  ] = useState("");


  const {
    data: categoryDetails,
    isLoading:
      isSubcategoriesLoading,
  } =
    useAdminCategory(
      selectedCategorySlug,
    );


  const subcategories =
    categoryDetails
      ?.subcategories ??
    [];


  /*
  |--------------------------------------------------------------------------
  | Product
  |--------------------------------------------------------------------------
  */

  const {
    data: product,
    isLoading:
      isProductLoading,
  } =
    useAdminProduct(
      productId,
    );


  /*
  |--------------------------------------------------------------------------
  | Mutations
  |--------------------------------------------------------------------------
  */

  const createMutation =
    useCreateAdminProduct();


  const updateMutation =
    useUpdateAdminProduct();



  /*
  |--------------------------------------------------------------------------
  | Loading Edit
  |--------------------------------------------------------------------------
  */

  if (
    isEdit &&
    isProductLoading
  ) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
        جاري تحميل المنتج...
      </div>
    );
  }


  if (
    isEdit &&
    !product
  ) {
    return (
      <Navigate
        to="/products"
        replace
      />
    );
  }



  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmitProduct =
    async (
      productData,
    ) => {
      try {
        if (isEdit) {
          await updateMutation.mutateAsync({
            productId,
            ...productData,
          });

          appToast.success(
            `تم تعديل منتج ${productData.name}`,
          );

        } else {
          await createMutation.mutateAsync(
            productData,
          );

          appToast.success(
            `تم إضافة منتج ${productData.name}`,
          );
        }


        navigate(
          "/products",
        );

      } catch (error) {

        appToast.error(
          "حدث خطأ أثناء حفظ المنتج",
        );

      }
    };



  return (
    <div className="space-y-6">

      <nav className="flex items-center gap-2 text-sm">

        <Link
          to="/products"
          className="flex items-center gap-1 text-slate-500 transition hover:text-emerald-700"
        >
          <ArrowRight size={16} />

          المنتجات
        </Link>


        <span className="text-slate-300">
          /
        </span>


        <span className="font-medium text-slate-800">
          {
            isEdit
              ? "تعديل المنتج"
              : "إضافة منتج"
          }
        </span>

      </nav>



      <header>

        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">

          {
            isEdit
              ? "تعديل المنتج"
              : "إضافة منتج جديد"
          }

        </h1>


        <p className="mt-1 text-sm text-slate-500">

          {
            isEdit
              ? "قم بتعديل بيانات المنتج ثم احفظ التغييرات"
              : "أضف بيانات المنتج وحدد طريقة ظهوره في المتجر"
          }

        </p>

      </header>




      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:p-6">


        <ProductForm

          mode={
            mode
          }

          initialData={
            product
          }


          categories={
            categories
          }


          subcategories={
            subcategories
          }


          isSubcategoriesLoading={
            isSubcategoriesLoading
          }


          onCategoryChange={
            setSelectedCategorySlug
          }


          onSubmit={
            handleSubmitProduct
          }

        />


      </section>




      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">


        <button
          type="button"
          onClick={() =>
            navigate(
              "/products",
            )
          }
          className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          إلغاء
        </button>



        <button
          type="submit"
          form="product-form"
          disabled={
            createMutation.isPending ||
            updateMutation.isPending
          }
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >

          <Save size={17} />

          {
            createMutation.isPending ||
            updateMutation.isPending
              ? "جاري الحفظ..."
              : isEdit
                ? "حفظ التعديلات"
                : "إضافة المنتج"
          }

        </button>


      </div>


    </div>
  );
}