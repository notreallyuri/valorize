import { z } from "zod";
import { TemplateSchema } from "./template.schema";

const StateEnum = z.enum(["OPEN", "CLOSED", "ARCHIVED", "DELETED"]);
type State = z.infer<typeof StateEnum>;

export const DocumentSchema = z.object({
  id: z.number().int().positive().optional(), // Optional because it's auto-incremented
  name: z.string(),
  templateName: z.string(),
  templateVersion: z.string(),
  structure: z.any(), // Using any for Json type, could be refined if structure has a known shape
  currentState: StateEnum.default("OPEN"),
  Template: TemplateSchema.optional(), // Optional for when you don't need the relation
  updatedAt: z.date().optional(), // Optional as it's set by Prisma
  createdAt: z
    .date()
    .default(() => new Date())
    .optional(), // Optional as it's set by Prisma
});
