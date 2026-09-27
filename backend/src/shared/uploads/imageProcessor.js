import sharp from "sharp";

import { AppError } from "../errors/AppError.js";

const MAX_INPUT_PIXELS =
  25_000_000;

const MAX_PROCESSED_SIZE =
  700 * 1024;

const START_QUALITY = 85;
const MIN_QUALITY = 55;
const QUALITY_STEP = 5;

const ALLOWED_FORMATS =
  new Set([
    "jpeg",
    "png",
    "webp",
  ]);

const IMAGE_PRESETS = {
  category: {
    width: 800,
    height: 800,
    fit: "cover",
  },

  product: {
    width: 1200,
    height: 1200,
    fit: "cover",
  },

  categoryBanner: {
    width: 1600,
    height: 600,
    fit: "cover",
  },
};

function getImagePreset(
  presetName
) {
  const preset =
    IMAGE_PRESETS[presetName];

  if (!preset) {
    throw new AppError(
      "Invalid image preset",
      500,
      "INVALID_IMAGE_PRESET"
    );
  }

  return preset;
}

async function validateImage(
  buffer
) {
  try {
    const metadata =
      await sharp(buffer, {
        failOn: "error",

        limitInputPixels:
          MAX_INPUT_PIXELS,
      }).metadata();

    if (
      !metadata.format ||
      !ALLOWED_FORMATS.has(
        metadata.format
      )
    ) {
      throw new AppError(
        "Only JPEG, PNG, and WEBP images are allowed",
        400,
        "INVALID_IMAGE_TYPE"
      );
    }

    if (
      !metadata.width ||
      !metadata.height
    ) {
      throw new AppError(
        "Invalid image dimensions",
        400,
        "INVALID_IMAGE"
      );
    }

    return metadata;
  } catch (error) {
    if (
      error instanceof AppError
    ) {
      throw error;
    }

    throw new AppError(
      "Invalid or corrupted image",
      400,
      "INVALID_IMAGE"
    );
  }
}

async function compressImage(
  buffer,
  preset
) {
  const basePipeline =
    sharp(buffer, {
      failOn: "error",

      limitInputPixels:
        MAX_INPUT_PIXELS,
    })
      .rotate()
      .resize({
        width: preset.width,
        height: preset.height,

        fit: preset.fit,

        position: "centre",
      });

  let quality =
    START_QUALITY;

  let processedBuffer = null;

  while (
    quality >= MIN_QUALITY
  ) {
    processedBuffer =
      await basePipeline
        .clone()
        .webp({
          quality,
          effort: 4,
          smartSubsample: true,
        })
        .toBuffer();

    if (
      processedBuffer.length <=
      MAX_PROCESSED_SIZE
    ) {
      break;
    }

    quality -= QUALITY_STEP;
  }

  if (
    !processedBuffer ||
    processedBuffer.length >
      MAX_PROCESSED_SIZE
  ) {
    throw new AppError(
      "Image could not be optimized to an acceptable size",
      422,
      "IMAGE_OPTIMIZATION_FAILED"
    );
  }

  return {
    buffer: processedBuffer,
    quality,
  };
}

export async function processImage(
  buffer,
  presetName
) {
  if (
    !Buffer.isBuffer(buffer) ||
    buffer.length === 0
  ) {
    throw new AppError(
      "Image file is required",
      400,
      "IMAGE_REQUIRED"
    );
  }

  const preset =
    getImagePreset(
      presetName
    );

  const originalMetadata =
    await validateImage(buffer);

  const processed =
    await compressImage(
      buffer,
      preset
    );

  return {
    buffer: processed.buffer,

    extension: "webp",

    mimeType: "image/webp",

    width: preset.width,
    height: preset.height,

    size:
      processed.buffer.length,

    quality:
      processed.quality,

    original: {
      format:
        originalMetadata.format,

      width:
        originalMetadata.width,

      height:
        originalMetadata.height,

      size:
        buffer.length,
    },
  };
}