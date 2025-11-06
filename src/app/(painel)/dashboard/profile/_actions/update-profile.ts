"use server";

import { adminDb } from "@/lib/firebase";
import { getSession } from "@/lib/getSession";
import { revalidatePath } from "next/cache";

interface UpdateProfileData {
  name: string;
  address?: string;
  phone?: string;
  status: string;
  timeZone: string;
  times: string[];
  image?: string;
}

export async function updateProfile(data: UpdateProfileData) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    // Verificar se tem subscription ativa
    const subscriptionDoc = await adminDb.collection("subscriptions")
      .where("userId", "==", session.user.id)
      .limit(1)
      .get();

    const subscription = subscriptionDoc.empty ? null : subscriptionDoc.docs[0].data();
    
    if (!subscription || subscription.status?.toLowerCase() !== "active") {
      return {
        success: false,
        error: "Você precisa ter um plano ativo para editar o perfil. Por favor, assine um plano primeiro.",
      };
    }

    // Verificar perfil completo antes de atualizar
    const userDoc = await adminDb.collection("users").doc(session.user.id).get();
    const currentUserData = userDoc.data();
    
    // Se o usuário tem plano ativo e perfil completo, não permitir desativar
    const hasCompleteProfile = !!(
      data.name &&
      data.phone &&
      data.times &&
      Array.isArray(data.times) &&
      data.times.length > 0
    );
    
    const statusBoolean = data.status === "active";
    
    // Se tem plano ativo e perfil completo, manter status como true
    // Só permitir false se o usuário explicitamente quiser desativar E não tiver plano ativo
    let finalStatus = statusBoolean;
    if (subscription && subscription.status?.toLowerCase() === "active" && hasCompleteProfile) {
      // Se tem plano ativo e perfil completo, forçar status como true
      finalStatus = true;
    } else if (!statusBoolean && currentUserData?.status === true) {
      // Se o usuário está tentando desativar mas tinha status ativo antes,
      // manter como true se tiver plano ativo
      if (subscription && subscription.status?.toLowerCase() === "active") {
        finalStatus = true;
      }
    }

    await adminDb.collection("users").doc(session.user.id).update({
      name: data.name,
      address: data.address || "",
      phone: data.phone || "",
      status: finalStatus,
      timezone: data.timeZone,
      times: data.times,
      image: data.image || null,
      updatedAt: new Date(),
    });

    revalidatePath("/dashboard/profile");
    
    return {
      success: true,
      message: "Perfil atualizado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return {
      success: false,
      error: "Erro ao atualizar perfil. Tente novamente.",
    };
  }
}
