"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, ArrowLeft } from "lucide-react";
import { AppointmentForm } from "./appointment-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import userImg from "../../../../../../public/foto1.png";
import Link from "next/link";

interface ProfessionalProfileProps {
  professional: {
    id: string;
    name: string | null;
    email: string;
    address: string | null;
    phone: string | null;
    image: string | null;
    times: string[];
    services: {
      id: string;
      name: string;
      price: number;
      duration: number;
    }[];
  };
}

export function ProfessionalProfile({
  professional,
}: ProfessionalProfileProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para profissionais
      </Link>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Informações do Profissional */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200">
                  {professional.image ? (
                    <Image
                      src={professional.image}
                      alt={professional.name || "Profissional"}
                      fill
                      className="object-cover"
                      unoptimized={professional.image.startsWith("http") || professional.image.startsWith("/")}
                    />
                  ) : (
                    <Image
                      src={userImg}
                      alt={professional.name || "Profissional"}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  {professional.name || "Profissional"}
                </h1>
                <div className="space-y-2 text-sm text-muted-foreground w-full">
                  {professional.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{professional.address}</span>
                    </div>
                  )}
                  {professional.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{professional.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{professional.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Serviços e Agendamento */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              {professional.services.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum serviço disponível no momento.
                </p>
              ) : (
                <div className="space-y-3">
                  {professional.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-semibold">{service.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Duração: {service.duration} minutos
                        </div>
                      </div>
                      <div className="text-lg font-bold text-emerald-600">
                        R$ {service.price.toFixed(2).replace(".", ",")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {professional.services.length > 0 && professional.times.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horários Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {professional.times.slice(0, 8).map((time) => (
                    <div
                      key={time}
                      className="p-2 text-center border rounded text-sm"
                    >
                      {time}
                    </div>
                  ))}
                </div>
                {professional.times.length > 8 && (
                  <p className="text-sm text-muted-foreground">
                    E mais {professional.times.length - 8} horários disponíveis
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {professional.services.length > 0 && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-lg py-6">
                  Agendar Horário
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agendar Horário</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para realizar seu agendamento. Primeiro selecione uma data, depois escolha o horário disponível.
                  </DialogDescription>
                </DialogHeader>
                <div className="relative z-[9999]">
                  <AppointmentForm
                    professionalId={professional.id}
                    services={professional.services}
                    availableTimes={professional.times}
                    onSuccess={() => setIsDialogOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}

