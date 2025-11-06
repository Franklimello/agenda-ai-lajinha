import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@/lib/getSession";
import { adminDb } from "@/lib/firebase-auth";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe não configurado" },
      { status: 500 }
    );
  }

  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { plan } = await request.json();

    if (!plan || (plan !== "BASIC" && plan !== "PROFESSIONAL")) {
      return NextResponse.json(
        { error: "Plano inválido" },
        { status: 400 }
      );
    }

    // Mapear planos para price IDs do Stripe
    // ATENÇÃO: Substitua estes price IDs pelos seus price IDs reais do Stripe
    const priceIdMap: Record<string, string> = {
      PROFESSIONAL: process.env.STRIPE_PRICE_ID_PROFESSIONAL || "",
      BASIC: process.env.STRIPE_PRICE_ID_BASIC || "",
    };

    const priceId = priceIdMap[plan];

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID não configurado para este plano" },
        { status: 400 }
      );
    }

    // Buscar dados do usuário
    const userDoc = await adminDb.collection("users").doc(session.user.id).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    // Criar ou buscar customer no Stripe
    let customerId: string;
    
    if (userData?.stripe_customer_id) {
      customerId = userData.stripe_customer_id;
    } else {
      // Criar novo customer
      const customer = await stripe.customers.create({
        email: session.user.email || userData?.email,
        metadata: {
          userId: session.user.id,
        },
      });
      customerId = customer.id;
      
      // Salvar customer ID no Firestore
      await adminDb.collection("users").doc(session.user.id).update({
        stripe_customer_id: customerId,
      });
    }

    // Criar Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/plans?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/plans?canceled=true`,
      metadata: {
        userId: session.user.id,
        plan: plan,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          plan: plan,
        },
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error("Erro ao criar checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar sessão de pagamento" },
      { status: 500 }
    );
  }
}

