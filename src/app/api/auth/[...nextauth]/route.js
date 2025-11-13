import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "../../../../../lib/mongodb"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

console.log("✅ [NextAuth] API route file is being loaded."); // <-- ADD THIS

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("✅ [NextAuth] Authorize function called."); // <-- ADD THIS

        if (!credentials?.email || !credentials?.password) {
          console.error("❌ [NextAuth] Missing credentials.");
          throw new Error("Missing credentials");
        }

        try {
          const client = await clientPromise;
          const db = client.db("ecommerce");
          const user = await db.collection("users").findOne({ email: credentials.email });

          if (!user) {
            console.error("❌ [NextAuth] No user found with email:", credentials.email);
            throw new Error("No user found with that email");
          }

          if (!user.password) {
            console.error("❌ [NextAuth] User has no password, likely a social account.");
            throw new Error("User does not have a password.");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          console.log(`[NextAuth] Password validation for ${credentials.email}: ${isValid}`); // <-- ADD THIS

          if (!isValid) {
            console.error("❌ [NextAuth] Incorrect password.");
            throw new Error("Incorrect password");
          }

          console.log("✅ [NextAuth] Authorization successful for:", user.email);
          return { id: user._id.toString(), name: user.name, email: user.email };
        } catch (error) {
            console.error("❌ [NextAuth] Error in authorize function:", error);
            throw new Error("Authentication failed.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // <-- ADD THIS for detailed logs
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
