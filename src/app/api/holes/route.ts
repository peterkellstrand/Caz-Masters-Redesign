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

    const holes = await prisma.hole.findMany({
      where: { tournamentId: tournament.id },
      orderBy: { number: "asc" },
    });

    return NextResponse.json(holes);
  } catch (error) {
    console.error("Error fetching holes:", error);
    return NextResponse.json({ error: "Failed to fetch holes" }, { status: 500 });
  }
}
