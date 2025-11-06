"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  name: string;
  email: string;
  appointmentDate: string | Date; // Pode vir como string ISO do Firestore
  time: string;
  service: {
    id: string;
    name: string;
  };
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

export function UpcomingAppointments({
  appointments,
}: UpcomingAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck2 className="w-5 h-5" />
            Próximos Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Nenhum agendamento próximo encontrado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck2 className="w-5 h-5" />
          Próximos Agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="font-semibold">{appointment.name}</div>
                <div className="text-sm text-muted-foreground">
                  {appointment.email}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {appointment.service.name}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {format(
                    typeof appointment.appointmentDate === 'string' 
                      ? new Date(appointment.appointmentDate)
                      : appointment.appointmentDate,
                    "dd/MM/yyyy",
                    { locale: ptBR }
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {appointment.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

