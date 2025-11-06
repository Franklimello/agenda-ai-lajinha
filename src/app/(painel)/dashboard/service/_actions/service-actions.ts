"use server";

import { adminDb } from "@/lib/firebase-auth";
import { getSession } from "@/lib/getSession";
import { revalidatePath } from "next/cache";

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

    const services = servicesSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          duration: data.duration,
          status: data.status,
          userId: data.userId,
          createdAt: data.createdAt?.toDate 
            ? data.createdAt.toDate().toISOString() 
            : data.createdAt instanceof Date 
            ? data.createdAt.toISOString()
            : null,
          updatedAt: data.updatedAt?.toDate 
            ? data.updatedAt.toDate().toISOString() 
            : data.updatedAt instanceof Date 
            ? data.updatedAt.toISOString()
            : null,
        };
      })
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB.getTime() - dateA.getTime(); // Descendente
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
