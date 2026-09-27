import {
  createOffer,
  deleteOffer,
  getAdminOfferById,
  getAdminOffers,
  updateOffer,
} from "./offers.service.js";

/*
|--------------------------------------------------------------------------
| Admin Offers List
|--------------------------------------------------------------------------
*/

export async function listAdminOffers(
  req,
  res
) {
  const offers =
    await getAdminOffers();

  res.status(200).json({
    success: true,

    data: {
      offers,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Admin Offer Detail
|--------------------------------------------------------------------------
*/

export async function showAdminOffer(
  req,
  res
) {
  const { id } =
    req.validated.params;

  const offer =
    await getAdminOfferById(
      id
    );

  res.status(200).json({
    success: true,

    data: {
      offer,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Create Offer
|--------------------------------------------------------------------------
*/

export async function createOfferController(
  req,
  res
) {
  const offer =
    await createOffer(
      req.validated.body
    );

  res.status(201).json({
    success: true,

    message:
      "Offer created successfully",

    data: {
      offer,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Offer
|--------------------------------------------------------------------------
*/

export async function updateOfferController(
  req,
  res
) {
  const { id } =
    req.validated.params;

  const offer =
    await updateOffer(
      id,
      req.validated.body
    );

  res.status(200).json({
    success: true,

    message:
      "Offer updated successfully",

    data: {
      offer,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Delete Offer
|--------------------------------------------------------------------------
*/

export async function deleteOfferController(
  req,
  res
) {
  const { id } =
    req.validated.params;

  const result =
    await deleteOffer(
      id
    );

  res.status(200).json({
    success: true,

    message:
      "Offer deleted successfully",

    data: {
      offer: result,
    },
  });
}