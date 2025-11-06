"use server";

import { adminDb } from "@/lib/firebase-auth";
import { getSession } from "@/lib/getSession";
import { revalidatePath } from "next/cache";
import { calculateTimeSlots, isTimeSlotAvailable } from "@/app/(public)/agendar/_utils/time-slots";

interface CreateAppointmentData {
  name: string;
  email: string;
  appointmentDate: Date;
  time: string;
  serviceId: string;
}

interface UpdateAppointmentData extends CreateAppointmentData {
  id: string;
}

export async function createAppointment(data: CreateAppointmentData) {
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
        error: "Você precisa ter um plano ativo para criar agendamentos. Por favor, assine um plano primeiro.",
      };
    }

    // Verificar se o serviço pertence ao usuário
    const serviceDoc = await adminDb.collection("services").doc(data.serviceId).get();
    
    if (!serviceDoc.exists || serviceDoc.data()?.userId !== session.user.id) {
      return {
        success: false,
        error: "Serviço não encontrado",
      };
    }

    const serviceData = serviceDoc.data();
    const durationMinutes = serviceData.duration || 30;

    // Verificar data/hora passada
    const appointmentDate = data.appointmentDate instanceof Date 
      ? data.appointmentDate 
      : new Date(data.appointmentDate);
    
    // Criar data/hora completa do agendamento
    const [hours, minutes] = data.time.split(":").map(Number);
    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    if (appointmentDateTime <= now) {
      return {
        success: false,
        error: "Não é possível agendar em data/hora passada. Por favor, escolha uma data futura.",
      };
    }

    // Normalizar a data de comparação (apenas dia/mês/ano, sem hora)
    const appointmentDateOnly = new Date(
      appointmentDate.getFullYear(),
      appointmentDate.getMonth(),
      appointmentDate.getDate()
    );

    // Buscar todos os agendamentos do dia para verificar conflitos considerando duração
    const existingAppointments = await adminDb.collection("appointments")
      .where("userId", "==", session.user.id)
      .get();

    // Coletar todos os horários ocupados (considerando duração dos serviços)
    const occupiedTimesSet = new Set<string>();
    
    for (const doc of existingAppointments.docs) {
      const docData = doc.data();
      const docDate = docData.appointmentDate?.toDate 
        ? docData.appointmentDate.toDate() 
        : new Date(docData.appointmentDate);
      
      // Comparar apenas a data (sem hora)
      const docDateOnly = new Date(
        docDate.getFullYear(),
        docDate.getMonth(),
        docDate.getDate()
      );
      
      if (docDateOnly.getTime() === appointmentDateOnly.getTime()) {
        // Buscar duração do serviço deste agendamento
        let existingDuration = 30;
        if (docData.serviceId) {
          const existingServiceDoc = await adminDb.collection("services").doc(docData.serviceId).get();
          if (existingServiceDoc.exists) {
            const existingServiceData = existingServiceDoc.data();
            existingDuration = existingServiceData?.duration || 30;
          }
        }
        
        // Calcular todos os slots ocupados por este agendamento
        const occupiedSlots = calculateTimeSlots(docData.time, existingDuration);
        occupiedSlots.forEach(slot => occupiedTimesSet.add(slot));
      }
    }

    // Buscar horários disponíveis do profissional
    const userDoc = await adminDb.collection("users").doc(session.user.id).get();
    const userData = userDoc.data();
    const availableTimes = userData?.times || [];
    const occupiedTimes = Array.from(occupiedTimesSet);

    // Verificar se o horário solicitado está disponível (considerando duração)
    if (!isTimeSlotAvailable(data.time, durationMinutes, occupiedTimes, availableTimes)) {
      return {
        success: false,
        error: "Este horário não está disponível. O serviço requer mais tempo do que está livre. Por favor, escolha outro horário.",
      };
    }

    const appointmentRef = adminDb.collection("appointments").doc();
    const appointmentData = {
      name: data.name,
      email: data.email || "",
      appointmentDate: appointmentDate,
      time: data.time,
      serviceId: data.serviceId,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await appointmentRef.set(appointmentData);

    revalidatePath("/dashboard");
    
    return {
      success: true,
      data: { 
        id: appointmentRef.id, 
        ...appointmentData,
        service: serviceData
      },
      message: "Agendamento criado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return {
      success: false,
      error: "Erro ao criar agendamento. Tente novamente.",
    };
  }
}

