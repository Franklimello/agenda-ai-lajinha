import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.string(),
  timeZone: z.string().min(1, { message: "O fuso horário é obrigatório" }),
  times: z.array(z.string()),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

interface UseProfileFormProps {
  defaultValues?: {
    name?: string | null;
    address?: string | null;
    phone?: string | null;
    status?: boolean | null;
    timeZone?: string | null;
    times?: string[];
  };
}

export function useProfileForm({ defaultValues }: UseProfileFormProps = {}) {
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      address: defaultValues?.address || "",
      phone: defaultValues?.phone || "",
      status: defaultValues?.status !== false ? "active" : "inactive",
      timeZone: defaultValues?.timeZone || "",
      times: defaultValues?.times ?? [],
    },
  });
}
