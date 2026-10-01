import api from "./api";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function appendFormValue(
  formData,
  key,
  value,
) {
  if (
    value === undefined ||
    value === null
  ) {
    return;
  }

  formData.append(
    key,
    String(value),
  );
}

/*
|--------------------------------------------------------------------------
| Get Categories
|--------------------------------------------------------------------------
*/

export async function getAdminCategories() {
  const response =
    await api.get(
      "/admin/categories",
    );

  return (
    response.data.data
      .categories
  );
}

/*
|--------------------------------------------------------------------------
| Get Category Details
|--------------------------------------------------------------------------
*/

export async function getAdminCategory(
  slug,
) {
  const response =
    await api.get(
      `/admin/categories/${encodeURIComponent(
        slug,
      )}`,
    );

  return (
    response.data.data
      .category
  );
}

/*
|--------------------------------------------------------------------------
| Create Category
|--------------------------------------------------------------------------
*/

export async function createAdminCategory({
  name,
  sortOrder,
  isActive,
  imageFile,
  bannerImageFile,
  banner,
}) {
  const formData =
    new FormData();

  appendFormValue(
    formData,
    "name",
    name,
  );

  appendFormValue(
    formData,
    "sortOrder",
    sortOrder,
  );

  appendFormValue(
    formData,
    "isActive",
    isActive,
  );

  appendFormValue(
    formData,
    "bannerTitle",
    banner?.title,
  );

  appendFormValue(
    formData,
    "bannerSubtitle",
    banner?.subtitle,
  );

  if (imageFile) {
    formData.append(
      "categoryImage",
      imageFile,
    );
  }

  if (bannerImageFile) {
    formData.append(
      "bannerImage",
      bannerImageFile,
    );
  }

  const response =
    await api.post(
      "/admin/categories",
      formData,
    );

  return (
    response.data.data
      .category
  );
}

/*
|--------------------------------------------------------------------------
| Update Category
|--------------------------------------------------------------------------
*/

export async function updateAdminCategory({
  categoryId,
  name,
  sortOrder,
  isActive,
  imageFile,
  bannerImageFile,
  banner,

  /*
   * Command Flag:
   *
   * لما الأدمن يوافق إن القسم الحالي
   * ياخد ترتيب قسم نشط موجود بالفعل.
   */
  replaceSortOrderConflict,
}) {
  const formData =
    new FormData();

  appendFormValue(
    formData,
    "name",
    name,
  );

  appendFormValue(
    formData,
    "sortOrder",
    sortOrder,
  );

  appendFormValue(
    formData,
    "isActive",
    isActive,
  );

  appendFormValue(
    formData,
    "bannerTitle",
    banner?.title,
  );

  appendFormValue(
    formData,
    "bannerSubtitle",
    banner?.subtitle,
  );

  /*
   * ما نبعتش الـflag أصلًا
   * إلا لو الـcaller حدده.
   *
   * false => "false"
   * true  => "true"
   *
   * والـbackend validation
   * يحولهم Boolean.
   */
  appendFormValue(
    formData,
    "replaceSortOrderConflict",
    replaceSortOrderConflict,
  );

  if (imageFile) {
    formData.append(
      "categoryImage",
      imageFile,
    );
  }

  if (bannerImageFile) {
    formData.append(
      "bannerImage",
      bannerImageFile,
    );
  }

  const response =
    await api.patch(
      `/admin/categories/${categoryId}`,
      formData,
    );

  return (
    response.data.data
      .category
  );
}

/*
|--------------------------------------------------------------------------
| Delete Category
|--------------------------------------------------------------------------
|
| موجود في الـservice لو احتجناه إداريًا لاحقًا،
| لكن واجهة الأقسام الحالية تعتمد على Active / Inactive.
|--------------------------------------------------------------------------
*/

export async function deleteAdminCategory(
  categoryId,
) {
  const response =
    await api.delete(
      `/admin/categories/${categoryId}`,
    );

  return response.data.data;
}

/*
|--------------------------------------------------------------------------
| Create Subcategory
|--------------------------------------------------------------------------
*/

export async function createAdminSubcategory({
  categoryId,
  name,
}) {
  const response =
    await api.post(
      `/admin/categories/${categoryId}/subcategories`,
      {
        name,
      },
    );

  return (
    response.data.data
      .subcategory
  );
}

/*
|--------------------------------------------------------------------------
| Update Subcategory
|--------------------------------------------------------------------------
*/

export async function updateAdminSubcategory({
  subcategoryId,
  data,
  replaceSortOrderConflict,
}) {
  /*
   * نحافظ على data الحالية عشان
   * Create / Edit / Status Toggle
   * يفضلوا بنفس الـAPI.
   *
   * replaceSortOrderConflict
   * Command Flag منفصل نضيفه فقط
   * عند تأكيد الأدمن للـReplacement.
   */
  const payload = {
    ...data,

    ...(replaceSortOrderConflict !==
    undefined
      ? {
          replaceSortOrderConflict,
        }
      : {}),
  };

  const response =
    await api.patch(
      `/admin/subcategories/${subcategoryId}`,
      payload,
    );

  return (
    response.data.data
      .subcategory
  );
}

/*
|--------------------------------------------------------------------------
| Delete Subcategory
|--------------------------------------------------------------------------
|
| موجود كـSoft Delete API لو احتجناه إداريًا لاحقًا.
| واجهة الـSubcategories هتعتمد على Active / Inactive
| بدل زر الحذف.
|--------------------------------------------------------------------------
*/

export async function deleteAdminSubcategory(
  subcategoryId,
) {
  const response =
    await api.delete(
      `/admin/subcategories/${subcategoryId}`,
    );

  return response.data.data;
}