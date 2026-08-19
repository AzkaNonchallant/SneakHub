"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LangProvider } from "@/lib/i18n"

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(

    () => new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 5 * 60_000 } } }),
  )
  return (
    <QueryClientProvider client={client}>
      <LangProvider>{children}</LangProvider>
    </QueryClientProvider>
  )
}