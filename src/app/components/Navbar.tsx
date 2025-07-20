"use client";
import Link from 'next/link';
import { useSession,signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from "@/app/components/ui/button";

const Navbar = () => {

    const {data: session} = useSession()
    const user: User = session?.user

  return (
    <nav className='p-4 mb:p-6 shadow-md flex justify-between items-center'>
        <div className='container mx-auto flex justify-between items-center md:flex-row flex-col'>
            <Link href="/" className='text-xl font-bold mb-4 mb:mb-0'>TrueFeedback</Link>
            {
                session? (
                    <>
                    <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                    <Button onClick={() => signOut()} className='w-full md:w-auto'>Logout</Button>
                    </>
                ) : (
                    <Link href='/sign-in'>
                        <Button className='w-full md:w-auto'>Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar





