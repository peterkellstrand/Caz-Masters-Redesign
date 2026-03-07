"use client";

import { useEffect, useState } from "react";
import { TOURNAMENT } from "@/lib/tournament";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const diff = TOURNAMENT.date.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-navy-800/80 backdrop-blur-sm rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border border-navy-700/50">
        <span className="text-2xl sm:text-3xl font-bold text-gold-400 tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-navy-300 text-xs sm:text-sm mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div className="h-24" />;

  return (
    <div className="flex gap-3 sm:gap-4">
      <TimeBlock value={timeLeft.days} label="Days" />
      <TimeBlock value={timeLeft.hours} label="Hours" />
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <TimeBlock value={timeLeft.seconds} label="Sec" />
    </div>
  );
}
