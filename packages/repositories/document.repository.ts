import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Document, Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@acme/utils";
import { AppError, PrismaError } from "@acme/error";

interface RepositoryInterface {
  create(data: Document): Promise<Document>;
  get(templateName: string, name: string): Promise<Document | null>;
  list(templateName: string, templateVersion?: string): Promise<Document[]>;
  update(
    templateName: string,
    name: string,
    data: Partial<Document>
  ): Promise<Document>;
  delete(templateName: string, name: string): Promise<Document>;
}

class Repository implements RepositoryInterface {
  constructor(private readonly db: PrismaClient) {}

  private handlePrismaError(error: any): void {
    if (error instanceof PrismaClientKnownRequestError)
      throw new PrismaError(error);
    else throw error;
  }

  async create(
    data: Document & {
      structure: Prisma.InputJsonValue;
    }
  ): Promise<Document> {
    try {
      return await this.db.document.create({ data });
    } catch (error) {
      this.handlePrismaError(error);
      throw new AppError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }

  async get(templateName: string, name: string): Promise<Document | null> {
    try {
      return await this.db.document.findUnique({
        where: { templateName_name: { templateName, name } },
      });
    } catch (error) {
      this.handlePrismaError(error);
      throw new AppError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }

  async list(
    templateName: string,
    templateVersion?: string
  ): Promise<Document[]> {
    try {
      if (templateVersion)
        return await this.db.document.findMany({
          where: { templateName, templateVersion },
        });

      return await this.db.document.findMany({ where: { templateName } });
    } catch (error) {
      this.handlePrismaError(error);
      throw new AppError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }

  async update(
    templateName: string,
    name: string,
    data: Partial<Document> & {
      structure: Prisma.InputJsonValue;
      metadata: Prisma.InputJsonValue;
    }
  ): Promise<Document> {
    try {
      return await this.db.document.update({
        where: { templateName_name: { templateName, name } },
        data,
      });
    } catch (error) {
      this.handlePrismaError(error);
      throw new AppError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }

  async delete(templateName: string, name: string): Promise<Document> {
    try {
      return await this.db.document.delete({
        where: {
          templateName_name: { templateName, name },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
      throw new AppError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
}

export const documentRepository = new Repository(prisma);
