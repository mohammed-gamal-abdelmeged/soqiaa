import {
  getMyProfile,
  updateMyProfile,
} from "./users.service.js";

/*
|--------------------------------------------------------------------------
| Get My Profile
|--------------------------------------------------------------------------
*/

export async function showMyProfile(
  req,
  res
) {
  const user =
    await getMyProfile(
      req.user.id
    );

  res.status(200).json({
    success: true,

    data: {
      user,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update My Profile
|--------------------------------------------------------------------------
*/

export async function updateMyProfileController(
  req,
  res
) {
  const user =
    await updateMyProfile(
      req.user.id,
      req.validated.body
    );

  res.status(200).json({
    success: true,

    message:
      "Profile updated successfully",

    data: {
      user,
    },
  });
}