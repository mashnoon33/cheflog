"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <TRPCReactProvider>
      <SessionProvider>
        <HeroUIProvider navigate={router.push.bind(router)}>
          <NextThemesProvider {...themeProps}>
            {children}
          <Toaster position="top-right" richColors closeButton />
          </NextThemesProvider>
        </HeroUIProvider>
      </SessionProvider>
    </TRPCReactProvider>
  );
}
