"use server";

import { adminDb } from "@/lib/firebase";
import { getSession } from "@/lib/getSession";

export async function getUserSubscription() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return null;
    }

    const subscriptionDoc = await adminDb.collection("subscriptions")
      .where("userId", "==", session.user.id)
      .limit(1)
      .get();

    if (subscriptionDoc.empty) {
      return null;
    }

    const subscriptionData = subscriptionDoc.docs[0].data();
    
    // Converter Timestamps para valores serializáveis
    return {
      id: subscriptionDoc.docs[0].id,
      userId: subscriptionData.userId,
      plan: subscriptionData.plan,
      status: subscriptionData.status,
      priceId: subscriptionData.priceId,
      createdAt: subscriptionData.createdAt?.toDate 
        ? subscriptionData.createdAt.toDate().toISOString() 
        : subscriptionData.createdAt instanceof Date 
        ? subscriptionData.createdAt.toISOString()
        : null,
      updatedAt: subscriptionData.updatedAt?.toDate 
        ? subscriptionData.updatedAt.toDate().toISOString() 
        : subscriptionData.updatedAt instanceof Date 
        ? subscriptionData.updatedAt.toISOString()
        : null,
    };
  } catch (error) {
    console.error("Erro ao buscar assinatura:", error);
    return null;
  }
}
