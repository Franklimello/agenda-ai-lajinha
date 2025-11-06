"use server";

import { adminDb } from "@/lib/firebase-auth";
import { getSession } from "@/lib/getSession";

export async function getDashboardStats() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return null;
    }

    const userId = session.user.id;

    // Buscar serviços ativos
    const servicesSnapshot = await adminDb.collection("services")
      .where("userId", "==", userId)
      .where("status", "==", true)
      .get();

    // Buscar todos os agendamentos
    const appointmentsSnapshot = await adminDb.collection("appointments")
      .where("userId", "==", userId)
      .get();

    // Buscar próximos agendamentos (futuros)
    const now = new Date();
    const upcomingAppointmentsSnapshot = await adminDb.collection("appointments")
      .where("userId", "==", userId)
      .get();

    const upcomingAppointments = (await Promise.all(
      upcomingAppointmentsSnapshot.docs
        .map(async (doc: any) => {
          const data = doc.data();
          const appointmentDate = data.appointmentDate?.toDate 
            ? data.appointmentDate.toDate() 
            : data.appointmentDate instanceof Date
            ? data.appointmentDate
            : new Date(data.appointmentDate);
          
          if (appointmentDate >= now) {
            const serviceDoc = await adminDb.collection("services").doc(data.serviceId).get();
            const serviceData = serviceDoc.exists ? serviceDoc.data() : null;
            
            return {
              id: doc.id,
              name: data.name,
              email: data.email || "",
              phone: data.phone || "",
              appointmentDate: appointmentDate, // Manter como Date para ordenação
              time: data.time,
              serviceId: data.serviceId,
              userId: data.userId,
              service: serviceData ? {
                id: serviceDoc.id,
                name: serviceData.name,
                price: serviceData.price,
                duration: serviceData.duration,
                status: serviceData.status,
              } : null,
            };
          }
          return null;
        })
    ))
    .filter(Boolean)
    .sort((a: any, b: any) => {
      // Ordenar por data ascendente (mais próximos primeiro)
      const dateA = a.appointmentDate instanceof Date ? a.appointmentDate : new Date(a.appointmentDate);
      const dateB = b.appointmentDate instanceof Date ? b.appointmentDate : new Date(b.appointmentDate);
      return dateA.getTime() - dateB.getTime();
    })
    .map((appointment: any) => ({
      ...appointment,
      // Converter para ISO string apenas no final, antes de retornar
      appointmentDate: appointment.appointmentDate instanceof Date 
        ? appointment.appointmentDate.toISOString() 
        : appointment.appointmentDate,
    }))
    .slice(0, 5) as any[];

    return {
      servicesCount: servicesSnapshot.size,
      appointmentsCount: appointmentsSnapshot.size,
      upcomingAppointments,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return null;
  }
}
