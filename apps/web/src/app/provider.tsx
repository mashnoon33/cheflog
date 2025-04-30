"use client";

import type { ThemeProviderProps } from "next-themes";

import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";
import { Toaster } from "sonner";
import { CommandPallete } from "@/components/pallete";
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}


export function Providers({ children, themeProps }: ProvidersProps) {

  return (
    <TRPCReactProvider>
      <SessionProvider>
          <NextThemesProvider {...themeProps}>
            {children}
          <Toaster position="top-right" richColors closeButton />
          <CommandPallete />
          </NextThemesProvider>
      </SessionProvider>
    </TRPCReactProvider>
  );
}
