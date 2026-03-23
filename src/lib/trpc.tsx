"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import { PLATFORM_BASE_URL } from "./api-config";
import { handleUnauthorized } from "./fetch-utils";
import { getActiveTenantId, TenantProvider } from "./tenant-context";
import type { AppRouter } from "./trpc-types";

export const trpc = createTRPCReact<AppRouter>();

async function trpcFetchWithAuth(url: RequestInfo | URL, options?: RequestInit) {
  const res = await fetch(url, { ...options, credentials: "include" });
  if (res.status === 401) {
    handleUnauthorized();
  }
  return res;
}

/**
 * Vanilla tRPC client for imperative calls (not React hooks).
 * Used by admin-api.ts and other non-component code.
 */
export const trpcVanilla = createTRPCClient<AppRouter>({
  links: [
    httpBatchStreamLink({
      url: `${PLATFORM_BASE_URL}/trpc`,
      fetch: trpcFetchWithAuth,
      headers() {
        const tenantId = getActiveTenantId();
        return tenantId ? { "x-tenant-id": tenantId } : {};
      },
    }),
  ],
});

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry(failureCount, error) {
          // Never retry rate-limit (429) or auth (401) errors — retrying
          // amplifies the problem into an exponential request storm.
          if (error && typeof error === "object" && "data" in error) {
            const httpStatus = (error as { data?: { httpStatus?: number } }).data?.httpStatus;
            if (httpStatus === 429 || httpStatus === 401) return false;
          }
          return failureCount < 2;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function TRPCProvider({
  children,
  initialTenantId,
}: Readonly<{ children: React.ReactNode; initialTenantId?: string }>) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchStreamLink({
          url: `${PLATFORM_BASE_URL}/trpc`,
          fetch: trpcFetchWithAuth,
          headers() {
            const tenantId = getActiveTenantId();
            return tenantId ? { "x-tenant-id": tenantId } : {};
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TenantProvider initialTenantId={initialTenantId}>{children}</TenantProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
