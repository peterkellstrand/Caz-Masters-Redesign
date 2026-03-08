import type { Metadata } from "next";
import Footer from "@/components/Footer";
import HamburgerMenu from "@/components/HamburgerMenu";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Caz Masters | Golf Course",
  description:
    "The Caz Masters - 18 holes of championship golf at Cazenovia Golf Club.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <HamburgerMenu />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
