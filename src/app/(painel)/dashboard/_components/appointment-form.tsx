"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAppointment, updateAppointment } from "../_actions/appointment-actions";
import { getOccupiedTimesPanel } from "@/app/(public)/agendar/_actions/get-occupied-times-panel";
import { isTimeSlotAvailable } from "@/app/(public)/agendar/_utils/time-slots";
import { getUserData } from "../profile/_data-access/get-info-user";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const appointmentSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  appointmentDate: z.string().min(1, { message: "A data é obrigatória" }),
  time: z.string().min(1, { message: "O horário é obrigatório" }),
  serviceId: z.string().min(1, { message: "O serviço é obrigatório" }),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  appointment?: {
    id: string;
    name: string;
    email: string;
    appointmentDate: string | Date; // Pode vir como string ISO do Firestore
    time: string;
    serviceId: string;
  };
  services: {
    id: string;
    name: string;
    price: number;
    duration: number;
    status: boolean;
  }[];
  onSuccess?: () => void;
}

export function AppointmentForm({
  appointment,
  services,
  onSuccess,
}: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  const activeServices = services.filter((s) => s.status);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: appointment?.name || "",
      email: appointment?.email || "",
      appointmentDate: appointment
        ? (typeof appointment.appointmentDate === 'string' 
            ? new Date(appointment.appointmentDate).toISOString().split("T")[0]
            : appointment.appointmentDate.toISOString().split("T")[0])
        : "",
      time: appointment?.time || "",
      serviceId: appointment?.serviceId || "",
    },
  });

  const selectedDate = form.watch("appointmentDate");
  const selectedServiceId = form.watch("serviceId");
  const selectedService = activeServices.find(s => s.id === selectedServiceId);

  // Carregar horários disponíveis do profissional
  useEffect(() => {
    async function loadAvailableTimes() {
      try {
        const userData = await getUserData({});
        if (userData?.times && Array.isArray(userData.times)) {
          setAvailableTimes(userData.times);
        }
      } catch (error) {
        console.error("Erro ao carregar horários disponíveis:", error);
      }
    }
    loadAvailableTimes();
  }, []);

  // Limpar horário quando serviço ou data mudarem
  useEffect(() => {
    form.setValue("time", "");
  }, [selectedDate, selectedServiceId, form]);

  // Buscar horários ocupados quando a data mudar
  useEffect(() => {
    if (selectedDate) {
      setIsLoadingTimes(true);
      
      const appointmentDate = new Date(selectedDate);
      getOccupiedTimesPanel({
        appointmentDate,
      })
        .then((occupied) => {
          setOccupiedTimes(occupied);
        })
        .catch((error) => {
          console.error("Erro ao buscar horários ocupados:", error);
          setOccupiedTimes([]);
        })
        .finally(() => {
          setIsLoadingTimes(false);
        });
    } else {
      setOccupiedTimes([]);
    }
  }, [selectedDate]);

  // Filtrar horários disponíveis considerando duração do serviço
  const getAvailableTimeSlots = (): string[] => {
    if (!selectedService || !selectedDate || availableTimes.length === 0) {
      return [];
    }

    const durationMinutes = selectedService.duration || 30;
    const filteredTimes: string[] = [];

    for (const time of availableTimes) {
      if (isTimeSlotAvailable(time, durationMinutes, occupiedTimes, availableTimes)) {
        filteredTimes.push(time);
      }
    }

    return filteredTimes;
  };

  const availableTimeSlots = getAvailableTimeSlots();

  async function onSubmit(values: AppointmentFormData) {
    setIsSubmitting(true);
    try {
      const appointmentDate = new Date(values.appointmentDate);

      const result = appointment
        ? await updateAppointment({
            ...values,
            id: appointment.id,
            appointmentDate,
          })
        : await createAppointment({
            ...values,
            appointmentDate,
          });

      if (result.success) {
        toast.success(result.message);
        form.reset();
        onSuccess?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao salvar agendamento. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cliente</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="appointmentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedDate || !selectedService || isLoadingTimes || availableTimeSlots.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue 
                        placeholder={
                          !selectedDate
                            ? "Selecione primeiro a data"
                            : !selectedService
                            ? "Selecione primeiro o serviço"
                            : isLoadingTimes
                            ? "Carregando horários..."
                            : availableTimeSlots.length === 0
                            ? "Nenhum horário disponível"
                            : "Selecione o horário"
                        } 
                      />
                    </SelectTrigger>
                  </FormControl>
                  {availableTimeSlots.length > 0 && !isLoadingTimes && (
                    <SelectContent>
                      {availableTimeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
                {selectedDate && selectedService && !isLoadingTimes && availableTimeSlots.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Todos os horários para esta data já estão ocupados ou o serviço requer mais tempo do que está disponível. Selecione outra data ou serviço.
                  </p>
                )}
                {selectedDate && selectedService && !isLoadingTimes && availableTimeSlots.length > 0 && (
                  <p className="text-sm text-emerald-600 mt-1">
                    {availableTimeSlots.length} horário{availableTimeSlots.length > 1 ? "s" : ""} disponível{availableTimeSlots.length > 1 ? "eis" : ""} para esta data e serviço
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serviço</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Limpar horário quando serviço mudar
                  form.setValue("time", "");
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activeServices.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Nenhum serviço ativo disponível
                    </div>
                  ) : (
                    activeServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - R$ {service.price.toFixed(2).replace(".", ",")} ({service.duration}min)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          disabled={isSubmitting || activeServices.length === 0}
        >
          {isSubmitting
            ? "Salvando..."
            : appointment
            ? "Atualizar Agendamento"
            : "Criar Agendamento"}
        </Button>
      </form>
    </Form>
  );
}

