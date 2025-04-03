import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc-client";
import { TemplateProps } from "@acme/interfaces";

export function getTemplates() {
  const trpc = useTRPC();

  const options = trpc.template.list.queryOptions();
  
  
}
