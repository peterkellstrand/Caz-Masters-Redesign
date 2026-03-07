import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { paymentStatus } = body;

  if (!["paid_online", "paid_manual", "unpaid"].includes(paymentStatus)) {
    return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
  }

  const payment = await prisma.payment.update({
    where: { playerId: id },
    data: {
      status: paymentStatus,
      method: paymentStatus === "paid_manual" ? "manual" : undefined,
    },
  });

  return NextResponse.json({ payment });
}
