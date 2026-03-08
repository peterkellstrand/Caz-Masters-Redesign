"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-16">
          {/* Left nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/course" className="text-xs tracking-widest uppercase text-gray-600 hover:text-black transition-colors">
              Course
            </Link>
            <Link href="/club" className="text-xs tracking-widest uppercase text-gray-600 hover:text-black transition-colors">
              Club
            </Link>
            <Link href="/hospitality" className="text-xs tracking-widest uppercase text-gray-600 hover:text-black transition-colors">
              Hospitality
            </Link>
          </div>

          {/* Center logo */}
          <Link href="/" className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span className="text-sm font-bold tracking-wider uppercase">Caz Masters</span>
          </Link>

          {/* Right - Book Now button */}
          <div className="hidden md:block">
            <Link
              href="/register"
              className="bg-black hover:bg-gray-800 text-white text-xs tracking-widest uppercase px-6 py-3 transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-black p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="/course" onClick={() => setOpen(false)} className="block text-xs tracking-widest uppercase text-gray-600 hover:text-black py-2">
              Course
            </Link>
            <Link href="/club" onClick={() => setOpen(false)} className="block text-xs tracking-widest uppercase text-gray-600 hover:text-black py-2">
              Club
            </Link>
            <Link href="/hospitality" onClick={() => setOpen(false)} className="block text-xs tracking-widest uppercase text-gray-600 hover:text-black py-2">
              Hospitality
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="block bg-black text-white text-xs tracking-widest uppercase px-6 py-3 text-center"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
