// Verificar status de onboarding do profissional
"use server";

import { getSession } from "@/lib/getSession";
import { adminDb } from "@/lib/firebase-auth";

export interface OnboardingStatus {
  hasActivePlan: boolean;
  hasCompleteProfile: boolean;
  nextStep: "plan" | "profile" | "dashboard";
}

export async function checkOnboardingStatus(): Promise<OnboardingStatus | null> {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return null;
    }

    // Verificar se tem plano ativo
    const subscriptionDoc = await adminDb.collection("subscriptions")
      .where("userId", "==", session.user.id)
      .limit(1)
      .get();

    const hasActivePlan = !subscriptionDoc.empty && 
      subscriptionDoc.docs[0].data().status?.toLowerCase() === "active";

    // Verificar se tem perfil completo
    const userDoc = await adminDb.collection("users").doc(session.user.id).get();
    
    if (!userDoc.exists) {
      return {
        hasActivePlan,
        hasCompleteProfile: false,
        nextStep: hasActivePlan ? "profile" : "plan",
      };
    }

    const userData = userDoc.data();
    
    // Considerar perfil completo se tem nome, telefone e horários configurados
    const hasCompleteProfile = !!(
      userData?.name &&
      userData?.phone &&
      userData?.times &&
      Array.isArray(userData.times) &&
      userData.times.length > 0
    );

    // Determinar próximo passo
    let nextStep: "plan" | "profile" | "dashboard" = "dashboard";
    
    if (!hasActivePlan) {
      nextStep = "plan";
    } else if (!hasCompleteProfile) {
      nextStep = "profile";
    }

    return {
      hasActivePlan,
      hasCompleteProfile,
      nextStep,
    };
  } catch (error) {
    console.error("Erro ao verificar status de onboarding:", error);
    return null;
  }
}

