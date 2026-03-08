import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all teams with players
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
          select: { id: true, fullName: true, email: true },
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

// Create a new team
export async function POST(request: NextRequest) {
  try {
    const { name, playerIds } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Team name required" }, { status: 400 });
    }

    const tournament = await prisma.tournament.findFirst({
      where: { year: 2026 },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    const team = await prisma.team.create({
      data: {
        name,
        tournamentId: tournament.id,
        players: playerIds?.length
          ? {
              connect: playerIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        players: true,
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
  }
}

// Delete a team
export async function DELETE(request: NextRequest) {
  try {
    const { teamId } = await request.json();

    if (!teamId) {
      return NextResponse.json({ error: "Team ID required" }, { status: 400 });
    }

    // First delete all scores for this team
    await prisma.score.deleteMany({
      where: { teamId },
    });

    // Remove players from team
    await prisma.player.updateMany({
      where: { teamId },
      data: { teamId: null },
    });

    // Delete team
    await prisma.team.delete({
      where: { id: teamId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json({ error: "Failed to delete team" }, { status: 500 });
  }
}
