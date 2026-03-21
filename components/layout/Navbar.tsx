"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, MapPin } from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const loggedOutButtons = (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
      <Link href="/login" className="px-4 py-2 sm:px-3 text-xs sm:text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-[#85adff]/50 hover:text-white transition-colors duration-200 text-center w-full sm:w-auto">
        Sign in
      </Link>
      <div className="relative group w-full sm:w-auto">
         <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-[#85adff] opacity-20 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-40 group-hover:blur-xl group-hover:-m-3"></div>
         <Link href="/register" className="relative z-10 px-6 py-2 sm:px-4 text-xs sm:text-sm font-bold text-[#0e0e0e] bg-gradient-to-br from-[#85adff] to-[#ac8aff] rounded-full hover:opacity-90 active:scale-95 transition-all duration-200 text-center block w-full sm:w-auto">
           Sign Up
         </Link>
      </div>
    </div>
  );

  const loggedInUserMenu = (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center sm:justify-start mt-4 sm:mt-0 pb-4 sm:pb-0">
       <span className="hidden sm:block text-sm text-gray-300 font-semibold">
         {session?.user?.name ?? session?.user?.email}
       </span>
       {session?.user?.image && (
         <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full object-cover shadow-lg border border-white/10" />
       )}
       <button onClick={() => signOut({ callbackUrl: "/login" })} className="px-4 py-2 sm:px-3 text-xs sm:text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-[#ff716c]/50 hover:text-[#ff716c] transition-colors duration-200 w-full sm:w-auto">
         Sign out
       </button>
    </div>
  );

  // Hide entire navbar on auth pages
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  if (isAuthPage) return null;

  return (
    <header className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       px-6 py-2.5 backdrop-blur-xl shadow-2xl
                       ${headerShapeClass}
                       border border-white/5 bg-[#0e0e0e]/80
                       w-[calc(100%-2rem)] max-w-[1920px] sm:w-[95%] lg:w-[90%]
                       transition-[border-radius] duration-300 ease-in-out`}>

      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-12">
        
        {/* Logo area */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
           <MapPin className="h-6 w-6 text-[#85adff]" />
           <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-br from-[#85adff] to-[#ac8aff] hidden sm:block tracking-tighter">ParkFinder</span>
        </Link>

        {/* Center Links (As defined in user's UI payload structure for Navbar) */}
        <div className="hidden md:flex flex-1 justify-center min-w-[200px]">
           <div className="flex items-center gap-8 text-sm font-['Inter'] tracking-tight">
             <Link href="/" className={`${pathname === '/' ? "text-[#85adff] border-b-2 border-[#85adff]" : "text-gray-400 hover:text-gray-200"} pb-1 font-semibold transition-all duration-300`}>Map</Link>
             {session && (
               <>
                 <Link href="/bookings" className={`${pathname === '/bookings' ? "text-[#85adff] border-b-2 border-[#85adff]" : "text-gray-400 hover:text-gray-200"} pb-1 font-semibold transition-all duration-300`}>My Bookings</Link>
                 <Link href="/profile" className={`${pathname === '/profile' ? "text-[#85adff] border-b-2 border-[#85adff]" : "text-gray-400 hover:text-gray-200"} pb-1 font-semibold transition-all duration-300`}>Profile</Link>
               </>
             )}
           </div>
        </div>

        {/* Authentication Options */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          {session ? loggedInUserMenu : loggedOutButtons}
        </div>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-[#adaaaa] hover:text-white transition-colors focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Links */}
      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="mt-6 mb-4 flex flex-col gap-6 text-sm font-['Inter'] tracking-widest uppercase items-center text-center w-full border-t border-white/5 pt-4">
            <Link href="/" className={`${pathname === '/' ? "text-[#85adff] font-bold" : "text-[#adaaaa] font-medium"}`}>Map</Link>
            <Link href="/bookings" className={`${pathname === '/bookings' ? "text-[#85adff] font-bold" : "text-[#adaaaa] font-medium"}`}>My Bookings</Link>
            <Link href="/profile" className={`${pathname === '/profile' ? "text-[#85adff] font-bold" : "text-[#adaaaa] font-medium"}`}>Profile</Link>
        </div>
        {session ? loggedInUserMenu : loggedOutButtons}
      </div>
    </header>
  );
}