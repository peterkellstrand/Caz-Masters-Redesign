import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get current tournament
    const tournament = await prisma.tournament.findFirst({
      where: { year: 2026 },
      include: {
        holes: { orderBy: { number: "asc" } },
        teams: {
          include: {
            players: true,
            scores: {
              include: { hole: true },
              orderBy: { hole: { number: "asc" } },
            },
          },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    // Calculate total par
    const totalPar = tournament.holes.reduce((sum, hole) => sum + hole.par, 0);

    // Calculate standings
    const standings = tournament.teams.map((team) => {
      const holesPlayed = team.scores.length;
      const totalStrokes = team.scores.reduce((sum, score) => sum + score.strokes, 0);

      // Calculate par for holes played
      const parForHolesPlayed = team.scores.reduce(
        (sum, score) => sum + score.hole.par,
        0
      );

      const toPar = holesPlayed > 0 ? totalStrokes - parForHolesPlayed : 0;

      // Get score by hole
      const scoresByHole: Record<number, number> = {};
      team.scores.forEach((score) => {
        scoresByHole[score.hole.number] = score.strokes;
      });

      return {
        teamId: team.id,
        teamName: team.name,
        players: team.players.map((p) => p.fullName),
        holesPlayed,
        totalStrokes,
        toPar,
        scoresByHole,
        thru: holesPlayed > 0 ? holesPlayed : "-",
      };
    });

    // Sort by toPar (lowest first), then by holes played (more holes = better tiebreaker)
    standings.sort((a, b) => {
      if (a.toPar !== b.toPar) return a.toPar - b.toPar;
      return b.holesPlayed - a.holesPlayed;
    });

    // Add position
    const leaderboard = standings.map((team, index) => ({
      position: index + 1,
      ...team,
    }));

    return NextResponse.json({
      tournament: {
        id: tournament.id,
        name: tournament.name,
        isLive: tournament.isLive,
        totalPar,
        holes: tournament.holes,
      },
      leaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
