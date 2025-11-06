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
import { createReminder, updateReminder } from "../../_actions/reminder-actions";
import { toast } from "sonner";
import { useState } from "react";

const reminderSchema = z.object({
  description: z.string().min(1, { message: "A descrição é obrigatória" }),
});

type ReminderFormData = z.infer<typeof reminderSchema>;

interface ReminderFormProps {
  reminder?: {
    id: string;
    description: string;
  };
  onSuccess?: () => void;
}

export function ReminderForm({ reminder, onSuccess }: ReminderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      description: reminder?.description || "",
    },
  });

  async function onSubmit(values: ReminderFormData) {
    setIsSubmitting(true);
    try {
      const result = reminder
        ? await updateReminder({ ...values, id: reminder.id })
        : await createReminder(values);

      if (result.success) {
        toast.success(result.message);
        form.reset();
        onSuccess?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao salvar lembrete. Tente novamente.");
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Lembrete</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o lembrete..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Salvando..."
            : reminder
            ? "Atualizar Lembrete"
            : "Criar Lembrete"}
        </Button>
      </form>
    </Form>
  );
}

