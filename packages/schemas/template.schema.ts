import { z } from "zod";

export const TemplateSchema = z.object({
  templateName: z.string(),
  templateVersion: z.string(),
  structure: z.any(),
});

export const TemplateStructureSchema = z.record(
  z.string(),
  z.union([
    z.literal("string"),
    z.literal("number"),
    z.array(z.string()),
    z.object({ type: z.literal("date"), value: z.string() }),
    z.boolean(),
  ])
);

export const TemplateDocumentSchema = z.object({
  templateName: z.string(),
  templateVersion: z.string(),
  structure: TemplateStructureSchema,
});
