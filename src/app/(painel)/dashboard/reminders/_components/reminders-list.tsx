"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReminderForm } from "./reminder-form";
import { deleteReminder } from "../../_actions/reminder-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Reminder {
  id: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RemindersListProps {
  reminders: Reminder[];
}

export function RemindersList({ reminders }: RemindersListProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  async function handleDelete(reminderId: string) {
    if (!confirm("Tem certeza que deseja deletar este lembrete?")) {
      return;
    }

    const result = await deleteReminder(reminderId);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lembretes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus lembretes importantes
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Lembrete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Lembrete</DialogTitle>
              <DialogDescription>
                Adicione um lembrete importante
              </DialogDescription>
            </DialogHeader>
            <ReminderForm
              onSuccess={() => {
                setIsCreateOpen(false);
                router.refresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {reminders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhum lembrete cadastrado ainda.
            </p>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Criar primeiro lembrete</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Lembrete</DialogTitle>
                  <DialogDescription>
                    Adicione um lembrete importante
                  </DialogDescription>
                </DialogHeader>
                <ReminderForm
                  onSuccess={() => {
                    setIsCreateOpen(false);
                    router.refresh();
                  }}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-2">
                      {reminder.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Criado em{" "}
                      {format(new Date(reminder.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={editingReminder?.id === reminder.id}
                      onOpenChange={(open) => !open && setEditingReminder(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingReminder(reminder)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Lembrete</DialogTitle>
                          <DialogDescription>
                            Atualize as informações do lembrete
                          </DialogDescription>
                        </DialogHeader>
                        <ReminderForm
                          reminder={reminder}
                          onSuccess={() => {
                            setEditingReminder(null);
                            router.refresh();
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(reminder.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

