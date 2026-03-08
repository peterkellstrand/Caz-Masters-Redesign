import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendConfirmationEmail } from "@/lib/resend";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const playerId = session.metadata?.playerId;

    if (playerId) {
      await prisma.payment.update({
        where: { playerId },
        data: { status: "paid_online" },
      });

      const player = await prisma.player.findUnique({ where: { id: playerId } });
      if (player) {
        try {
          await sendConfirmationEmail(player.email, player.fullName, "paid_online");
        } catch {
          // Log but don't fail
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
