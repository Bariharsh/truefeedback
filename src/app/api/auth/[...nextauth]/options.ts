import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

type AuthorizedUser = {
  id: string;
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  username: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "username or email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthorizedUser | null> {
        await dbConnect();
        try {
          const identifier = credentials?.identifier;
          const password = credentials?.password;

          if (!identifier || !password) {
            throw new Error("Username and Password are required");
          }

          const user = await UserModel.findOne({
            $or: [{ email: identifier }, { username: identifier }],
          });

          if (!user) {
            return null;
          }

          if (!user.isVerified) {
            return null;
          }

          const isPasswordCorrrect = await bcrypt.compare(
            password,
            user.password
          );

          if (!isPasswordCorrrect) {
            return null;
          }

          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.username,
            email: user.email,
            isVerified: user.isVerified,
            isAcceptingMessages: user.isAcceptingMessages,
            username: user.username,
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || user._id; // Always set id
        token._id = user._id || user.id; // Always set _id
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    // async session({ session, token }) {
    //   if (token) {
    //     session.user._id = token._id;
    //     session.user.isVerified = token.isVerified;
    //     session.user.isAcceptingMessages = token.isAcceptingMessages;
    //     session.user.username = token.username;
    //   }
    //   return session;
    // },
    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id || token.id,
          isVerified: token.isVerified,
          isAcceptingMessages: token.isAcceptingMessages,
          username: token.username,
          email: session.user?.email || "",
          name: session.user?.name || "",
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};
