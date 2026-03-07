import Image from "next/image";
import type { Metadata } from "next";
import RegistrationForm from "./RegistrationForm";

export const metadata: Metadata = {
  title: "Register | The Caz Masters",
  description: "Register for the 15th Annual Caz Masters charity golf tournament.",
};

export default function RegisterPage() {
  return (
    <>
      <section className="relative text-white py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Cazenovia Golf Club"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy-950/75" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-black mb-3 uppercase">You In?</h1>
          <p className="text-white/80 text-lg sm:text-xl font-light">
            Lock in your spot. $150. Let&apos;s do this.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <RegistrationForm />
        </div>
      </section>
    </>
  );
}
