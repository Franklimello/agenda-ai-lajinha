"use server";

import { adminDb } from "@/lib/firebase";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

export async function getProfessionals() {
  try {
    // Verificar se Firebase Admin está inicializado
    if (!adminDb) {
      console.error("❌ Firebase Admin não está inicializado. Verifique FIREBASE_SERVICE_ACCOUNT.");
      return [];
    }

    // Buscar todos os usuários (vamos filtrar depois, pois status pode ser undefined)
    const usersSnapshot = await adminDb.collection("users").get();

    const professionalsPromises = usersSnapshot.docs.map(async (doc: QueryDocumentSnapshot) => {
      const userData = doc.data();
      const userId = doc.id;

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

      // Se não tem perfil completo, não incluir
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

      // Se não tem plano ativo, não incluir
      if (!hasActivePlan) {
        return null;
      }

      // Buscar todos os serviços ativos
      const servicesSnapshot = await adminDb.collection("services")
        .where("userId", "==", userId)
        .where("status", "==", true)
        .get();

      // Se não tem pelo menos um serviço ativo, não incluir
      if (servicesSnapshot.empty) {
        return null;
      }

      const services = servicesSnapshot.docs.map((serviceDoc: QueryDocumentSnapshot) => {
        const serviceData = serviceDoc.data();
        // Retornar apenas os campos necessários, sem Timestamps
        return {
          id: serviceDoc.id,
          name: serviceData.name || "",
          price: serviceData.price || 0,
          duration: serviceData.duration || 0,
        };
      });

      return {
        id: doc.id,
        name: userData.name,
        address: userData.address,
        phone: userData.phone,
        email: userData.email,
        image: userData.image,
        services,
      };
    });

    // Aguardar todas as promessas e filtrar os nulls
    const professionals = (await Promise.all(professionalsPromises))
      .filter((prof): prof is NonNullable<typeof prof> => prof !== null)
      .slice(0, 20); // Limitar a 20 profissionais
    
    return professionals;
  } catch (error) {
    console.error("Erro ao buscar profissionais:", error);
    return [];
  }
}
