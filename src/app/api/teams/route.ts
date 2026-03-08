import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tournament = await prisma.tournament.findFirst({
      where: { year: 2026 },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    const teams = await prisma.team.findMany({
      where: { tournamentId: tournament.id },
      include: {
        players: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}
