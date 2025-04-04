import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc-client";
import { Template } from "@prisma/client";

export function getTemplates() {
  const trpc = useTRPC();

  const options = trpc.template.list.queryOptions();

  return options;
}
