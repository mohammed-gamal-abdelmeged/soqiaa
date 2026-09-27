import {
  randomUUID,
} from "node:crypto";

export function createSlug(
  value
) {
  const slug = value
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(
      /[^\p{L}\p{N}]+/gu,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    )
    .replace(
      /-{2,}/g,
      "-"
    )
    .slice(0, 120);

  if (slug) {
    return slug;
  }

  return `item-${randomUUID().slice(
    0,
    8
  )}`;
}

export async function generateUniqueSlug({
  value,
  exists,
  maxLength = 140,
}) {
  const baseSlug =
    createSlug(value);

  let candidate =
    baseSlug.slice(
      0,
      maxLength
    );

  let counter = 1;

  while (
    await exists(candidate)
  ) {
    counter += 1;

    const suffix =
      `-${counter}`;

    candidate =
      `${baseSlug.slice(
        0,
        maxLength -
          suffix.length
      )}${suffix}`;
  }

  return candidate;
}