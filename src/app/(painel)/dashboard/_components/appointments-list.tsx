"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Calendar, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AppointmentForm } from "./appointment-form";
import { deleteAppointment } from "../_actions/appointment-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Tipo para compatibilidade com AppointmentForm
interface AppointmentFormData {
  id: string;
  name: string;
  email: string;
  appointmentDate: string | Date;
  time: string;
  serviceId: string;
}

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone?: string; // Telefone do cliente
  appointmentDate: string | Date; // Pode vir como string ISO do Firestore
  time: string;
  serviceId?: string; // ID do serviço (para compatibilidade com AppointmentForm)
  service: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  status: boolean;
}

interface AppointmentsListProps {
  appointments: Appointment[];
  services: Service[];
}

export function AppointmentsList({
  appointments,
  services,
}: AppointmentsListProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  async function handleDelete(appointmentId: string) {
    if (!confirm("Tem certeza que deseja deletar este agendamento?")) {
      return;
    }

    const result = await deleteAppointment(appointmentId);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  // Função para gerar link do WhatsApp
  function getWhatsAppLink(phone: string, name: string): string {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, "");
    // Formata mensagem padrão
    const message = encodeURIComponent(`Olá ${name}! Estou entrando em contato sobre seu agendamento.`);
    return `https://wa.me/55${cleanPhone}?text=${message}`;
  }

  const upcomingAppointments = appointments.filter(
    (apt) => {
      const aptDate = typeof apt.appointmentDate === 'string' 
        ? new Date(apt.appointmentDate) 
        : apt.appointmentDate;
      return aptDate >= new Date();
    }
  );
  const pastAppointments = appointments.filter(
    (apt) => {
      const aptDate = typeof apt.appointmentDate === 'string' 
        ? new Date(apt.appointmentDate) 
        : apt.appointmentDate;
      return aptDate < new Date();
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agendamentos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus agendamentos
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Agendamento</DialogTitle>
              <DialogDescription>
                Adicione um novo agendamento à sua agenda
              </DialogDescription>
            </DialogHeader>
            <AppointmentForm
              services={services}
              onSuccess={() => {
                setIsCreateOpen(false);
                router.refresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Próximos Agendamentos */}
      {upcomingAppointments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Próximos Agendamentos</h2>
          <div className="grid gap-4">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-lg">
                        {appointment.name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 space-y-1">
                        {appointment.email && <div>{appointment.email}</div>}
                        {appointment.phone && (
                          <div className="flex items-center gap-2">
                            <span>{appointment.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          {format(
                            typeof appointment.appointmentDate === 'string' 
                              ? new Date(appointment.appointmentDate)
                              : appointment.appointmentDate,
                            "dd/MM/yyyy",
                            { locale: ptBR }
                          )}{" "}
                          às {appointment.time}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.service.name} - R${" "}
                          {appointment.service.price.toFixed(2).replace(".", ",")}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {appointment.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white border-green-500"
                          onClick={() => {
                            window.open(
                              getWhatsAppLink(appointment.phone!, appointment.name),
                              "_blank"
                            );
                          }}
                          title={`Enviar mensagem para ${appointment.name} no WhatsApp`}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Dialog
                        open={editingAppointment?.id === appointment.id}
                        onOpenChange={(open) =>
                          !open && setEditingAppointment(null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingAppointment(appointment)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Editar Agendamento</DialogTitle>
                            <DialogDescription>
                              Atualize as informações do agendamento
                            </DialogDescription>
                          </DialogHeader>
                          <AppointmentForm
                            services={services}
                            appointment={{
                              id: appointment.id,
                              name: appointment.name,
                              email: appointment.email,
                              appointmentDate: appointment.appointmentDate,
                              time: appointment.time,
                              serviceId: appointment.serviceId || (appointment.service?.id || ""),
                            } as AppointmentFormData}
                            onSuccess={() => {
                              setEditingAppointment(null);
                              router.refresh();
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Agendamentos Passados */}
      {pastAppointments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Agendamentos Passados</h2>
          <div className="grid gap-4">
            {pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold">{appointment.name}</div>
                      <div className="text-sm text-muted-foreground mt-1 space-y-1">
                        {appointment.email && <div>{appointment.email}</div>}
                        {appointment.phone && (
                          <div className="flex items-center gap-2">
                            <span>{appointment.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(
                            typeof appointment.appointmentDate === 'string' 
                              ? new Date(appointment.appointmentDate)
                              : appointment.appointmentDate,
                            "dd/MM/yyyy",
                            { locale: ptBR }
                          )}{" "}
                          às {appointment.time}
                        </div>
                        <div className="text-muted-foreground">
                          {appointment.service.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {appointment.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white border-green-500"
                          onClick={() => {
                            window.open(
                              getWhatsAppLink(appointment.phone!, appointment.name),
                              "_blank"
                            );
                          }}
                          title={`Enviar mensagem para ${appointment.name} no WhatsApp`}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {appointments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhum agendamento cadastrado ainda.
            </p>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Criar primeiro agendamento</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Novo Agendamento</DialogTitle>
                  <DialogDescription>
                    Adicione um novo agendamento à sua agenda
                  </DialogDescription>
                </DialogHeader>
                <AppointmentForm
                  services={services}
                  onSuccess={() => {
                    setIsCreateOpen(false);
                    router.refresh();
                  }}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

