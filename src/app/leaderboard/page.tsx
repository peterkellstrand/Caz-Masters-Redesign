"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Hole {
  id: string;
  number: number;
  par: number;
}

interface TeamStanding {
  position: number;
  teamId: string;
  teamName: string;
  players: string[];
  holesPlayed: number;
  totalStrokes: number;
  toPar: number;
  scoresByHole: Record<number, number>;
  thru: number | string;
}

interface LeaderboardData {
  tournament: {
    id: string;
    name: string;
    isLive: boolean;
    totalPar: number;
    holes: Hole[];
  };
  leaderboard: TeamStanding[];
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function fetchLeaderboard() {
    try {
      const res = await fetch("/api/leaderboard");
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaderboard();

    // Poll every 10 seconds for live updates
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  function formatToPar(toPar: number) {
    if (toPar === 0) return "E";
    if (toPar > 0) return `+${toPar}`;
    return toPar.toString();
  }

  if (loading) {
    return (
      <div className="bg-[#faf0e6] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading leaderboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#faf0e6] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Tournament not found</p>
      </div>
    );
  }

  return (
    <div className="bg-[#faf0e6] min-h-screen">
      <section className="pt-8 pb-4 px-4 md:px-8 lg:px-12">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/cazmastersbadge_green.png"
            alt="Caz Masters"
            width={7177}
            height={1492}
            className="w-full max-w-xl h-auto object-contain"
            priority
            unoptimized
          />
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-center uppercase">
            Live Leaderboard
          </h1>
          {data.tournament.isLive && (
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              LIVE
            </span>
          )}
        </div>

        {lastUpdated && (
          <p className="text-center text-gray-400 text-sm mb-6">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        {/* Leaderboard Table */}
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#004225] text-white">
                <th className="px-3 py-3 text-left text-sm font-bold uppercase w-16">Pos</th>
                <th className="px-3 py-3 text-left text-sm font-bold uppercase">Team</th>
                <th className="px-3 py-3 text-center text-sm font-bold uppercase w-20">To Par</th>
                <th className="px-3 py-3 text-center text-sm font-bold uppercase w-20">Thru</th>
                <th className="px-3 py-3 text-center text-sm font-bold uppercase w-20">Total</th>
                {data.tournament.holes.map((hole) => (
                  <th
                    key={hole.id}
                    className="px-2 py-3 text-center text-xs font-bold w-10 hidden lg:table-cell"
                  >
                    {hole.number}
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-100 hidden lg:table-row">
                <td colSpan={5} className="px-3 py-1 text-xs text-gray-500 uppercase">
                  Par
                </td>
                {data.tournament.holes.map((hole) => (
                  <td key={hole.id} className="px-2 py-1 text-center text-xs text-gray-500">
                    {hole.par}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5 + data.tournament.holes.length} className="px-3 py-8 text-center text-gray-400">
                    No teams have started yet
                  </td>
                </tr>
              ) : (
                data.leaderboard.map((team, index) => (
                  <tr
                    key={team.teamId}
                    className={`border-b border-gray-100 ${index === 0 ? "bg-yellow-50" : ""}`}
                  >
                    <td className="px-3 py-3 text-lg font-black">
                      {team.position}
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-bold text-lg">{team.teamName}</p>
                      <p className="text-sm text-gray-500">{team.players.join(", ")}</p>
                    </td>
                    <td
                      className={`px-3 py-3 text-center text-xl font-black ${
                        team.toPar < 0
                          ? "text-green-600"
                          : team.toPar > 0
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {team.holesPlayed > 0 ? formatToPar(team.toPar) : "-"}
                    </td>
                    <td className="px-3 py-3 text-center text-lg font-medium">
                      {team.thru}
                    </td>
                    <td className="px-3 py-3 text-center text-lg font-bold">
                      {team.totalStrokes || "-"}
                    </td>
                    {data.tournament.holes.map((hole) => (
                      <td
                        key={hole.id}
                        className={`px-2 py-3 text-center text-sm hidden lg:table-cell ${
                          team.scoresByHole[hole.number]
                            ? team.scoresByHole[hole.number] < hole.par
                              ? "text-green-600 font-bold"
                              : team.scoresByHole[hole.number] > hole.par
                              ? "text-red-600"
                              : ""
                            : "text-gray-300"
                        }`}
                      >
                        {team.scoresByHole[hole.number] || "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">-1</span>
            <span className="text-gray-500">Under Par</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">E</span>
            <span className="text-gray-500">Even</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-bold">+1</span>
            <span className="text-gray-500">Over Par</span>
          </div>
        </div>
      </section>
    </div>
  );
}
