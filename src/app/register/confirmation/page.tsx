import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LET'S FUCKING GO | The Caz Masters",
};

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const isPaid = status === "paid";

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-16 pb-8 px-6 md:px-12 lg:px-20">
        {/* Badge */}
        <div className="flex justify-center mb-12">
          <Image
            src="/images/cazmastersbadge.png"
            alt="Caz Masters"
            width={7177}
            height={1492}
            className="w-full max-w-2xl h-auto object-contain"
            priority
            unoptimized
          />
        </div>

        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-5xl sm:text-7xl font-black text-black uppercase mb-6 leading-none">
            Let&apos;s
            <br />
            Fucking
            <br />
            Go
          </h1>
          <p className="text-gray-600 text-xl mb-2">
            You&apos;re in. Welcome to the 15th Annual Caz Masters.
          </p>
          {isPaid ? (
            <p className="text-black font-bold text-lg mb-8">
              Paid up and ready to rip.
            </p>
          ) : (
            <div className="bg-gray-100 border-2 border-black p-4 mb-8">
              <p className="text-black font-bold">
                Bring $150 to check-in. Cash or card.
              </p>
            </div>
          )}
          <p className="text-gray-400 text-sm mb-10">
            Confirmation email incoming. Check spam if you don&apos;t see it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-white hover:bg-gray-50 text-black font-bold px-6 py-3 transition-colors border-2 border-black"
            >
              Back to Home
            </Link>
            <Link
              href="/about"
              className="bg-black hover:bg-gray-800 text-white font-bold px-6 py-3 transition-colors"
            >
              Read the Rules
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
