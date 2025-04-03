import { router, managerProcedure } from "@acme/utils";
import { userRepository } from "@acme/repositories";
import { UserSchema } from "@acme/schemas";
import { AppError } from "@acme/error";
import { z } from "zod";

export const userRouter = router({
  create: managerProcedure.input(UserSchema).mutation(async ({ input }) => {
    try {
      return await userRepository.create(input);
    } catch (error) {
      throw new AppError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create user",
        cause: error,
      });
    }
  }),

  getById: managerProcedure.input(z.string()).query(async ({ input }) => {
    try {
      return await userRepository.get(input);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get user",
        cause: error,
      });
    }
  }),

  getAll: managerProcedure.query(async () => {
    return await userRepository.getAll();
  }),

  update: managerProcedure
    .input(UserSchema.partial().extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;

        if (Object.keys(data).length === 0) {
          throw new AppError({
            code: "BAD_REQUEST",
            message: "No fields provided for update",
          });
        }

        return await userRepository.update(id, data);
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed updating user",
          cause: error,
        });
      }
    }),

  delete: managerProcedure.input(z.string()).mutation(async ({ input }) => {
    try {
      return await userRepository.delete(input);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed deleting user",
        cause: error,
      });
    }
  }),
});
