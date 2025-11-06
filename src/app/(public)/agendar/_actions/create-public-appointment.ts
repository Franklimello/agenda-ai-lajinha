"use server";

import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { calculateTimeSlots, isTimeSlotAvailable } from "../_utils/time-slots";

interface CreatePublicAppointmentData {
  name: string;
  phone: string;
  appointmentDate: Date;
  time: string;
  serviceId: string;
  userId: string;
}

export async function createPublicAppointment(
  data: CreatePublicAppointmentData
) {
  try {
    if (!adminDb) {
      return {
        success: false,
        error: "Servidor não configurado corretamente",
      };
    }

    // Verificar se o serviço existe e está ativo
    const serviceDoc = await adminDb.collection("services").doc(data.serviceId).get();
    
    if (!serviceDoc.exists) {
      return {
        success: false,
        error: "Serviço não encontrado ou indisponível",
      };
    }

    const serviceData = serviceDoc.data();
    
    if (serviceData?.userId !== data.userId || !serviceData?.status) {
      return {
        success: false,
        error: "Serviço não encontrado ou indisponível",
      };
    }

    const appointmentDate = data.appointmentDate instanceof Date 
      ? data.appointmentDate 
      : new Date(data.appointmentDate);

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

    // Obter duração do serviço
    const durationMinutes = serviceData.duration || 30;

    // Buscar todos os agendamentos existentes para esta data
    const existingAppointments = await adminDb.collection("appointments")
      .where("userId", "==", data.userId)
      .get();

    // Normalizar a data de comparação (apenas dia/mês/ano, sem hora)
    const appointmentDateOnly = new Date(
      appointmentDate.getFullYear(),
      appointmentDate.getMonth(),
      appointmentDate.getDate()
    );

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

    // Verificar se o profissional está ativo e obter horários disponíveis
    const userDoc = await adminDb.collection("users").doc(data.userId).get();
    
    if (!userDoc.exists || !userDoc.data()?.status) {
      return {
        success: false,
        error: "Profissional não está disponível no momento",
      };
    }

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

    // Criar agendamento
    const appointmentRef = adminDb.collection("appointments").doc();
    const appointmentData = {
      name: data.name,
      phone: data.phone,
      email: "", // Mantido para compatibilidade
      appointmentDate: appointmentDate,
      time: data.time,
      serviceId: data.serviceId,
      userId: data.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await appointmentRef.set(appointmentData);

    revalidatePath(`/profissional/${data.userId}`);
    
    return {
      success: true,
      data: {
        id: appointmentRef.id,
        name: appointmentData.name,
        phone: appointmentData.phone,
        email: appointmentData.email,
        appointmentDate: appointmentData.appointmentDate.toISOString(),
        time: appointmentData.time,
        serviceId: appointmentData.serviceId,
        userId: appointmentData.userId,
        service: {
          id: serviceDoc.id,
          name: serviceData.name,
          price: serviceData.price,
          duration: serviceData.duration,
          status: serviceData.status,
        },
        user: {
          id: userDoc.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
        },
      },
      message: "Agendamento realizado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return {
      success: false,
      error: "Erro ao realizar agendamento. Tente novamente.",
    };
  }
}
