import { authRouter } from "./auth.router";
import { userRouter } from "./user.router";
import { templateRouter } from "./template.router";
import { router } from "@acme/utils";

export const appRouter = router({
  users: userRouter,
  auth: authRouter,
  template: templateRouter,
});

export type AppRouter = typeof appRouter;
