"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="bg-gray-950 text-white shadow-md px-6 py-4 border-b border-gray-800">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-indigo-500 hover:text-indigo-400 transition-colors"
        >
          Feednix
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-gray-300">
                Welcome,{" "}
                <span className="font-semibold text-white">
                  {user?.username || user?.email}
                </span>
              </span>
              <Button
                onClick={() => signOut()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
            <Link href="/sign-in">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Login
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button className="bg-green-600 hover:bg-green-500  text-white">
                Sign Up
              </Button>
            </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
