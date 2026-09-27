import { env } from "../../config/env.js";

export function toPublicAssetUrl(
  publicPath
) {
  if (!publicPath) {
    return null;
  }

  if (
    /^https?:\/\//i.test(
      publicPath
    )
  ) {
    return publicPath;
  }

  return new URL(
    publicPath,
    env.assetBaseUrl
  ).toString();
}