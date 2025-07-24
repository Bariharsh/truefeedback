import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

type AuthorizedUser = {
  id: string;
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
        email: { label: "Email", type: "text" },
        name: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthorizedUser | null>  {
        await dbConnect();
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing credentials");
        }
        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials.email }, { username: credentials.name }],
          });

          if (!user) {
            throw new Error("User not found");
            return null;
          }

          if (!user.isVerified) {
            throw new Error(
              "User is not verified. Please verify your account."
            );
          }
          const isPasswordCorrrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrrect) {
            return null
          }
          const authorizedUser: AuthorizedUser = {
            id: user._id.toString(),
            name: user.name, 
            email: user.email,
            isVerified: user.isVerified,
            isAcceptingMessages: user.isAcceptingMessages,
            username: user.username,
          };
          
          return authorizedUser;
        } catch (error: unknown) {
          console.error("Error logging in:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
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
      if (token && session.user) {
        session.user = {
          ...session.user,
          _id: token._id,
          isVerified: token.isVerified,
          isAcceptingMessages: token.isAcceptingMessages,
          username: token.username,
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
  secret: process.env.NEXTAUTH_SECRET,
};
