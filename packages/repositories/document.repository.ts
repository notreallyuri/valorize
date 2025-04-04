import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Document, Prisma, PrismaClient } from "@prisma/client";
import { prisma, app } from "@acme/utils";
import { AppError, PrismaError } from "@acme/error";
import { COLLECTIONS, DocumentStructure } from "@acme/interfaces";
import { mongoClient } from "@acme/database";
import { Collection, ObjectId } from "mongodb";
import { Logger } from "pino";

interface RepositoryInterface {
  create(
    templateName: string,
    documentName: string,
    templateVersion: string,
    structure: DocumentStructure
  ): Promise<Document>;
  get(templateName: string, documentName: string): Promise<Document | null>;
  list(templateName: string, templateVersion?: string): Promise<Document[]>;
  update(
    templateName: string,
    documentName: string,
    data: Partial<Document>
  ): Promise<Document>;
  delete(templateName: string, name: string): Promise<Document>;
}

class Repository {
  constructor(private readonly db: PrismaClient) {}

  private handlePrismaError(error: any): void {
    if (error instanceof PrismaClientKnownRequestError)
      throw new PrismaError(error);
    else throw error;
  }

  async create(
    templateName: string,
    documentName: string,
    templateVersion: string,
    structure: DocumentStructure
  ): Promise<Document> {
    try {
      const db = mongoClient.getDb();
      const collection = db.collection(COLLECTIONS.DOCUMENT_STRUCTURES);

      const res = await collection.insertOne(structure);

      return await this.db.document.create({
        data: {
          templateName,
          templateVersion,
          documentName,
          structureId: res.insertedId.toString(),
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
      throw new AppError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed creating document",
        cause: error,
      });
    }
  }

  async get(
    templateName: string,
    documentName: string
  ): Promise<{
    templateName: string;
    documentName: string;
    structure: DocumentStructure;
  }> {
    try {
      const document = await this.db.document.findUnique({
        where: { templateName_documentName: { templateName, documentName } },
      });

      if (!document)
        throw new AppError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      if (!document.structureId)
        throw new AppError({
          code: "BAD_REQUEST",
          message: "Structure ID not found",
        });

      const db = mongoClient.getDb();
      const collection = db.collection(COLLECTIONS.DOCUMENT_STRUCTURES);

      const structure = await collection.findOne({
        _id: new ObjectId(document.structureId),
      });

      if (!structure) throw new AppError({ code: "BAD_REQUEST" });

      return {
        templateName,
        documentName,
        structure: structure as DocumentStructure,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      this.handlePrismaError(error);
      throw new AppError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error finding document",
        cause: error,
      });
    }
  }

  async list(
    templateName: string,
    templateVersion?: string
  ): Promise<Document[]> {
    try {
      const documents = await this.db.document.findMany({
        where: { templateName, templateVersion },
      });

      if (!documents || documents.length === 0) return [];

      return documents;
    } catch (error) {
      if (error instanceof AppError) throw error;
      this.handlePrismaError(error);
      throw new AppError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed listing documents",
        cause: error,
      });
    }
  }

  async update(
    templateName: string,
    documentName: string,
    structure?: DocumentStructure
  ): Promise<Document> {
    try {
      const document = await this.db.document.findUnique({
        where: { templateName_documentName: { templateName, documentName } },
      });

      if (!document) throw new AppError({ code: "NOT_FOUND" });
      if (!document.structureId) throw new AppError({ code: "BAD_REQUEST" });

      const db = mongoClient.getDb();
      const collection = db.collection(COLLECTIONS.DOCUMENT_STRUCTURES);

      if (structure) {
        const previousStructure = await collection.findOne({
          _id: new ObjectId(document.structureId),
        });

        if (!previousStructure) throw new AppError({ code: "BAD_REQUEST" });

        await collection.updateOne(
          { _id: new ObjectId(document.structureId) },
          { $set: structure }
        );
      }

      return document;
    } catch (error) {
      if (error instanceof AppError) throw error;
      this.handlePrismaError(error);
      throw new AppError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed updating document",
        cause: error,
      });
    }
  }

  async delete(templateName: string, documentName: string): Promise<Document> {
    try {
      const document = await this.db.document.findUnique({
        where: { templateName_documentName: { templateName, documentName } },
      });

      if (!document)
        throw new AppError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      if (!document.structureId)
        throw new AppError({
          code: "BAD_REQUEST",
          message: "Structure ID not found",
        });

      const db = mongoClient.getDb();
      const collection = db.collection(COLLECTIONS.DOCUMENT_STRUCTURES);

      await collection.deleteOne({ _id: new ObjectId(document.structureId) });

      return await this.db.document.delete({
        where: { templateName_documentName: { templateName, documentName } },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      this.handlePrismaError(error);
      throw new AppError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed deleting document",
        cause: error,
      });
    }
  }
}

export const documentRepository = new Repository(prisma);
