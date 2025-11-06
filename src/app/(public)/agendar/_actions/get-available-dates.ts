"use server";

import { adminDb } from "@/lib/firebase";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

interface GetAvailableDatesParams {
  userId: string;
  startDate: Date;
  endDate: Date;
  availableTimes: string[];
}

export async function getAvailableDates({
  userId,
  startDate,
  endDate,
  availableTimes,
}: GetAvailableDatesParams) {
  try {
    // Se não há horários configurados, retornar vazio
    if (availableTimes.length === 0) {
      return [];
    }

    // Normalizar datas para comparação
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Buscar todos os agendamentos no período
    const appointmentsSnapshot = await adminDb.collection("appointments")
      .where("userId", "==", userId)
      .where("appointmentDate", ">=", start)
      .where("appointmentDate", "<=", end)
      .get();

    // Agrupar agendamentos por data (chave: YYYY-MM-DD)
    const appointmentsByDate = new Map<string, Set<string>>();
    
    appointmentsSnapshot.docs.forEach((doc: QueryDocumentSnapshot) => {
      const appointmentData = doc.data();
      const appointmentDate = appointmentData.appointmentDate?.toDate 
        ? appointmentData.appointmentDate.toDate() 
        : new Date(appointmentData.appointmentDate);
      
      const dateKey = appointmentDate.toISOString().split("T")[0];
      if (!appointmentsByDate.has(dateKey)) {
        appointmentsByDate.set(dateKey, new Set());
      }
      appointmentsByDate.get(dateKey)!.add(appointmentData.time);
    });

    // Verificar quais datas têm horários disponíveis
    // Expandir até o final do ano se necessário
    const endOfYear = new Date();
    endOfYear.setMonth(11); // Dezembro
    endOfYear.setDate(31);
    endOfYear.setHours(23, 59, 59, 999);
    
    const actualEnd = end > endOfYear ? endOfYear : end;
    
    const availableDates: string[] = [];
    const currentDate = new Date(start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    while (currentDate <= actualEnd) {
      // Pular datas passadas
      if (currentDate < today) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      const dateKey = currentDate.toISOString().split("T")[0];
      const occupiedTimes = appointmentsByDate.get(dateKey) || new Set();
      
      // Verificar se há pelo menos um horário disponível
      const hasAvailableTime = availableTimes.some(
        (time) => !occupiedTimes.has(time)
      );
      
      if (hasAvailableTime) {
        availableDates.push(dateKey);
      }
      
      // Próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return availableDates;
  } catch (error) {
    console.error("Erro ao buscar datas disponíveis:", error);
    return [];
  }
}
