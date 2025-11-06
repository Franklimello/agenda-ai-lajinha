"use server";

import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/getSession";

/**
 * Verifica se o usuário tem uma subscription ativa
 * Retorna true se tiver subscription com status "active" ou "trialing"
 */
export async function hasActiveSubscription(): Promise<boolean> {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return false;
    }

    const subscriptionDoc = await adminDb.collection("subscriptions")
      .where("userId", "==", session.user.id)
      .limit(1)
      .get();

    if (subscriptionDoc.empty) {
      return false;
    }

    const subscription = subscriptionDoc.docs[0].data();
    const activeStatuses = ["active", "trialing"];
    return activeStatuses.includes(subscription.status?.toLowerCase() || "");
  } catch (error) {
    console.error("Erro ao verificar assinatura:", error);
    return false;
  }
}
