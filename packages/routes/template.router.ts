import { router, publicProcedure, protectedProcedure } from "@acme/utils";
import { templateRepository } from "@acme/repositories";
import { TemplateSchema } from "@acme/schemas";
import z from "zod";
import { Prisma } from "@prisma/client";

export const templateRouter = router({
  create: protectedProcedure
    .input(TemplateSchema)
    .mutation(async ({ input }) => {
      try {
        return await templateRepository.create({
          ...input,
        });
      } catch (error) {}
    }),

  update: protectedProcedure
    .input(TemplateSchema)
    .mutation(async ({ input }) => {
      try {
        return await templateRepository.update(
          input.templateName,
          input.templateVersion
        );
      } catch (error) {}
    }),

  get: protectedProcedure
    .input(z.object({ templateName: z.string(), templateVersion: z.string() }))
    .query(async ({ input }) => {
      try {
        return await templateRepository.get(
          input.templateName,
          input.templateVersion
        );
      } catch (error) {}
    }),

  list: protectedProcedure.output(z.array(TemplateSchema)).query(async () => {
    try {
      return await templateRepository.list();
    } catch (error) {
      return [];
    }
  }),

  delete: protectedProcedure
    .input(z.object({ templateName: z.string(), templateVersion: z.string() }))
    .mutation(async ({ input }) => {
      try {
        return await templateRepository.delete(
          input.templateName,
          input.templateVersion
        );
      } catch (error) {}
    }),
});
