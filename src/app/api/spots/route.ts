import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TOURNAMENT } from "@/lib/tournament";

export const revalidate = 30;

export async function GET() {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { year: TOURNAMENT.year },
      select: { maxPlayers: true, _count: { select: { players: true } } },
    });

    const filled = tournament?._count.players ?? 0;
    const total = tournament?.maxPlayers ?? TOURNAMENT.maxPlayers;

    return NextResponse.json({ filled, total, remaining: total - filled });
  } catch {
    return NextResponse.json({ filled: 0, total: TOURNAMENT.maxPlayers, remaining: TOURNAMENT.maxPlayers });
  }
}
