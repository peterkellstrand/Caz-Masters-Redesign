import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#faf0e6] border-t border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs tracking-widest uppercase text-gray-500">
            &copy; {new Date().getFullYear()} The Caz Masters
          </p>
          <div className="flex gap-6 text-xs tracking-widest uppercase text-gray-500">
            <Link href="/course" className="hover:text-[#004225] transition-colors">Course</Link>
            <Link href="/club" className="hover:text-[#004225] transition-colors">Club</Link>
            <Link href="/register" className="hover:text-[#004225] transition-colors">Register</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
