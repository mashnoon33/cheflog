
import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";
import * as React from "react";
import { Toaster } from "sonner";
import { CommandPallete } from "@/components/pallete";
export interface ProvidersProps {
  children: React.ReactNode;
}


export function Providers({ children }: ProvidersProps) {

  return (
    <TRPCReactProvider>
      <SessionProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
        <CommandPallete />
      </SessionProvider>
    </TRPCReactProvider>
  );
}
