import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get scores for a team
export async function GET(request: NextRequest) {
  const teamId = request.nextUrl.searchParams.get("teamId");

  if (!teamId) {
    return NextResponse.json({ error: "teamId required" }, { status: 400 });
  }

  try {
    const scores = await prisma.score.findMany({
      where: { teamId },
      include: { hole: true },
      orderBy: { hole: { number: "asc" } },
    });

    return NextResponse.json(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}

// Submit or update a score
export async function POST(request: NextRequest) {
  try {
    const { teamId, holeId, strokes } = await request.json();

    if (!teamId || !holeId || strokes === undefined) {
      return NextResponse.json(
        { error: "teamId, holeId, and strokes required" },
        { status: 400 }
      );
    }

    const score = await prisma.score.upsert({
      where: {
        teamId_holeId: { teamId, holeId },
      },
      update: { strokes },
      create: { teamId, holeId, strokes },
      include: { hole: true },
    });

    return NextResponse.json(score);
  } catch (error) {
    console.error("Error saving score:", error);
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }
}