export async function updateAppointment(data: UpdateAppointmentData) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    // Verificar se o agendamento pertence ao usuário
    const appointmentDoc = await adminDb.collection("appointments").doc(data.id).get();
    
    if (!appointmentDoc.exists || appointmentDoc.data()?.userId !== session.user.id) {
      return {
        success: false,
        error: "Agendamento não encontrado ou você não tem permissão para editá-lo",
      };
    }

    const appointmentDate = data.appointmentDate instanceof Date 
      ? data.appointmentDate 
      : new Date(data.appointmentDate);

    // Buscar serviço para obter duração
    const serviceDoc = await adminDb.collection("services").doc(data.serviceId).get();
    const serviceData = serviceDoc.exists ? serviceDoc.data() : null;
    
    if (!serviceDoc.exists || !serviceData) {
      return {
        success: false,
        error: "Serviço não encontrado",
      };
    }

    const durationMinutes = serviceData.duration || 30;

    // Verificar data/hora passada
    const [hours, minutes] = data.time.split(":").map(Number);
    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    if (appointmentDateTime <= now) {
      return {
        success: false,
        error: "Não é possível agendar em data/hora passada. Por favor, escolha uma data futura.",
      };
    }

    // Normalizar a data de comparação (apenas dia/mês/ano, sem hora)
    const appointmentDateOnly = new Date(
      appointmentDate.getFullYear(),
      appointmentDate.getMonth(),
      appointmentDate.getDate()
    );

    // Buscar todos os agendamentos do dia para verificar conflitos considerando duração
    const existingAppointments = await adminDb.collection("appointments")
      .where("userId", "==", session.user.id)
      .get();

    // Coletar todos os horários ocupados (considerando duração dos serviços, exceto o próprio)
    const occupiedTimesSet = new Set<string>();
    
    for (const doc of existingAppointments.docs) {
      // Pular o próprio agendamento
      if (doc.id === data.id) continue;
      
      const docData = doc.data();
      const docDate = docData.appointmentDate?.toDate 
        ? docData.appointmentDate.toDate() 
        : new Date(docData.appointmentDate);
      
      // Comparar apenas a data (sem hora)
      const docDateOnly = new Date(
        docDate.getFullYear(),
        docDate.getMonth(),
        docDate.getDate()
      );
      
      if (docDateOnly.getTime() === appointmentDateOnly.getTime()) {
        // Buscar duração do serviço deste agendamento
        let existingDuration = 30;
        if (docData.serviceId) {
          const existingServiceDoc = await adminDb.collection("services").doc(docData.serviceId).get();
          if (existingServiceDoc.exists) {
            const existingServiceData = existingServiceDoc.data();
            existingDuration = existingServiceData?.duration || 30;
          }
        }
        
        // Calcular todos os slots ocupados por este agendamento
        const occupiedSlots = calculateTimeSlots(docData.time, existingDuration);
        occupiedSlots.forEach(slot => occupiedTimesSet.add(slot));
      }
    }

    // Buscar horários disponíveis do profissional
    const userDoc = await adminDb.collection("users").doc(session.user.id).get();
    const userData = userDoc.data();
    const availableTimes = userData?.times || [];
    const occupiedTimes = Array.from(occupiedTimesSet);

    // Verificar se o horário solicitado está disponível (considerando duração)
    if (!isTimeSlotAvailable(data.time, durationMinutes, occupiedTimes, availableTimes)) {
      return {
        success: false,
        error: "Este horário não está disponível. O serviço requer mais tempo do que está livre. Por favor, escolha outro horário.",
      };
    }

    await adminDb.collection("appointments").doc(data.id).update({
      name: data.name,
      email: data.email || "",
      appointmentDate: appointmentDate,
      time: data.time,
      serviceId: data.serviceId,
      updatedAt: new Date(),
    });

    const appointmentData = appointmentDoc.data();
    const updatedData = {
      ...appointmentData,
      ...data,
      id: appointmentDoc.id,
      appointmentDate: appointmentDate,
      service: serviceData,
      updatedAt: new Date(),
    };

    revalidatePath("/dashboard");
    
    return {
      success: true,
      data: updatedData,
      message: "Agendamento atualizado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return {
      success: false,
      error: "Erro ao atualizar agendamento. Tente novamente.",
    };
  }
}

export async function deleteAppointment(appointmentId: string) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    // Verificar se o agendamento pertence ao usuário
    const appointmentDoc = await adminDb.collection("appointments").doc(appointmentId).get();
    
    if (!appointmentDoc.exists || appointmentDoc.data()?.userId !== session.user.id) {
      return {
        success: false,
        error: "Agendamento não encontrado ou você não tem permissão para deletá-lo",
      };
    }

    await adminDb.collection("appointments").doc(appointmentId).delete();

    revalidatePath("/dashboard");
    
    return {
      success: true,
      message: "Agendamento deletado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
    return {
      success: false,
      error: "Erro ao deletar agendamento. Tente novamente.",
    };
  }
}

export async function getAppointments() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Usuário não autenticado",
        data: [],
      };
    }

    const appointmentsSnapshot = await adminDb.collection("appointments")
      .where("userId", "==", session.user.id)
      .get();

    // Buscar serviços relacionados
    const appointments = (await Promise.all(
      appointmentsSnapshot.docs.map(async (doc: any) => {
        const data = doc.data();
        const serviceDoc = await adminDb.collection("services").doc(data.serviceId).get();
        let service = null;
        if (serviceDoc.exists) {
          const serviceData = serviceDoc.data();
          service = {
            id: serviceDoc.id,
            name: serviceData.name,
            price: serviceData.price,
            duration: serviceData.duration,
            status: serviceData.status,
          };
        }
        
        const appointmentDate = data.appointmentDate?.toDate 
          ? data.appointmentDate.toDate() 
          : new Date(data.appointmentDate);
        
        return {
          id: doc.id,
          name: data.name,
          email: data.email || "",
          phone: data.phone || "",
          appointmentDate: appointmentDate.toISOString(),
          time: data.time,
          serviceId: data.serviceId,
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
          service: service,
        };
      })
    )).sort((a, b) => {
      // Ordenar por data descendente (mais recentes primeiro)
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return dateB.getTime() - dateA.getTime();
    });

    return {
      success: true,
      data: appointments,
    };
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return {
      success: false,
      error: "Erro ao buscar agendamentos.",
      data: [],
    };
  }
}
