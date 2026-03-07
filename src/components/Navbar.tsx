"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-navy-950/95 backdrop-blur-sm border-b border-navy-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-black text-white tracking-tight uppercase">
            Caz Masters
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white/80 hover:text-white transition-colors text-base font-semibold">
              Home
            </Link>
            <Link href="/about" className="text-white/80 hover:text-white transition-colors text-base font-semibold">
              About
            </Link>
            <Link
              href="/register"
              className="bg-gold-400 hover:bg-gold-300 text-navy-950 font-black px-5 py-2 rounded-lg transition-colors text-sm uppercase tracking-wider"
            >
              Register
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2"
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
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" onClick={() => setOpen(false)} className="block text-white/80 hover:text-white py-2 font-semibold text-base">
              Home
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} className="block text-white/80 hover:text-white py-2 font-semibold text-base">
              About
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="block bg-gold-400 hover:bg-gold-300 text-navy-950 font-black px-5 py-2.5 rounded-lg text-center uppercase tracking-wider text-sm"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
