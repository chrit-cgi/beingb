import { createAuthClient } from "better-auth/react";

// No baseURL — better-auth client defaults to the current origin.
// This works correctly in both local dev and production without baking in a URL at build time.
export const authClient = createAuthClient({});

export const { signIn, signOut, signUp, useSession } = authClient;
