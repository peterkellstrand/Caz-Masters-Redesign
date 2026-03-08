import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tournament = await prisma.tournament.findFirst({
      where: { year: 2026 },
    });

    if (!tournament) {
      return NextResponse.json([]);
    }

    const players = await prisma.player.findMany({
      where: { tournamentId: tournament.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        teamId: true,
      },
      orderBy: { fullName: "asc" },
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
  }
}
