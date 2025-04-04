import { ObjectId } from "mongodb";

export interface TemplateStructure {
  [key: string]:
    | "string"
    | "number"
    | "boolean"
    | "array"
    | { [key: string]: "string" | "number" | "boolean" | "array" };
}

export interface MongoTemplate {
  _id?: ObjectId;
  structure: TemplateStructure;
}

export interface DocumentStructure {
  _id?: ObjectId;
  structure: {
    [key: string]:
      | string
      | number
      | boolean
      | any[]
      | { [key: string]: string | number | boolean | any[] };
  };
}

export interface MongoDocument {
  _id?: ObjectId;
  structure: DocumentStructure;
}

export const COLLECTIONS = {
  TEMPLATE_STRUCTURES: "templateStructures",
  DOCUMENT_STRUCTURES: "documentStructures",
} as const;
