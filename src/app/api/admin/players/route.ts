import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TOURNAMENT } from "@/lib/tournament";

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tournament = await prisma.tournament.findUnique({
    where: { year: TOURNAMENT.year },
    include: {
      players: {
        include: { payment: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return NextResponse.json({
    tournament,
    players: tournament?.players || [],
    count: tournament?.players.length || 0,
  });
}
