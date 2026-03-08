import Image from "next/image";
import type { Metadata } from "next";
import RegistrationForm from "./RegistrationForm";

export const metadata: Metadata = {
  title: "Register | The Caz Masters",
  description: "Register for the 15th Annual Caz Masters charity golf tournament.",
};

export default function RegisterPage() {
  return (
    <div className="bg-[#faf0e6] min-h-screen">
      <section className="pt-16 pb-8 px-6 md:px-12 lg:px-20">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/cazmastersbadge_green.png"
            alt="Caz Masters"
            width={7177}
            height={1492}
            className="w-full max-w-2xl h-auto object-contain"
            priority
            unoptimized
          />
        </div>

        {/* Your $150 Gets You */}
        <div className="max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-[#004225] uppercase mb-10 text-center">
            Your $150 Gets You
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-[#004225] font-bold text-lg">Greens Fees</p>
              <p className="text-gray-600">9 holes with a cart at Cazenovia Golf Club. Show up and play.</p>
            </div>
            <div>
              <p className="text-[#004225] font-bold text-lg">Tournament Entry + Charity Donation</p>
              <p className="text-gray-600">Prizes, contests, and a donation to Caz Cares. Feel good about yourself for once.</p>
            </div>
            <div>
              <p className="text-[#004225] font-bold text-lg">Swag</p>
              <p className="text-gray-600">Tournament shirt and whatever else we throw at you. You&apos;ll look great.</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm text-center">
              Plus Snappy Griller dogs (the finest Syracuse has to offer), cold Labatts, and a post-round ceremony where we pretend to be Augusta for 20 minutes.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 px-6">
        <div className="max-w-xl mx-auto">
          <RegistrationForm />
        </div>
      </section>
    </div>
  );
}
