import multer from "multer";

import { AppError } from "../errors/AppError.js";

const MAX_UPLOAD_SIZE =
  7 * 1024 * 1024;

const ALLOWED_MIME_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

function createUploader(
  maxFiles
) {
  return multer({
    storage:
      multer.memoryStorage(),

    limits: {
      fileSize:
        MAX_UPLOAD_SIZE,

      files:
        maxFiles,

      fields: 20,

      parts: 25,
    },

    fileFilter(
      req,
      file,
      callback
    ) {
      if (
        !ALLOWED_MIME_TYPES.has(
          file.mimetype
        )
      ) {
        return callback(
          new AppError(
            "Only JPEG, PNG, and WEBP images are allowed",
            400,
            "INVALID_IMAGE_TYPE"
          )
        );
      }

      callback(null, true);
    },
  });
}

function handleUploadError(
  error,
  next
) {
  if (!error) {
    return next();
  }

  if (
    error instanceof
      multer.MulterError &&
    error.code ===
      "LIMIT_FILE_SIZE"
  ) {
    return next(
      new AppError(
        "Each image must not exceed 7 MB before processing",
        413,
        "IMAGE_TOO_LARGE"
      )
    );
  }

  if (
    error instanceof
    multer.MulterError
  ) {
    return next(
      new AppError(
        "Invalid image upload",
        400,
        "INVALID_IMAGE_UPLOAD",
        {
          multerCode:
            error.code,
        }
      )
    );
  }

  next(error);
}

export function uploadSingleImage(
  fieldName
) {
  const uploader =
    createUploader(1);

  const upload =
    uploader.single(
      fieldName
    );

  return (
    req,
    res,
    next
  ) => {
    upload(
      req,
      res,
      (error) =>
        handleUploadError(
          error,
          next
        )
    );
  };
}

export function uploadImageFields(
  fields
) {
  const maxFiles =
    fields.reduce(
      (
        total,
        field
      ) =>
        total +
        (
          field.maxCount ?? 1
        ),
      0
    );

  const uploader =
    createUploader(
      maxFiles
    );

  const upload =
    uploader.fields(
      fields
    );

  return (
    req,
    res,
    next
  ) => {
    upload(
      req,
      res,
      (error) =>
        handleUploadError(
          error,
          next
        )
    );
  };
}