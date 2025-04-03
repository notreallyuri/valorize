import type { Context } from "@acme/utils";
import { initTRPC } from "@trpc/server";
import { AppError } from "@acme/error";
import { Role } from "@prisma/client";

const t = initTRPC.context<Context>().create();

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new AppError({
      code: "UNAUTHORIZED",
      message: "Unauthorized: User not authenticated",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

const createMiddleware = (allowedRole?: Role) => {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new AppError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const isAdmin = ctx.user.role === "ADMIN";
    const hasAllowedRole = allowedRole ? ctx.user.role === allowedRole : false;

    if (!isAdmin && !hasAllowedRole) {
      const message = allowedRole
        ? `Access restricted: ${allowedRole} or ADMIN role required`
        : "Access restricted: ADMIN role required";

      throw new AppError({
        code: "FORBIDDEN",
        message,
        meta: {
          user: ctx.user,
        },
      });
    }

    return next({ ctx });
  });
};

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authMiddleware);

export const adminProcedure = t.procedure.use(createMiddleware());
export const hrProcedure = t.procedure.use(createMiddleware("HR"));
export const managerProcedure = t.procedure.use(createMiddleware("MANAGER"));
export const financeProcedure = t.procedure.use(createMiddleware("FINANCE"));
