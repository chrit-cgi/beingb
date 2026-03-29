import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[auth] authorize called for:", credentials?.email);
        if (!credentials?.email || !credentials?.password) return null;

        console.log("[auth] importing modules");
        const { db } = await import("@/lib/db");
        const { users } = await import("@/db/schema");
        const { eq } = await import("drizzle-orm");
        const bcrypt = await import("bcryptjs");

        console.log("[auth] querying user");
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });
        console.log("[auth] user found:", !!user, "has password:", !!user?.password);

        if (!user?.password) return null;

        console.log("[auth] comparing password");
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        console.log("[auth] password valid:", valid);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
