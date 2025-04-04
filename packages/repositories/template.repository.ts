import { prisma } from "@acme/utils";
import { PrismaClient } from "@prisma/client";
import { Template } from "@prisma/client";
import { AppError } from "@acme/error";
import { TemplateStructure, COLLECTIONS } from "@acme/interfaces";
import { handleRepositoryError } from "./utility";
import { mongoClient } from "@acme/database";
import { ObjectId } from "mongodb";

export class Repository {
  constructor(private readonly db: PrismaClient) {}

  async create(
    templateName: string,
    templateVersion: string,
    structure: TemplateStructure
  ): Promise<Template> {
    try {
      const db = mongoClient.getDb();
      const collection = db.collection(COLLECTIONS.TEMPLATE_STRUCTURES);

      const res = await collection.insertOne(structure);

      return await this.db.template.create({
        data: {
          templateName,
          templateVersion,
          structureId: res.insertedId.toString(),
        },
      });
    } catch (error) {
      handleRepositoryError(error, "template creation");
    }
  }

  async get(
    templateName: string,
    templateVersion: string
  ): Promise<{
    templateName: string;
    templateVersion: string;
    structure: TemplateStructure;
  }> {
    try {
      const template = await this.db.template.findUnique({
        where: {
          templateName_templateVersion: { templateName, templateVersion },
        },
      });

      if (!template)
        throw new AppError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      if (!template.structureId)
        throw new AppError({
          code: "BAD_REQUEST",
          message: "Structure ID not found",
        });

      const db = mongoClient.getDb();
      const collection = db.collection(COLLECTIONS.TEMPLATE_STRUCTURES);

      const structure = await collection.findOne({
        _id: new ObjectId(template.structureId),
      });

      if (!structure) throw new AppError({ code: "BAD_REQUEST" });

      return {
        templateName,
        templateVersion,
        structure: structure as TemplateStructure,
      };
    } catch (error) {
      handleRepositoryError(error, "template get");
    }
  }

  async list() {
    try {
      const templates = await this.db.template.findMany();

      if (!templates || templates.length === 0) {
        return [];
      }

      return templates;
    } catch (error) {
      handleRepositoryError(error, "template listing");
    }
  }

  async update(
    templateName: string,
    templateVersion: string,
    newVersion: string,
    structure: TemplateStructure
  ): Promise<Template> {
    try {
      const template = await this.db.template.findUnique({
        where: {
          templateName_templateVersion: { templateName, templateVersion },
        },
      });

      if (!template)
        throw new AppError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      if (!template.structureId)
        throw new AppError({
          code: "BAD_REQUEST",
          message: "Structure ID not found",
        });

      const db = mongoClient.getDb();
      const collection = db.collection(COLLECTIONS.TEMPLATE_STRUCTURES);

      const previousStructure = await collection.findOne({
        _id: new ObjectId(template.structureId),
      });

      if (!previousStructure)
        throw new AppError({
          code: "BAD_REQUEST",
          message: "Structure not found",
        });

      await collection.updateOne(
        { _id: new ObjectId(template.structureId) },
        { $set: structure }
      );

      return await this.db.template.update({
        where: {
          templateName_templateVersion: { templateName, templateVersion },
        },
        data: { templateVersion: newVersion },
      });
    } catch (error) {
      handleRepositoryError(error, "template update");
    }
  }

  async delete(
    templateName: string,
    templateVersion: string
  ): Promise<Template> {
    try {
      const template = await this.db.template.findUnique({
        where: {
          templateName_templateVersion: { templateName, templateVersion },
        },
      });

      if (!template)
        throw new AppError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      if (!template.structureId)
        throw new AppError({
          code: "BAD_REQUEST",
          message: "Structure ID not found",
        });

      const db = mongoClient.getDb();
      const collection = db.collection(COLLECTIONS.TEMPLATE_STRUCTURES);

      await collection.deleteOne({ _id: new ObjectId(template.structureId) });
      return await this.db.template.delete({
        where: {
          templateName_templateVersion: { templateName, templateVersion },
        },
      });
    } catch (error) {
      handleRepositoryError(error, "template deletion");
    }
  }
}

export const templateRepository = new Repository(prisma);


