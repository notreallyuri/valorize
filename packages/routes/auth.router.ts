import {
  router,
  publicProcedure,
  protectedProcedure,
  prisma,
} from "@acme/utils";
import { AppError } from "@acme/error";

export const authRouter = router({
  verify: publicProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.user) {
        throw new AppError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to access this page",
        });
      }

      return {
        authenticated: ctx.user !== null,
        user: ctx.user
          ? {
              id: ctx.user.id,
              name: ctx.user.name,
              email: ctx.user.email,
              role: ctx.user.role,
            }
          : null,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
});
