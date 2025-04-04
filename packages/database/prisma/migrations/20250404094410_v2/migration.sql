/*
  Warnings:

  - You are about to drop the column `name` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `structure` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `structure` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[documentName]` on the table `documents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[template_name,documentName]` on the table `documents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documentName` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "documents_template_name_name_key";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "name",
DROP COLUMN "structure",
ADD COLUMN     "documentName" TEXT NOT NULL,
ADD COLUMN     "structureId" TEXT;

-- AlterTable
ALTER TABLE "templates" DROP COLUMN "structure",
ADD COLUMN     "structureId" TEXT;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");

-- CreateIndex
CREATE INDEX "users_cpf_idx" ON "users"("cpf");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "documents_documentName_key" ON "documents"("documentName");

-- CreateIndex
CREATE UNIQUE INDEX "documents_template_name_documentName_key" ON "documents"("template_name", "documentName");
