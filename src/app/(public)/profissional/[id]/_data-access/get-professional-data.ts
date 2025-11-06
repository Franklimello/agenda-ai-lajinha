"use server";

import { adminDb } from "@/lib/firebase-auth";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

export async function getProfessionalData(userId: string) {
  try {
    // Verificar se Firebase Admin está inicializado
    if (!adminDb) {
      console.error("❌ Firebase Admin não está inicializado. Verifique FIREBASE_SERVICE_ACCOUNT.");
      return null;
    }

    const userDoc = await adminDb.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data();

    // Verificar se está ativo (status deve ser true ou undefined/null para ser considerado ativo)
    const isActive = userData.status !== false; // Considera ativo se não for explicitamente false
    if (!isActive) {
      return null;
    }

    // Verificar se tem perfil completo (nome, telefone e horários)
    const hasCompleteProfile = !!(
      userData.name &&
      userData.phone &&
      userData.times &&
      Array.isArray(userData.times) &&
      userData.times.length > 0
    );

    if (!hasCompleteProfile) {
      return null;
    }

    // Verificar se tem plano ativo
    const subscriptionDoc = await adminDb.collection("subscriptions")
      .where("userId", "==", userId)
      .where("status", "==", "active")
      .limit(1)
      .get();

    const hasActivePlan = !subscriptionDoc.empty;

    if (!hasActivePlan) {
      return null;
    }

    // Buscar serviços ativos
    const servicesSnapshot = await adminDb.collection("services")
      .where("userId", "==", userId)
      .where("status", "==", true)
      .get();

    // Se não tem pelo menos um serviço ativo, não permitir acesso
    if (servicesSnapshot.empty) {
      return null;
    }

    const services = servicesSnapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const serviceData = doc.data();
      // Retornar apenas os campos necessários, sem Timestamps
      return {
        id: doc.id,
        name: serviceData.name || "",
        price: serviceData.price || 0,
        duration: serviceData.duration || 0,
      };
    });

    return {
      id: userDoc.id,
      name: userData.name,
      email: userData.email,
      address: userData.address,
      phone: userData.phone,
      image: userData.image,
      times: userData.times || [],
      status: userData.status,
      services,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do profissional:", error);
    return null;
  }
}
