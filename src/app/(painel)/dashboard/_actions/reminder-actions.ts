"use server";

import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/getSession";
import { revalidatePath } from "next/cache";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

interface CreateReminderData {
  description: string;
}

// ReminderData será convertido para o tipo Reminder esperado pelo componente
interface ReminderData {
  id: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface UpdateReminderData extends CreateReminderData {
  id: string;
}

// Tipo para retorno (compatível com o componente)
interface Reminder {
  id: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
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

    if (!adminDb) {
      return {
        success: false,
        error: "Servidor não configurado corretamente",
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

    const reminders: ReminderData[] = remindersSnapshot.docs
      .map((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate 
          ? data.createdAt.toDate() 
          : data.createdAt instanceof Date 
          ? data.createdAt
          : new Date();
        const updatedAt = data.updatedAt?.toDate 
          ? data.updatedAt.toDate() 
          : data.updatedAt instanceof Date 
          ? data.updatedAt
          : null;
        return {
          id: doc.id,
          description: data.description || "",
          userId: data.userId || "",
          createdAt,
          updatedAt,
        };
      })
      .sort((a: ReminderData, b: ReminderData) => {
        return b.createdAt.getTime() - a.createdAt.getTime(); // Descendente
      });

    // Converter ReminderData[] para Reminder[] (compatível com o componente)
    // ReminderData já tem a mesma estrutura que Reminder, então podemos fazer cast direto
    const remindersForComponent = reminders.map((r): Reminder => ({
      id: r.id,
      description: r.description,
      userId: r.userId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    return {
      success: true,
      data: remindersForComponent,
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
