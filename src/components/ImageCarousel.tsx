"use client";

import Image from "next/image";
import { useState } from "react";

const topRowImages = [
  { src: "/images/group-2018.jpg", alt: "The whole crew", size: "large" },
  { src: "/images/fore-america.jpg", alt: "Golfer swinging", size: "small" },
  { src: "/images/guys-dudes-3.jpg", alt: "On the green", size: "medium" },
  { src: "/images/jacket-handoff-2019.jpg", alt: "Jacket ceremony", size: "small" },
  { src: "/images/hero.jpg", alt: "Course view", size: "large" },
  { src: "/images/cots.jpg", alt: "Tournament scene", size: "medium" },
  { src: "/images/champion-2016.jpg", alt: "2016 Champion", size: "small" },
  { src: "/images/ultimate-power.jpg", alt: "Ultimate power", size: "large" },
  { src: "/images/apr-2017.jpg", alt: "April 2017", size: "medium" },
];

const bottomRowImages = [
  { src: "/images/guys-dudes-1.jpg", alt: "On the tee", size: "medium" },
  { src: "/images/knees-weak.jpg", alt: "Putting", size: "large" },
  { src: "/images/broiler.jpg", alt: "The Broiler", size: "small" },
  { src: "/images/new-champ.jpg", alt: "The champ", size: "large" },
  { src: "/images/team-winner-2019.jpg", alt: "Team winners", size: "medium" },
  { src: "/images/champion-2015.png", alt: "2015 Champion", size: "small" },
  { src: "/images/champion-2017.png", alt: "2017 Champion", size: "large" },
  { src: "/images/champion-2018.png", alt: "2018 Champion", size: "medium" },
  { src: "/images/img-1106.jpg", alt: "Golf action", size: "small" },
];

function getWidth(size: string) {
  switch (size) {
    case "small": return "16vw";
    case "medium": return "20vw";
    case "large": return "24vw";
    default: return "20vw";
  }
}

export default function ImageCarousel() {
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .scroll-row-1 {
          animation: marquee 80s linear infinite;
        }
        .scroll-row-2 {
          animation: marquee 90s linear infinite;
        }
      `}</style>

      <div className="overflow-hidden py-2 space-y-1">
        {/* Top Row */}
        <div className="overflow-hidden">
          <div className="scroll-row-1 flex gap-1" style={{ width: 'max-content' }}>
            {[...topRowImages, ...topRowImages].map((img, i) => (
              <div
                key={`top-${i}`}
                className="relative flex-shrink-0 aspect-[4/3] cursor-pointer"
                style={{ width: getWidth(img.size) }}
                onClick={() => setModalImage(img)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="overflow-hidden">
          <div className="scroll-row-2 flex gap-1" style={{ width: 'max-content' }}>
            {[...bottomRowImages, ...bottomRowImages].map((img, i) => (
              <div
                key={`bottom-${i}`}
                className="relative flex-shrink-0 aspect-[4/3] cursor-pointer"
                style={{ width: getWidth(img.size) }}
                onClick={() => setModalImage(img)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setModalImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-4xl font-light hover:text-gray-300 transition-colors"
            onClick={() => setModalImage(null)}
          >
            &times;
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full">
            <Image
              src={modalImage.src}
              alt={modalImage.alt}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <p className="absolute bottom-6 left-0 right-0 text-center text-white/70 text-sm">
            {modalImage.alt}
          </p>
        </div>
      )}
    </>
  );
}
