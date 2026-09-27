import {
  mkdir,
  unlink,
  writeFile,
} from "node:fs/promises";

import { randomUUID } from "node:crypto";
import path from "node:path";

import { AppError } from "../errors/AppError.js";

const STORAGE_ROOT =
  path.resolve(
    "storage",
    "uploads"
  );

const IMAGE_DIRECTORIES = {
  category: "categories",
  categoryBanner:
    "category-banners",
  product: "products",
};

function getImageDirectory(
  imageType
) {
  const directory =
    IMAGE_DIRECTORIES[
      imageType
    ];

  if (!directory) {
    throw new AppError(
      "Invalid image storage type",
      500,
      "INVALID_IMAGE_STORAGE_TYPE"
    );
  }

  return directory;
}

export async function saveProcessedImage(
  buffer,
  imageType
) {
  if (
    !Buffer.isBuffer(buffer) ||
    buffer.length === 0
  ) {
    throw new AppError(
      "Processed image is required",
      500,
      "PROCESSED_IMAGE_REQUIRED"
    );
  }

  const directory =
    getImageDirectory(
      imageType
    );

  const absoluteDirectory =
    path.join(
      STORAGE_ROOT,
      directory
    );

  await mkdir(
    absoluteDirectory,
    {
      recursive: true,
    }
  );

  const fileName =
    `${randomUUID()}.webp`;

  const absolutePath =
    path.join(
      absoluteDirectory,
      fileName
    );

  await writeFile(
    absolutePath,
    buffer
  );

  return {
    fileName,

    absolutePath,

    publicPath:
      `/uploads/${directory}/${fileName}`,
  };
}

export async function deleteStoredImage(
  publicPath
) {
  if (
    typeof publicPath !==
      "string" ||
    !publicPath.startsWith(
      "/uploads/"
    )
  ) {
    return;
  }

  const relativePath =
    publicPath.slice(
      "/uploads/".length
    );

  const absolutePath =
    path.resolve(
      STORAGE_ROOT,
      relativePath
    );

  const safeRoot =
    `${STORAGE_ROOT}${path.sep}`;

  if (
    !absolutePath.startsWith(
      safeRoot
    )
  ) {
    return;
  }

  try {
    await unlink(
      absolutePath
    );
  } catch (error) {
    if (
      error.code === "ENOENT"
    ) {
      return;
    }

    throw error;
  }
}