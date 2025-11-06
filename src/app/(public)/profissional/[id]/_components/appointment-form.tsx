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
import { createPublicAppointment } from "../../../agendar/_actions/create-public-appointment";
import { getOccupiedTimes } from "../../../agendar/_actions/get-occupied-times";
import { CalendarView } from "./calendar-view";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

const appointmentSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  phone: z.string().min(1, { message: "O telefone é obrigatório" }),
  appointmentDate: z.string().min(1, { message: "A data é obrigatória" }),
  time: z.string().min(1, { message: "O horário é obrigatório" }),
  serviceId: z.string().min(1, { message: "O serviço é obrigatório" }),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  professionalId: string;
  services: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[];
  availableTimes: string[];
  onSuccess?: () => void;
}

export function AppointmentForm({
  professionalId,
  services,
  availableTimes,
  onSuccess,
}: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const router = useRouter();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: "",
      phone: "",
      appointmentDate: "",
      time: "",
      serviceId: "",
    },
  });

  const selectedDate = form.watch("appointmentDate");
  const today = new Date().toISOString().split("T")[0];
  // Limitar até o final do ano atual
  const maxDate = new Date();
  maxDate.setMonth(11); // Dezembro (0-indexed, então 11 = dezembro)
  maxDate.setDate(31); // Último dia de dezembro
  const maxDateString = maxDate.toISOString().split("T")[0];

  // Buscar horários ocupados quando a data mudar
  useEffect(() => {
    if (selectedDate) {
      form.setValue("time", "");
      setIsLoadingTimes(true);
      
      const appointmentDate = new Date(selectedDate);
      getOccupiedTimes({
        userId: professionalId,
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
  }, [selectedDate, professionalId, form]);

  async function onSubmit(values: AppointmentFormData) {
    setIsSubmitting(true);
    try {
      const appointmentDate = new Date(values.appointmentDate);

      const result = await createPublicAppointment({
        name: values.name,
        phone: values.phone,
        appointmentDate,
        time: values.time,
        serviceId: values.serviceId,
        userId: professionalId,
      });

      if (result.success) {
        toast.success(result.message);
        form.reset();
        router.refresh();
        onSuccess?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao realizar agendamento. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Filtrar horários disponíveis: remover os já ocupados
  const filteredTimes = availableTimes.filter(
    (time) => !occupiedTimes.includes(time)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="(00) 00000-0000"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seleção de Data */}
        <FormField
          control={form.control}
          name="appointmentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selecione a Data</FormLabel>
              <div className="space-y-4">
                {/* Input de data nativo para seleção rápida */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <FormControl>
                    <Input
                      type="date"
                      min={today}
                      max={maxDateString}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      className="flex-1 w-full sm:w-auto"
                    />
                  </FormControl>
                  <span className="text-sm text-muted-foreground">
                    ou use o calendário abaixo
                  </span>
                </div>
                
                {/* Calendário Visual */}
                <Card>
                  <CardContent className="p-4">
                    <CalendarView
                      professionalId={professionalId}
                      availableTimes={availableTimes}
                      selectedDate={field.value || null}
                      onDateSelect={(date) => {
                        field.onChange(date);
                      }}
                      minDate={new Date(today)}
                      maxDate={maxDate}
                    />
                  </CardContent>
                </Card>
              </div>
              <FormMessage />
              {field.value && (() => {
                // Criar data no timezone local para evitar problemas de conversão
                const [year, month, day] = field.value.split('-').map(Number);
                const localDate = new Date(year, month - 1, day);
                
                return (
                  <p className="text-sm text-emerald-600 mt-1 font-medium">
                    ✓ Data selecionada: {localDate.toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                );
              })()}
            </FormItem>
          )}
        />

        {/* Seleção de Horário */}
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedDate || filteredTimes.length === 0 || isLoadingTimes}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue 
                      placeholder={
                        !selectedDate 
                          ? "Selecione primeiro a data no calendário" 
                          : isLoadingTimes
                          ? "Carregando horários..."
                          : filteredTimes.length === 0 
                          ? "Nenhum horário disponível" 
                          : "Selecione o horário"
                      } 
                    />
                  </SelectTrigger>
                </FormControl>
                {filteredTimes.length > 0 && !isLoadingTimes && (
                  <SelectContent>
                    {filteredTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>
              {selectedDate && !isLoadingTimes && filteredTimes.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {availableTimes.length === 0 
                    ? "O profissional não possui horários configurados"
                    : "Todos os horários para esta data já estão ocupados. Selecione outra data no calendário acima."}
                </p>
              )}
              {selectedDate && !isLoadingTimes && filteredTimes.length > 0 && (
                <p className="text-sm text-emerald-600 mt-1">
                  {filteredTimes.length} horário{filteredTimes.length > 1 ? "s" : ""} disponível{filteredTimes.length > 1 ? "eis" : ""} para esta data
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serviço</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - R${" "}
                      {service.price.toFixed(2).replace(".", ",")} ({service.duration}min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          disabled={isSubmitting || filteredTimes.length === 0}
        >
          {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
        </Button>
      </form>
    </Form>
  );
}

