import NextAuth from "next-auth";
import type { GetServerSidePropsContext } from "next";
import { cache } from "react";

import { authConfig } from "./config";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const auth: (context?: GetServerSidePropsContext) => Promise<any> = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
