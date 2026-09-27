import app from "./app.js";

import { env } from "./config/env.js";
import { prisma } from "./database/prisma.js";

async function startServer() {
  try {
    /*
     * Fail fast if the database
     * is unavailable.
     */
    await prisma.$connect();

    console.log(
      "Database connection established"
    );

    const server = app.listen(
      env.port,
      () => {
        console.log(
          `Soqiaa API running on port ${env.port}`
        );
      }
    );

    server.on("error", async (error) => {
      console.error(
        "Server error:",
        error
      );

      await prisma.$disconnect();

      process.exit(1);
    });

    /*
     * Graceful shutdown.
     */
    async function shutdown(signal) {
      console.log(
        `${signal} received. Shutting down...`
      );

      server.close(async () => {
        await prisma.$disconnect();

        console.log(
          "Database connection closed"
        );

        process.exit(0);
      });
    }

    process.on("SIGINT", () =>
      shutdown("SIGINT")
    );

    process.on("SIGTERM", () =>
      shutdown("SIGTERM")
    );
  } catch (error) {
    console.error(
      "Failed to start application:",
      error
    );

    await prisma
      .$disconnect()
      .catch(() => {});

    process.exit(1);
  }
}

startServer();