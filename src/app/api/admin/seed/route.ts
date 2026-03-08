import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const HOLES_DATA = [
  // Front 9
  { number: 1, par: 5, yardage: 435, handicap: 3 },
  { number: 2, par: 3, yardage: 235, handicap: 7 },
  { number: 3, par: 4, yardage: 393, handicap: 1 },
  { number: 4, par: 3, yardage: 168, handicap: 9 },
  { number: 5, par: 4, yardage: 271, handicap: 5 },
  { number: 6, par: 3, yardage: 136, handicap: 8 },
  { number: 7, par: 4, yardage: 425, handicap: 2 },
  { number: 8, par: 4, yardage: 330, handicap: 6 },
  { number: 9, par: 5, yardage: 458, handicap: 4 },
  // Back 9
  { number: 10, par: 4, yardage: 432, handicap: 12 },
  { number: 11, par: 3, yardage: 170, handicap: 16 },
  { number: 12, par: 4, yardage: 377, handicap: 10 },
  { number: 13, par: 3, yardage: 189, handicap: 18 },
  { number: 14, par: 4, yardage: 252, handicap: 14 },
  { number: 15, par: 3, yardage: 117, handicap: 17 },
  { number: 16, par: 5, yardage: 445, handicap: 11 },
  { number: 17, par: 4, yardage: 319, handicap: 15 },
  { number: 18, par: 5, yardage: 463, handicap: 13 },
];

export async function POST() {
  try {
    // Create or update tournament
    const tournament = await prisma.tournament.upsert({
      where: { year: 2026 },
      update: {},
      create: {
        name: "The Caz Masters",
        year: 2026,
        date: new Date("2026-07-03T08:00:00-04:00"),
        location: "Cazenovia Golf Club",
        maxPlayers: 72,
        registrationOpen: true,
        isLive: false,
        entryFee: 15000,
      },
    });

    // Create holes
    for (const hole of HOLES_DATA) {
      await prisma.hole.upsert({
        where: {
          number_tournamentId: {
            number: hole.number,
            tournamentId: tournament.id,
          },
        },
        update: {
          par: hole.par,
          yardage: hole.yardage,
          handicap: hole.handicap,
        },
        create: {
          number: hole.number,
          par: hole.par,
          yardage: hole.yardage,
          handicap: hole.handicap,
          tournamentId: tournament.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Tournament and holes seeded successfully",
      tournamentId: tournament.id,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
