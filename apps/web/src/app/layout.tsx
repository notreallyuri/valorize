"use client";
import { inter, montserrat, jetBrainsMono } from "@/styles/fonts";
import ReactScan from "@/components/Default/react-scan";

import { cn } from "@/utils";
import "@/styles/globals.css";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TRPCProvider } from "@/utils/trpc-client";
import { useState } from "react";
import { AppRouter } from "@acme/routes";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: "http://localhost:3333",
        }),
      ],
    })
  );

  return (
    <html lang="en" className="">
      <ReactScan />
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <body
            className={cn(
              "font-body h-screen bg-gray-50 text-black antialiased",
              inter.variable,
              montserrat.variable,
              jetBrainsMono.variable
            )}
          >
            {children}
          </body>
        </TRPCProvider>
      </QueryClientProvider>
    </html>
  );
}
