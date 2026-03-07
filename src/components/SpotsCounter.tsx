"use client";

import { useEffect, useState } from "react";

export default function SpotsCounter() {
  const [data, setData] = useState<{ filled: number; total: number } | null>(null);

  useEffect(() => {
    fetch("/api/spots")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div>
        <p className="text-gold-500 font-black text-sm tracking-[0.2em] uppercase mb-2">SPOTS</p>
        <p className="text-xl sm:text-2xl font-bold text-navy-900">-- / 72</p>
      </div>
    );
  }

  const remaining = data.total - data.filled;
  const urgency = remaining <= 10 && remaining > 0;
  const full = remaining === 0;

  return (
    <div>
      <p className="text-gold-500 font-black text-sm tracking-[0.2em] uppercase mb-2">SPOTS</p>
      <p className={`text-xl sm:text-2xl font-bold ${full ? "text-red-600" : urgency ? "text-red-500" : "text-navy-900"}`}>
        {full
          ? "Full. Damn."
          : urgency
          ? `${data.filled} / ${data.total} — Only ${remaining} Left`
          : `${data.filled} / ${data.total} Filled`}
      </p>
    </div>
  );
}
