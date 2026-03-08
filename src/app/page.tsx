import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/components/CountdownTimer";
import SpotsCounter from "@/components/SpotsCounter";
import ImageCarousel from "@/components/ImageCarousel";
import { TOURNAMENT } from "@/lib/tournament";


export default function Home() {
  return (
    <div className="bg-[#faf0e6]">
      {/* Hero Section */}
      <section className="px-6 md:px-12 lg:px-20 pt-24 pb-12 md:pb-20">
        {/* Main Title Badge */}
        <div className="flex justify-center px-4">
          <Image
            src="/images/cazmastersbadge_green.png"
            alt="Caz Masters"
            width={7177}
            height={1492}
            className="w-full max-w-[85vw] md:max-w-[62vw] h-auto object-contain"
            priority
            unoptimized
          />
        </div>

        {/* Date */}
        <p className="text-center text-sm md:text-xl lg:text-2xl uppercase tracking-widest mt-16 md:mt-24 mb-4 md:mb-6 font-medium">
          July 4th Weekend, 2026
        </p>

        {/* Countdown */}
        <div className="flex justify-center mb-8">
          <CountdownTimer />
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/register"
            className="inline-block bg-transparent border-2 md:border-4 border-[#004225] text-[#004225] font-black text-sm md:text-lg px-6 md:px-10 py-2.5 md:py-4 rounded-full transition-all hover:bg-[#004225] hover:text-white uppercase tracking-wide"
          >
            Register Now
          </Link>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between w-[95%] md:w-[58%] mx-auto mt-12 md:mt-32 mb-0">
          <Image
            src="/images/yards_green.png"
            alt="2851 Yards"
            width={300}
            height={150}
            className="w-auto h-24 md:h-32 lg:h-40 object-contain"
            unoptimized
          />
          <Image
            src="/images/holes_green.png"
            alt="9 Holes"
            width={300}
            height={150}
            className="w-auto h-24 md:h-32 lg:h-40 object-contain"
            unoptimized
          />
          <Image
            src="/images/par_green.png"
            alt="35 Par"
            width={300}
            height={150}
            className="w-auto h-24 md:h-32 lg:h-40 object-contain"
            unoptimized
          />
        </div>
      </section>

      {/* Photo Carousel */}
      <ImageCarousel />

      {/* The Pitch */}
      <section className="relative py-28 sm:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/guys-dudes-1.jpg"
            alt="On the course"
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-[#004225]/60" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <p className="text-2xl sm:text-4xl leading-relaxed font-medium">
            Time to dust off the sticks and practice powering down some beers.
            9 holes. Best friends. All for charity. You know the deal.
          </p>
        </div>
      </section>


      {/* Dealer's Choice */}
      <section className="py-16 sm:py-20 bg-[#faf0e6]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-[#004225] uppercase mb-4">
            Dealer&apos;s Choice
          </h2>
          <p className="text-xl text-[#004225] font-medium leading-relaxed">
            Hit a bad shot, crush a cold one, and reload a second chance. Add $5 to the pot.
          </p>
        </div>
      </section>


      {/* Tagline */}
      <section className="bg-[#faf0e6] text-center py-4">
        <p className="text-[#004225] text-xs uppercase tracking-[0.2em]">
          Brought to You by The Dog
        </p>
      </section>
    </div>
  );
}
