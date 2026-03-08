import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TOURNAMENT } from "@/lib/tournament";

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { registrationOpen, isLive } = body;

  const updateData: { registrationOpen?: boolean; isLive?: boolean } = {};
  if (registrationOpen !== undefined) updateData.registrationOpen = registrationOpen;
  if (isLive !== undefined) updateData.isLive = isLive;

  const tournament = await prisma.tournament.update({
    where: { year: TOURNAMENT.year },
    data: updateData,
  });

  return NextResponse.json({ tournament });
}

// Toggle live status (simplified endpoint)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "toggle-live") {
    const current = await prisma.tournament.findFirst({
      where: { year: TOURNAMENT.year },
    });

    if (!current) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    const tournament = await prisma.tournament.update({
      where: { year: TOURNAMENT.year },
      data: { isLive: !current.isLive },
    });

    return NextResponse.json({ tournament });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
