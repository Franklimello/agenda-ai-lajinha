"use server";

import { adminDb } from "@/lib/firebase";
import { getSession } from "@/lib/getSession";
import { revalidatePath } from "next/cache";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import type { Service } from "../../_types";

interface CreateServiceData {
  name: string;
  price: number;
  duration: number;
  status: boolean;
}

interface UpdateServiceData extends CreateServiceData {
  id: string;
}

export async function createService(data: CreateServiceData) {
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
        error: "Você precisa ter um plano ativo para criar serviços. Por favor, assine um plano primeiro.",
      };
    }

    const serviceRef = adminDb.collection("services").doc();
    const serviceData = {
      name: data.name,
      price: data.price,
      duration: data.duration,
      status: data.status,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await serviceRef.set(serviceData);

    revalidatePath("/dashboard/service");
    
    return {
      success: true,
      data: {
        id: serviceRef.id,
        name: serviceData.name,
        price: serviceData.price,
        duration: serviceData.duration,
        status: serviceData.status,
        userId: serviceData.userId,
      },
      message: "Serviço criado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return {
      success: false,
      error: "Erro ao criar serviço. Tente novamente.",
    };
  }
}

export async function updateService(data: UpdateServiceData) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    // Verificar se o serviço pertence ao usuário
    const serviceDoc = await adminDb.collection("services").doc(data.id).get();
    
    if (!serviceDoc.exists || serviceDoc.data()?.userId !== session.user.id) {
      return {
        success: false,
        error: "Serviço não encontrado ou você não tem permissão para editá-lo",
      };
    }

    await adminDb.collection("services").doc(data.id).update({
      name: data.name,
      price: data.price,
      duration: data.duration,
      status: data.status,
      updatedAt: new Date(),
    });

    const serviceData = serviceDoc.data();
    const updatedService = {
      id: serviceDoc.id,
      name: data.name,
      price: data.price,
      duration: data.duration,
      status: data.status,
      userId: serviceData.userId,
      createdAt: serviceData.createdAt?.toDate 
        ? serviceData.createdAt.toDate().toISOString() 
        : serviceData.createdAt instanceof Date 
        ? serviceData.createdAt.toISOString()
        : null,
      updatedAt: new Date().toISOString(),
    };

    revalidatePath("/dashboard/service");
    
    return {
      success: true,
      data: updatedService,
      message: "Serviço atualizado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    return {
      success: false,
      error: "Erro ao atualizar serviço. Tente novamente.",
    };
  }
}

export async function deleteService(serviceId: string) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    // Verificar se o serviço pertence ao usuário
    const serviceDoc = await adminDb.collection("services").doc(serviceId).get();
    
    if (!serviceDoc.exists || serviceDoc.data()?.userId !== session.user.id) {
      return {
        success: false,
        error: "Serviço não encontrado ou você não tem permissão para deletá-lo",
      };
    }

    await adminDb.collection("services").doc(serviceId).delete();

    revalidatePath("/dashboard/service");
    
    return {
      success: true,
      message: "Serviço deletado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao deletar serviço:", error);
    return {
      success: false,
      error: "Erro ao deletar serviço. Tente novamente.",
    };
  }
}

export async function getServices() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Usuário não autenticado",
        data: [],
      };
    }

    const servicesSnapshot = await adminDb.collection("services")
      .where("userId", "==", session.user.id)
      .get();

    const services: Service[] = servicesSnapshot.docs
      .map((doc: QueryDocumentSnapshot): Service => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          price: data.price || 0,
          duration: data.duration || 30,
          status: data.status ?? true,
        };
      })
      .sort((a: Service, b: Service) => {
        // Ordenar por ID (mais recentes primeiro, já que IDs são ordenados)
        return b.id.localeCompare(a.id);
      });

    return {
      success: true,
      data: services,
    };
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return {
      success: false,
      error: "Erro ao buscar serviços.",
      data: [],
    };
  }
}
