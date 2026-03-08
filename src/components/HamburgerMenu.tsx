"use client";

import { useState } from "react";
import Link from "next/link";

const menuItems = [
  { href: "/", label: "Home" },
  { href: "/register", label: "Register" },
  { href: "/scorecard", label: "Live Scorecard" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-6 right-6 z-50 w-12 h-12 flex flex-col items-center justify-center gap-1.5 rounded-full transition-all duration-300 ${
          isOpen ? "bg-transparent" : "bg-[#faf0e6] shadow-lg hover:shadow-xl"
        }`}
        aria-label="Toggle menu"
      >
        <span
          className={`block w-6 h-0.5 transition-all duration-300 ease-out ${
            isOpen ? "rotate-45 translate-y-2 bg-[#faf0e6]" : "bg-[#004225]"
          }`}
        />
        <span
          className={`block w-6 h-0.5 transition-all duration-300 ease-out ${
            isOpen ? "opacity-0 scale-0 bg-[#faf0e6]" : "bg-[#004225]"
          }`}
        />
        <span
          className={`block w-6 h-0.5 transition-all duration-300 ease-out ${
            isOpen ? "-rotate-45 -translate-y-2 bg-[#faf0e6]" : "bg-[#004225]"
          }`}
        />
      </button>

      {/* Full Screen Modal */}
      <div
        className={`fixed inset-0 bg-[#004225] z-40 transition-opacity duration-300 flex items-center justify-center ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className={`transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          <ul className="space-y-4 text-center">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-4xl font-black uppercase tracking-wider text-white hover:text-gray-400 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
