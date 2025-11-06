"use client";
import { useState, useEffect } from "react";
import { ProfileFormData, useProfileForm } from "./profile-form";
import { updateProfile } from "../_actions/update-profile";
import { useRouter } from "next/navigation";
import { useFirebaseSession } from "@/lib/use-firebase-session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRightCircleIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ImageUpload } from "./image-upload";

interface ProfileContentProps {
  user: {
    id: string;
    name: string | null;
    address: string | null;
    phone: string | null;
    status: boolean | null;
    times: string[];
    timezone: string | null;
    image: string | null;
  };
}

export function ProfileContent({ user }: ProfileContentProps) {
  const [selectedHours, setSelectedHours] = useState<string[]>(
    user.times || []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    user.image || null
  );
  const router = useRouter();

  const form = useProfileForm({
    defaultValues: {
      name: user.name,
      address: user.address,
      phone: user.phone,
      status: user.status,
      timeZone: user.timezone,
      times: user.times,
    },
  });

  // Sincronizar selectedHours com o form quando mudar
  useEffect(() => {
    form.setValue("times", selectedHours);
  }, [selectedHours, form]);

  function generateTImeSlots(): string[] {
    const hours: string[] = [];
    for (let i = 8; i < 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, "0");
        const minute = (j * 30).toString().padStart(2, "0");

        hours.push(`${hour}:${minute}`);
      }
    }
    return hours;
  }

  const hours = generateTImeSlots();

  function handleSelectHour(hour: string) {
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort()
    );
  }

  const timeZones = Intl.supportedValuesOf("timeZone").filter(
    (zone) =>
      zone.startsWith("America/Sao_Paulo") ||
      zone.startsWith("America/Fortaleza") ||
      zone.startsWith("America/Recife") ||
      zone.startsWith("America/Bahia") ||
      zone.startsWith("America/Salvador") ||
      zone.startsWith("America/Manaus") ||
      zone.startsWith("America/Minas_Gerais")
  );

  async function onSubmit(values: ProfileFormData) {
    setIsSubmitting(true);
    try {
      const result = await updateProfile({
        ...values,
        times: selectedHours,
        image: profileImage || "",
      });

      if (result.success) {
        toast.success(result.message || "Perfil atualizado com sucesso!");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao atualizar perfil");
      }
    } catch (error) {
      toast.error("Erro ao atualizar perfil. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUpload
                currentImage={profileImage}
                onImageChange={(url) => setProfileImage(url)}
                disabled={isSubmitting}
              />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o nome do seu estabelecimento..."
                          autoComplete="organization"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Endereço completo
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o endereço completo..."
                          autoComplete="street-address"
                        />
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
                      <FormLabel className="font-semibold">Telefone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o telefone..."
                          autoComplete="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Status do estabelecimento
                      </FormLabel>

                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ? "active" : "inactive"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">
                              Ativo (Aberto)
                            </SelectItem>
                            <SelectItem value="inactive">
                              Inativo (Fechado)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label className="font-semibold">
                    Horario de funcionamento
                  </Label>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {selectedHours.length > 0
                        ? `${selectedHours.length} horário(s) selecionado(s)`
                        : "Clique para selecionar o horario de funcionamento"}
                      <ArrowRightCircleIcon className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Horario de funcionamento</DialogTitle>
                      <DialogDescription>
                        Selecione o horario de funcionamento
                      </DialogDescription>
                    </DialogHeader>
                    <section>
                      <p className="text-sm text-muted-foreground mb-4">
                        Clique nos horarios abaixo para marcar ou desmarcar:
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {hours.map((hour) => (
                          <Button
                            key={hour}
                            variant="outline"
                            className={cn(
                              "h-10",
                              selectedHours.includes(hour)
                                ? "border-2 border-emerald-500 text-primary"
                                : ""
                            )}
                            onClick={() => handleSelectHour(hour)}
                          >
                            {hour}
                            <CheckIcon className="w-5 h-5" />
                          </Button>
                        ))}
                      </div>
                    </section>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        setIsOpen(false);
                        form.setValue("times", selectedHours);
                      }}
                    >
                      Salvar horarios
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
              <FormField
                control={form.control}
                name="timeZone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Fuso horário
                    </FormLabel>

                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o fuso horário..." />
                        </SelectTrigger>
                        <SelectContent>
                          {timeZones.map((zone) => (
                            <SelectItem key={zone} value={zone}>
                              {zone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </section>
  );
}
