import { router, publicProcedure, protectedProcedure } from "@acme/utils";
import { documentRepository } from "@acme/repositories";
import { TemplateSchema } from "@acme/schemas";
import z from "zod";
import { Prisma } from "@prisma/client";

export const documentRouter = router({});
