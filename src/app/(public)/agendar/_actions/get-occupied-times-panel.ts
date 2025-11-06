"use server";

import { adminDb } from "@/lib/firebase-auth";
import { getSession } from "@/lib/getSession";
import { calculateTimeSlots } from "../_utils/time-slots";

interface GetOccupiedTimesPanelParams {
  appointmentDate: Date;
}

export async function getOccupiedTimesPanel({
  appointmentDate,
}: GetOccupiedTimesPanelParams) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return [];
    }

    const userId = session.user.id;

    // Criar início e fim do dia (00:00:00 até 23:59:59)
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Buscar agendamentos já existentes para esta data e profissional
    const appointmentsSnapshot = await adminDb.collection("appointments")
      .where("userId", "==", userId)
      .get();

    // Filtrar agendamentos que estão na mesma data (comparando apenas a data, não hora)
    const occupiedTimesSet = new Set<string>();
    const targetDateOnly = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), startOfDay.getDate());
    
    // Buscar a duração de cada serviço para calcular todos os slots ocupados
    for (const doc of appointmentsSnapshot.docs) {
      const appointmentData = doc.data();
      const appointmentDate = appointmentData.appointmentDate?.toDate 
        ? appointmentData.appointmentDate.toDate() 
        : new Date(appointmentData.appointmentDate);
      
      // Comparar apenas a data (sem hora)
      const appointmentDateOnly = new Date(
        appointmentDate.getFullYear(), 
        appointmentDate.getMonth(), 
        appointmentDate.getDate()
      );
      
      if (appointmentDateOnly.getTime() === targetDateOnly.getTime()) {
        const startTime = appointmentData.time;
        
        // Buscar a duração do serviço
        let durationMinutes = 30; // padrão de 30 minutos
        if (appointmentData.serviceId) {
          const serviceDoc = await adminDb.collection("services").doc(appointmentData.serviceId).get();
          if (serviceDoc.exists) {
            const serviceData = serviceDoc.data();
            durationMinutes = serviceData?.duration || 30;
          }
        }
        
        // Calcular todos os slots ocupados por este agendamento
        const slots = calculateTimeSlots(startTime, durationMinutes);
        slots.forEach(slot => occupiedTimesSet.add(slot));
      }
    }

    return Array.from(occupiedTimesSet);
  } catch (error) {
    console.error("Erro ao buscar horários ocupados:", error);
    return [];
  }
}

