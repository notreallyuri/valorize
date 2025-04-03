import type { AppRouter } from "@acme/routes";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useQuery } from "@tanstack/react-query";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
