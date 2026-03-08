export default function Footer() {
  return (
    <footer className="bg-[#faf0e6] border-t border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <p className="text-xs tracking-widest uppercase text-gray-500 text-center">
          &copy; {new Date().getFullYear()} The Caz Masters
        </p>
      </div>
    </footer>
  );
}
