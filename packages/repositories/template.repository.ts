import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@acme/utils";
import { PrismaClient } from "@prisma/client";
import { Template } from "@prisma/client";
import { AppError, PrismaError } from "@acme/error";
import { TemplateStructure, COLLECTIONS } from "@acme/interfaces";
import { mongoClient } from "@acme/database";
import { ObjectId } from "mongodb";

interface RepositoryInterface {
  create(
    name: string,
    version: string,
    structure: TemplateStructure
  ): Promise<Template>;
  get(
    templateName: string,
    templateVersion: string
  ): Promise<{
    templateName: string;
    templateVersion: string;
    structure: TemplateStructure;
  }>;
  list(): Promise<Template[]>;
  update(
    templateName: string,
    templateVersion: string,
    data: Partial<
      Omit<Template, "templateName" | "templateVersion" | "documents">
    >
  ): Promise<Template>;
  delete(templateName: string, templateVersion: string): Promise<void>;
}

export class Repository {
  constructor(private readonly db: PrismaClient) {}

  private handlePrismaError(error: any): void {
    if (error instanceof PrismaClientKnownRequestError)
      throw new PrismaError(error);
    else throw error;
  }

  async create(
    name: string,
    version: string,
    structure: TemplateStructure
  ): Promise<Template> {
    const db = mongoClient.getDb();
    const collection = db.collection(COLLECTIONS.TEMPLATE_STRUCTURES);

    const templateStructures: TemplateStructure = structure;

    const res = await collection.insertOne(templateStructures);

    return await prisma.template.create({
      data: {
        templateName: name,
        templateVersion: version,
        structureId: res.insertedId.toString(),
      },
    });
  }

  async get(
    templateName: string,
    templateVersion: string
  ): Promise<{
    templateName: string;
    templateVersion: string;
    structure: TemplateStructure;
  }> {
    const db = mongoClient.getDb();
    const collection = db.collection(COLLECTIONS.TEMPLATE_STRUCTURES);

    const template = await prisma.template.findUnique({
      where: {
        templateName_templateVersion: { templateName, templateVersion },
      },
    });

    if (!template) throw new AppError({ code: "NOT_FOUND" });
    if (!template.structureId) throw new AppError({ code: "BAD_REQUEST" });

    const structure = await collection.findOne({
      _id: new ObjectId(template.structureId),
    });

    if (!structure) throw new AppError({ code: "BAD_REQUEST" });

    return {
      templateName,
      templateVersion,
      structure,
    };
  }

  async list() {
    const res = await prisma.template.findMany();

    if (!res) throw new AppError({ code: "NOT_FOUND" });

    return res;
  }

  async update(
    templateName: string,
    templateVersion: string,
    newVersion: string,
    structure: TemplateStructure
  ) {
    const db = mongoClient.getDb();
    const collection = db.collection(COLLECTIONS.TEMPLATE_STRUCTURES);

    const template = await prisma.template.findUnique({
      where: {
        templateName_templateVersion: { templateName, templateVersion },
      },
    });

    if (!template) throw new AppError({ code: "NOT_FOUND" });
    if (!template.structureId) throw new AppError({ code: "BAD_REQUEST" });

    const previousStructure = await collection.findOne({
      _id: new ObjectId(template.structureId),
    });

    if (!previousStructure) throw new AppError({ code: "BAD_REQUEST" });

    await collection.updateOne(
      { _id: new ObjectId(template.structureId) },
      structure
    );

    await prisma.template.update({
      where: {
        templateName_templateVersion: { templateName, templateVersion },
      },
      data: { templateVersion: newVersion },
    });
  }

  async delete(templateName: string, templateVersion: string) {
    const db = mongoClient.getDb();
    const collection = db.collection(COLLECTIONS.TEMPLATE_STRUCTURES);

    const template = await prisma.template.findUnique({
      where: {
        templateName_templateVersion: { templateName, templateVersion },
      },
    });

    if (!template) throw new AppError({ code: "NOT_FOUND" });
    if (!template.structureId) throw new AppError({ code: "BAD_REQUEST" });

    await collection.deleteOne({ _id: new ObjectId(template.structureId) });
    await prisma.template.delete({
      where: {
        templateName_templateVersion: { templateName, templateVersion },
      },
    });
  }
}

export const templateRepository = new Repository(prisma);
