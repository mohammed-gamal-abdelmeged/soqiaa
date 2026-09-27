/*
  Warnings:

  - Added the required column `csrfTokenHash` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "csrfTokenHash" VARCHAR(64) NOT NULL;
