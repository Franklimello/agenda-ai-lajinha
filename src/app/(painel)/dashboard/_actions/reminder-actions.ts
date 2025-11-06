"use server";

import { adminDb } from "@/lib/firebase-auth";
import { getSession } from "@/lib/getSession";
import { revalidatePath } from "next/cache";

interface CreateReminderData {
  description: string;
}

interface UpdateReminderData extends CreateReminderData {
  id: string;
}

export async function createReminder(data: CreateReminderData) {
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
        error: "Você precisa ter um plano ativo para criar lembretes. Por favor, assine um plano primeiro.",
      };
    }

    const reminderRef = adminDb.collection("reminders").doc();
    const reminderData = {
      description: data.description,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await reminderRef.set(reminderData);

    revalidatePath("/dashboard/reminders");
    
    return {
      success: true,
      data: { id: reminderRef.id, ...reminderData },
      message: "Lembrete criado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao criar lembrete:", error);
    return {
      success: false,
      error: "Erro ao criar lembrete. Tente novamente.",
    };
  }
}

export async function updateReminder(data: UpdateReminderData) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    // Verificar se o lembrete pertence ao usuário
    const reminderDoc = await adminDb.collection("reminders").doc(data.id).get();
    
    if (!reminderDoc.exists || reminderDoc.data()?.userId !== session.user.id) {
      return {
        success: false,
        error: "Lembrete não encontrado ou você não tem permissão para editá-lo",
      };
    }

    await adminDb.collection("reminders").doc(data.id).update({
      description: data.description,
      updatedAt: new Date(),
    });

    const updatedReminder = {
      id: reminderDoc.id,
      ...reminderDoc.data(),
      description: data.description,
      updatedAt: new Date(),
    };

    revalidatePath("/dashboard/reminders");
    
    return {
      success: true,
      data: updatedReminder,
      message: "Lembrete atualizado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao atualizar lembrete:", error);
    return {
      success: false,
      error: "Erro ao atualizar lembrete. Tente novamente.",
    };
  }
}

export async function deleteReminder(reminderId: string) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    // Verificar se o lembrete pertence ao usuário
    const reminderDoc = await adminDb.collection("reminders").doc(reminderId).get();
    
    if (!reminderDoc.exists || reminderDoc.data()?.userId !== session.user.id) {
      return {
        success: false,
        error: "Lembrete não encontrado ou você não tem permissão para deletá-lo",
      };
    }

    await adminDb.collection("reminders").doc(reminderId).delete();

    revalidatePath("/dashboard/reminders");
    
    return {
      success: true,
      message: "Lembrete deletado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao deletar lembrete:", error);
    return {
      success: false,
      error: "Erro ao deletar lembrete. Tente novamente.",
    };
  }
}

export async function getReminders() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Usuário não autenticado",
        data: [],
      };
    }

    const remindersSnapshot = await adminDb.collection("reminders")
      .where("userId", "==", session.user.id)
      .get();

    const reminders = remindersSnapshot.docs
      .map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          description: data.description,
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
      data: reminders,
    };
  } catch (error) {
    console.error("Erro ao buscar lembretes:", error);
    return {
      success: false,
      error: "Erro ao buscar lembretes.",
      data: [],
    };
  }
}
