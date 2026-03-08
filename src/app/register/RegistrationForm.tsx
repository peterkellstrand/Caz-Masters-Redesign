"use client";

import { useState } from "react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  shirtSize: string;
  genderFlight: string;
  teamPreference: string;
  returningPlayer: boolean;
  dietaryNeeds: string;
}

const initialForm: FormData = {
  fullName: "",
  email: "",
  phone: "",
  shirtSize: "",
  genderFlight: "",
  teamPreference: "",
  returningPlayer: false,
  dietaryNeeds: "",
};

export default function RegistrationForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(paymentMethod: "stripe" | "day_of") {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, paymentMethod }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
        return;
      }

      if (paymentMethod === "stripe" && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        window.location.href = "/register/confirmation?status=day_of";
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border-2 border-gray-200 bg-white px-4 py-3.5 text-[#004225] placeholder:text-gray-400 focus:border-[#004225] focus:ring-2 focus:ring-[#004225]/10 focus:outline-none transition-colors text-base";
  const labelClass = "block text-sm font-bold text-[#004225] mb-1.5 uppercase tracking-wider";

  const isValid = form.fullName && form.email && form.phone && form.shirtSize && form.genderFlight;

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 text-sm font-medium">
          {error}
        </div>
      )}

      <div>
        <label className={labelClass}>Name</label>
        <input
          type="text"
          required
          className={inputClass}
          placeholder="Your full name"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          required
          className={inputClass}
          placeholder="you@email.com"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Phone</label>
        <input
          type="tel"
          required
          className={inputClass}
          placeholder="(555) 123-4567"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Shirt Size</label>
          <select
            required
            className={inputClass}
            value={form.shirtSize}
            onChange={(e) => update("shirtSize", e.target.value)}
          >
            <option value="">Pick one</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Flight</label>
          <select
            required
            className={inputClass}
            value={form.genderFlight}
            onChange={(e) => update("genderFlight", e.target.value)}
          >
            <option value="">Pick one</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Team Preference <span className="text-gray-400 normal-case font-normal tracking-normal">(optional)</span></label>
        <input
          type="text"
          className={inputClass}
          placeholder="Who do you want to play with?"
          value={form.teamPreference}
          onChange={(e) => update("teamPreference", e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Dietary Needs <span className="text-gray-400 normal-case font-normal tracking-normal">(optional)</span></label>
        <input
          type="text"
          className={inputClass}
          placeholder="Allergies, vegetarian, etc."
          value={form.dietaryNeeds}
          onChange={(e) => update("dietaryNeeds", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 py-1">
        <input
          type="checkbox"
          id="returning"
          className="h-5 w-5 border-gray-300 text-[#004225] focus:ring-[#004225]"
          checked={form.returningPlayer}
          onChange={(e) => update("returningPlayer", e.target.checked)}
        />
        <label htmlFor="returning" className="text-gray-600 font-medium">
          I&apos;ve played in The Caz Masters before
        </label>
      </div>

      <div className="border-t-2 border-gray-100 pt-6 space-y-3">
        <button
          onClick={() => handleSubmit("stripe")}
          disabled={loading || !isValid}
          className="w-full bg-[#004225] hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-4 transition-all text-lg uppercase tracking-wide hover:scale-[1.02]"
        >
          {loading ? "Hold tight..." : "Pay $150 Now"}
        </button>

        <button
          onClick={() => handleSubmit("day_of")}
          disabled={loading || !isValid}
          className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 text-[#004225] border-2 border-[#004225] font-bold py-4 transition-all text-base"
        >
          {loading ? "Hold tight..." : "I'll Pay Day-Of"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-2">
          Card & Venmo accepted via Stripe. Or just bring cash.
        </p>
      </div>
    </div>
  );
}
