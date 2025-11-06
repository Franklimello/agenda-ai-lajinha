import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-auth";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe não configurado" },
      { status: 500 }
    );
  }

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Assinatura não fornecida" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Erro ao verificar webhook:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Processar eventos
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          // Criar ou atualizar subscription no Firestore
          await adminDb.collection("subscriptions").doc(userId).set(
            {
              userId,
              plan,
              status: "active",
              priceId: session.subscription ? "price_active" : "",
              stripeSubscriptionId: session.subscription,
              stripeCustomerId: session.customer,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            { merge: true }
          );
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          const status =
            subscription.status === "active" ? "active" : "canceled";

          await adminDb.collection("subscriptions").doc(userId).update({
            status,
            updatedAt: new Date(),
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        // subscription pode ser string (ID) ou objeto Subscription expandido
        const subscription = (invoice as any).subscription;
        const subscriptionId = subscription 
          ? typeof subscription === 'string' 
            ? subscription 
            : subscription.id
          : null;

        if (subscriptionId && typeof subscriptionId === "string") {
          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
          );
          const userId = subscription.metadata?.userId;

          if (userId) {
            await adminDb.collection("subscriptions").doc(userId).update({
              status: "active",
              updatedAt: new Date(),
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = (invoice as any).subscription;
        const subscriptionId = subscription 
          ? typeof subscription === 'string' 
            ? subscription 
            : subscription.id
          : null;

        if (subscriptionId && typeof subscriptionId === "string") {
          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
          );
          const userId = subscription.metadata?.userId;

          if (userId) {
            await adminDb.collection("subscriptions").doc(userId).update({
              status: "past_due",
              updatedAt: new Date(),
            });
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}

