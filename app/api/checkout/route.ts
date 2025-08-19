// app/api/checkout/route.ts
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: NextRequest) {
  try {
    const { plan, amount, planName } = await req.json();

    // Define plan configurations
    const planConfigs = {
      credits: {
        name: "Extra Credits Package",
        description: "100 additional credits for ReRoom AI",
        amount: 999, // $9.99
      },
      pro: {
        name: "ReRoom AI Pro Plan",
        description: "Unlimited generations and premium features",
        amount: 1999, // $19.99
      },
    };

    const selectedPlan =
      planConfigs[plan as keyof typeof planConfigs] || planConfigs.credits;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description,
              images: [], // You can add product images here
            },
            unit_amount: amount || selectedPlan.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan: plan,
        planName: planName || selectedPlan.name,
      },
      success_url: `${(
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        process.env.PAGE_URL
      )?.replace(/\/$/, "")}/dashboard/Payment/success?plan=${plan}`,
      cancel_url: `${(
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        process.env.PAGE_URL
      )?.replace(/\/$/, "")}/dashboard/Payment/reject?plan=${plan}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
