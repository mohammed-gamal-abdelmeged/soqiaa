import {
  defineConfig,
} from "vite";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import {
  VitePWA,
} from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    tailwindcss(),

    VitePWA({
      registerType:
        "autoUpdate",

      injectRegister:
        "auto",

      manifest:
        false,

      includeAssets: [
        "pwa-192.png",
        "pwa-512.png",
        "pwa-maskable-192.png",
        "pwa-maskable-512.png",
        "apple-touch-icon.png",
      ],

      workbox: {
        cleanupOutdatedCaches:
          true,

        navigateFallback:
          "/index.html",

        runtimeCaching: [
          {
            urlPattern: ({
              request,
            }) =>
              request.destination ===
              "image",

            handler:
              "CacheFirst",

            options: {
              cacheName:
                "soqiaa-admin-images",

              expiration: {
                maxEntries:
                  200,

                maxAgeSeconds:
                  60 *
                  60 *
                  24 *
                  30,
              },

              cacheableResponse: {
                statuses: [
                  0,
                  200,
                ],
              },
            },
          },

          {
            urlPattern: ({
              request,
            }) =>
              request.destination ===
              "font",

            handler:
              "CacheFirst",

            options: {
              cacheName:
                "soqiaa-admin-fonts",

              expiration: {
                maxEntries:
                  50,

                maxAgeSeconds:
                  60 *
                  60 *
                  24 *
                  365,
              },

              cacheableResponse: {
                statuses: [
                  0,
                  200,
                ],
              },
            },
          },
        ],
      },
    }),
  ],

  base:
    "/",
});