"use server";

import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/getSession";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import type { DashboardAppointment } from "../_types";

export async function getDashboardStats() {
  try {
    // Verificar se Firebase Admin está inicializado
    if (!adminDb) {
      console.error("❌ Firebase Admin não está inicializado. Verifique FIREBASE_SERVICE_ACCOUNT.");
      return null;
    }

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

    interface AppointmentWithDate extends Omit<DashboardAppointment, 'appointmentDate'> {
      appointmentDate: Date; // Para ordenação interna
    }

    const upcomingAppointments: DashboardAppointment[] = (await Promise.all(
      upcomingAppointmentsSnapshot.docs
        .map(async (doc: QueryDocumentSnapshot): Promise<AppointmentWithDate | null> => {
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
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || undefined,
              appointmentDate: appointmentDate, // Manter como Date para ordenação
              time: data.time || "",
              serviceId: data.serviceId || "",
              userId: data.userId || "",
              service: serviceData ? {
                id: serviceDoc.id,
                name: serviceData.name || "",
                price: serviceData.price || 0,
                duration: serviceData.duration || 30,
                status: serviceData.status ?? true,
              } : null,
            };
          }
          return null;
        })
    ))
    .filter((appointment): appointment is AppointmentWithDate => appointment !== null)
    .sort((a: AppointmentWithDate, b: AppointmentWithDate) => {
      // Ordenar por data ascendente (mais próximos primeiro)
      return a.appointmentDate.getTime() - b.appointmentDate.getTime();
    })
    .map((appointment: AppointmentWithDate): DashboardAppointment => ({
      ...appointment,
      // Converter para ISO string apenas no final, antes de retornar
      appointmentDate: appointment.appointmentDate.toISOString(),
    }))
    .slice(0, 5);

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
