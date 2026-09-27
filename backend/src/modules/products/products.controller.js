import {
  createProduct,
  getAdminProductById,
  getAdminProducts,
  getPublicProductById,
  getPublicProducts,
  updateProduct,
} from "./products.service.js";

/*
|--------------------------------------------------------------------------
| Public Products
|--------------------------------------------------------------------------
*/

export async function listPublicProducts(
  req,
  res
) {
  const products =
    await getPublicProducts();

  res.status(200).json({
    success: true,

    data: {
      products,
    },
  });
}

export async function showPublicProduct(
  req,
  res
) {
  const { id } =
    req.validated.params;

  const product =
    await getPublicProductById(
      id
    );

  res.status(200).json({
    success: true,

    data: {
      product,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Admin Products
|--------------------------------------------------------------------------
*/

export async function listAdminProducts(
  req,
  res
) {
  const products =
    await getAdminProducts(
      req.validated.query
    );

  res.status(200).json({
    success: true,

    data: {
      products,
    },
  });
}

export async function showAdminProduct(
  req,
  res
) {
  const { id } =
    req.validated.params;

  const product =
    await getAdminProductById(
      id
    );

  res.status(200).json({
    success: true,

    data: {
      product,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export async function createProductController(
  req,
  res
) {
  const product =
    await createProduct(
      req.validated.body,
      req.file
    );

  res.status(201).json({
    success: true,

    message:
      "Product created successfully",

    data: {
      product,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export async function updateProductController(
  req,
  res
) {
  const { id } =
    req.validated.params;

  const product =
    await updateProduct(
      id,
      req.validated.body,
      req.file
    );

  res.status(200).json({
    success: true,

    message:
      "Product updated successfully",

    data: {
      product,
    },
  });
}