"use server";

import { adminDb } from "@/lib/firebase";
import { getSession } from "@/lib/getSession";

interface CreateSubscriptionData {
  userId: string;
  plan: "BASIC" | "PROFESSIONAL";
  status?: string;
}

export async function createSubscription(data: CreateSubscriptionData) {
  try {
    const session = await getSession();

    // Verificar se o usuário atual tem permissão (opcional - pode remover se quiser acesso direto)
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    // Verificar se já existe subscription
    const existingSubscriptionDoc = await adminDb.collection("subscriptions")
      .where("userId", "==", data.userId)
      .limit(1)
      .get();

    if (!existingSubscriptionDoc.empty) {
      // Atualizar subscription existente
      const subscriptionRef = existingSubscriptionDoc.docs[0].ref;
      await subscriptionRef.update({
        plan: data.plan,
        status: data.status || "active",
        priceId: `price_${data.plan.toLowerCase()}`,
        updatedAt: new Date(),
      });

      const updatedData = {
        id: subscriptionRef.id,
        ...existingSubscriptionDoc.docs[0].data(),
        plan: data.plan,
        status: data.status || "active",
        priceId: `price_${data.plan.toLowerCase()}`,
      };

      return {
        success: true,
        data: updatedData,
        message: "Subscription atualizada com sucesso!",
      };
    }

    // Criar nova subscription
    const subscriptionRef = adminDb.collection("subscriptions").doc();
    const subscriptionData = {
      userId: data.userId,
      plan: data.plan,
      status: data.status || "active",
      priceId: `price_${data.plan.toLowerCase()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await subscriptionRef.set(subscriptionData);

    return {
      success: true,
      data: { id: subscriptionRef.id, ...subscriptionData },
      message: "Subscription criada com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao criar subscription:", error);
    return {
      success: false,
      error: "Erro ao criar subscription. Tente novamente.",
    };
  }
}
