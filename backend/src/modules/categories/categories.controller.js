import {
  createCategory,
  createSubcategory,
  getAdminCategories,
  getAdminCategoryBySlug,
  getPublicCategories,
  getPublicCategoryBySlug,
  updateCategory,
  updateSubcategory,
} from "./categories.service.js";

import {
  deleteCategory,
  deleteSubcategory,
} from "./categories.delete.service.js";

/*
|--------------------------------------------------------------------------
| Public Categories
|--------------------------------------------------------------------------
*/

export async function listPublicCategories(
  req,
  res,
) {
  const categories =
    await getPublicCategories();

  res.status(200).json({
    success: true,

    data: {
      categories,
    },
  });
}

export async function showPublicCategory(
  req,
  res,
) {
  const {
    slug,
  } =
    req.validated.params;

  const category =
    await getPublicCategoryBySlug(
      slug,
    );

  res.status(200).json({
    success: true,

    data: {
      category,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Admin Categories
|--------------------------------------------------------------------------
*/

export async function listAdminCategories(
  req,
  res,
) {
  const categories =
    await getAdminCategories();

  res.status(200).json({
    success: true,

    data: {
      categories,
    },
  });
}

export async function showAdminCategory(
  req,
  res,
) {
  const {
    slug,
  } =
    req.validated.params;

  const category =
    await getAdminCategoryBySlug(
      slug,
    );

  res.status(200).json({
    success: true,

    data: {
      category,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Create Category
|--------------------------------------------------------------------------
*/

export async function createCategoryController(
  req,
  res,
) {
  const category =
    await createCategory(
      req.validated.body,
      req.files,
    );

  res.status(201).json({
    success: true,

    message:
      "Category created successfully",

    data: {
      category,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Category
|--------------------------------------------------------------------------
*/

export async function updateCategoryController(
  req,
  res,
) {
  const {
    id,
  } =
    req.validated.params;

  const category =
    await updateCategory(
      id,
      req.validated.body,
      req.files,
    );

  res.status(200).json({
    success: true,

    message:
      "Category updated successfully",

    data: {
      category,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Delete Category
|--------------------------------------------------------------------------
*/

export async function deleteCategoryController(
  req,
  res,
) {
  const {
    id,
  } =
    req.validated.params;

  const result =
    await deleteCategory(
      id,
    );

  res.status(200).json({
    success: true,

    message:
      "Category deleted successfully",

    data:
      result,
  });
}

/*
|--------------------------------------------------------------------------
| Create Subcategory
|--------------------------------------------------------------------------
*/

export async function createSubcategoryController(
  req,
  res,
) {
  const {
    categoryId,
  } =
    req.validated.params;

  const subcategory =
    await createSubcategory(
      categoryId,
      req.validated.body,
    );

  res.status(201).json({
    success: true,

    message:
      "Subcategory created successfully",

    data: {
      subcategory,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Subcategory
|--------------------------------------------------------------------------
*/

export async function updateSubcategoryController(
  req,
  res,
) {
  const {
    id,
  } =
    req.validated.params;

  const subcategory =
    await updateSubcategory(
      id,
      req.validated.body,
    );

  res.status(200).json({
    success: true,

    message:
      "Subcategory updated successfully",

    data: {
      subcategory,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Delete Subcategory
|--------------------------------------------------------------------------
*/

export async function deleteSubcategoryController(
  req,
  res,
) {
  const {
    id,
  } =
    req.validated.params;

  const result =
    await deleteSubcategory(
      id,
    );

  res.status(200).json({
    success: true,

    message:
      "Subcategory deleted successfully",

    data:
      result,
  });
}