"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Hole {
  id: string;
  number: number;
  par: number;
  yardage: number;
  handicap: number | null;
}

interface Team {
  id: string;
  name: string;
  players: { id: string; fullName: string }[];
}

interface Score {
  holeId: string;
  strokes: number;
  hole: Hole;
}

export default function ScorecardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [holes, setHoles] = useState<Hole[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/teams").then((r) => r.json()),
      fetch("/api/holes").then((r) => r.json()),
    ]).then(([teamsData, holesData]) => {
      setTeams(Array.isArray(teamsData) ? teamsData : []);
      setHoles(Array.isArray(holesData) ? holesData : []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetch(`/api/scores?teamId=${selectedTeam}`)
        .then((r) => r.json())
        .then((data: Score[]) => {
          const scoreMap: Record<string, number> = {};
          data.forEach((s) => {
            scoreMap[s.holeId] = s.strokes;
          });
          setScores(scoreMap);
        });
    }
  }, [selectedTeam]);

  async function saveScore(holeId: string, strokes: number) {
    if (!selectedTeam || strokes < 1 || strokes > 15) return;

    setSaving(holeId);
    setScores((prev) => ({ ...prev, [holeId]: strokes }));

    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: selectedTeam, holeId, strokes }),
      });
    } catch (error) {
      console.error("Failed to save score:", error);
    } finally {
      setSaving(null);
    }
  }

  function adjustScore(holeId: string, delta: number) {
    const current = scores[holeId] || 0;
    const newScore = current + delta;
    if (newScore >= 1 && newScore <= 15) {
      saveScore(holeId, newScore);
    }
  }

  const frontNine = holes.filter((h) => h.number <= 9);
  const backNine = holes.filter((h) => h.number > 9);

  const frontNinePar = frontNine.reduce((sum, h) => sum + h.par, 0);
  const backNinePar = backNine.reduce((sum, h) => sum + h.par, 0);
  const totalPar = frontNinePar + backNinePar;

  const frontNineScore = frontNine.reduce((sum, h) => sum + (scores[h.id] || 0), 0);
  const backNineScore = backNine.reduce((sum, h) => sum + (scores[h.id] || 0), 0);
  const totalStrokes = frontNineScore + backNineScore;

  const holesCompleted = Object.keys(scores).length;
  const parForCompleted = holes
    .filter((h) => scores[h.id] !== undefined)
    .reduce((sum, h) => sum + h.par, 0);
  const toPar = holesCompleted > 0 ? totalStrokes - parForCompleted : 0;

  function getScoreColor(strokes: number, par: number) {
    if (!strokes) return "bg-gray-100 border-gray-200";
    const diff = strokes - par;
    if (diff <= -2) return "bg-yellow-300 border-yellow-400"; // Eagle or better
    if (diff === -1) return "bg-green-400 border-green-500"; // Birdie
    if (diff === 0) return "bg-gray-100 border-gray-300"; // Par
    if (diff === 1) return "bg-red-300 border-red-400"; // Bogey
    if (diff === 2) return "bg-red-400 border-red-500"; // Double
    return "bg-red-500 border-red-600 text-white"; // Triple+
  }

  if (loading) {
    return (
      <div className="bg-[#faf0e6] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      {/* Header */}
      <div className="bg-[#faf0e6] shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex justify-center mb-3">
            <Image
              src="/images/cazmastersbadge_green.png"
              alt="Caz Masters"
              width={7177}
              height={1492}
              className="w-48 h-auto object-contain"
              priority
              unoptimized
            />
          </div>
          <h1 className="text-xl font-black text-center uppercase">Live Scorecard</h1>
        </div>

        {/* Team Selector */}
        <div className="px-4 pb-4">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full border-2 border-gray-200 px-4 py-3 text-lg font-medium rounded-lg focus:border-black focus:outline-none"
          >
            <option value="">Select Your Team...</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Score Summary - Fixed at top */}
        <div className="flex justify-around py-3 border-t border-gray-100 bg-[#004225] text-white">
            <div className="text-center">
              <p className="text-2xl font-black">{totalStrokes || "-"}</p>
              <p className="text-xs uppercase tracking-wider opacity-70">Total</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-black ${toPar < 0 ? "text-green-400" : toPar > 0 ? "text-red-400" : ""}`}>
                {holesCompleted > 0 ? (toPar > 0 ? `+${toPar}` : toPar === 0 ? "E" : toPar) : "-"}
              </p>
              <p className="text-xs uppercase tracking-wider opacity-70">To Par</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black">{holesCompleted}</p>
              <p className="text-xs uppercase tracking-wider opacity-70">Thru</p>
            </div>
          </div>
      </div>

      {/* Scorecard */}
      <div className="px-4 pt-4 space-y-6">
          {/* Front 9 */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-black uppercase">Front 9</h2>
              <div className="text-right">
                <span className="text-lg font-bold">{frontNineScore || "-"}</span>
                <span className="text-gray-400 text-sm ml-1">/ {frontNinePar}</span>
              </div>
            </div>
            <div className="space-y-2">
              {frontNine.map((hole) => (
                <div
                  key={hole.id}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 ${getScoreColor(scores[hole.id], hole.par)} ${
                    saving === hole.id ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#004225] text-white rounded-full flex items-center justify-center font-black text-lg">
                      {hole.number}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Par {hole.par}</p>
                      <p className="text-xs text-gray-400">{hole.yardage} yds</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustScore(hole.id, -1)}
                      className="w-10 h-10 bg-[#faf0e6] border-2 border-gray-300 rounded-full text-xl font-bold hover:bg-gray-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={!selectedTeam}
                    >
                      −
                    </button>
                    <div className="w-14 h-14 flex items-center justify-center text-2xl font-black">
                      {scores[hole.id] || "-"}
                    </div>
                    <button
                      onClick={() => adjustScore(hole.id, 1)}
                      className="w-10 h-10 bg-[#faf0e6] border-2 border-gray-300 rounded-full text-xl font-bold hover:bg-gray-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={!selectedTeam}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back 9 */}
          {backNine.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-black uppercase">Back 9</h2>
                <div className="text-right">
                  <span className="text-lg font-bold">{backNineScore || "-"}</span>
                  <span className="text-gray-400 text-sm ml-1">/ {backNinePar}</span>
                </div>
              </div>
              <div className="space-y-2">
                {backNine.map((hole) => (
                  <div
                    key={hole.id}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 ${getScoreColor(scores[hole.id], hole.par)} ${
                      saving === hole.id ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#004225] text-white rounded-full flex items-center justify-center font-black text-lg">
                        {hole.number}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Par {hole.par}</p>
                        <p className="text-xs text-gray-400">{hole.yardage} yds</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjustScore(hole.id, -1)}
                        className="w-10 h-10 bg-[#faf0e6] border-2 border-gray-300 rounded-full text-xl font-bold hover:bg-gray-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={!selectedTeam}
                      >
                        −
                      </button>
                      <div className="w-14 h-14 flex items-center justify-center text-2xl font-black">
                        {scores[hole.id] || "-"}
                      </div>
                      <button
                        onClick={() => adjustScore(hole.id, 1)}
                        className="w-10 h-10 bg-[#faf0e6] border-2 border-gray-300 rounded-full text-xl font-bold hover:bg-gray-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={!selectedTeam}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="pt-4 pb-8">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 text-center">Score Colors</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                <span>Eagle+</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span>Birdie</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-100 border rounded"></div>
                <span>Par</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-red-300 rounded"></div>
                <span>Bogey</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Double+</span>
              </div>
            </div>
          </div>
        </div>

    </div>
  );
}
