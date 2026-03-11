import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    // Check if Stripe key is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.startsWith("sk_test_...")) {
      // Return a mock response when Stripe is not configured
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/order-confirmed?mock=true`,
      });
    }

    // Dynamic import to avoid issues when Stripe is not configured
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);

    const lineItems = items.map(
      (item: { name: string; price: number; quantity: number }) => ({
        price_data: {
          currency: "egp",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/shop`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
