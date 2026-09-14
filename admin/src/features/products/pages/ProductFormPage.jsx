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

import { appToast } from "../../../lib/toast";

import ProductForm from "../components/ProductForm";

import { categoriesMock } from "../../categories/data/categories.mock";
import { categoryDetailsMock } from "../../categories/data/categoryDetails.mock";
import { productsMock } from "../data/products.mock";

export default function ProductFormPage({
  mode = "add",
}) {
  const navigate = useNavigate();
  const { productId } = useParams();

  const isEdit = mode === "edit";

  const product = isEdit
    ? productsMock.find(
        (item) =>
          String(item.id) ===
          String(productId),
      )
    : null;

  if (isEdit && !product) {
    return (
      <Navigate
        to="/products"
        replace
      />
    );
  }

  const handleSubmitProduct = (
    productData,
  ) => {
    if (isEdit) {
      const updatedProduct = {
        ...product,
        ...productData,

        // id + slug يفضلوا ثابتين
        id: product.id,
        slug: product.slug,
      };

      console.log(
        "Updated product:",
        updatedProduct,
      );

      /*
        backend later:
        productsService.update(product.id, updatedProduct)
      */

      appToast.success(
        `تم تعديل منتج ${updatedProduct.name}`,
      );

      navigate("/products");

      return;
    }

    const id = Date.now();

    const newProduct = {
      id,
      slug: `product-${id}`,
      ...productData,
    };

    console.log(
      "New product:",
      newProduct,
    );

    appToast.success(
      `تم إضافة منتج ${newProduct.name}`,
    );

    navigate("/products");
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
          {isEdit
            ? "تعديل المنتج"
            : "إضافة منتج"}
        </span>
      </nav>

      <header>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {isEdit
            ? "تعديل المنتج"
            : "إضافة منتج جديد"}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {isEdit
            ? "قم بتعديل بيانات المنتج ثم احفظ التغييرات"
            : "أضف بيانات المنتج وحدد طريقة ظهوره في المتجر"}
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:p-6">
        <ProductForm
          mode={mode}
          initialData={product}
          categories={categoriesMock}
          categoryDetails={
            categoryDetailsMock
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
            navigate("/products")
          }
          className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          إلغاء
        </button>

        <button
          type="submit"
          form="product-form"
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <Save size={17} />

          {isEdit
            ? "حفظ التعديلات"
            : "إضافة المنتج"}
        </button>
      </div>
    </div>
  );
}