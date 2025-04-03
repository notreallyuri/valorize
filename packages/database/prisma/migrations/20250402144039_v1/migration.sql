-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'FINANCE', 'HR', 'USER');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('CLOSED', 'PENDING', 'OPEN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "template_name" TEXT NOT NULL,
    "template_version" TEXT NOT NULL,
    "structure" JSONB NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("template_name","template_version")
);

-- CreateTable
CREATE TABLE "documents" (
    "document_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "template_name" TEXT NOT NULL,
    "template_version" TEXT NOT NULL,
    "structure" JSONB NOT NULL,
    "currentState" "State" NOT NULL DEFAULT 'OPEN',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("document_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "User_cpf_idx" ON "User"("cpf");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "templates_template_name_idx" ON "templates"("template_name");

-- CreateIndex
CREATE INDEX "documents_template_name_template_version_idx" ON "documents"("template_name", "template_version");

-- CreateIndex
CREATE UNIQUE INDEX "documents_template_name_name_key" ON "documents"("template_name", "name");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_template_name_template_version_fkey" FOREIGN KEY ("template_name", "template_version") REFERENCES "templates"("template_name", "template_version") ON DELETE RESTRICT ON UPDATE CASCADE;
