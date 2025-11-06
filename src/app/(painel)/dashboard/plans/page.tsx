import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getUserSubscription } from "./_data-access/get-plans";
import { PlansContent } from "./_components/plans-content";
import { checkOnboardingStatus } from "../_utils/check-onboarding";

export default async function Plans() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const subscription = await getUserSubscription();
  
  // Se já tem plano ativo, verificar se precisa completar perfil
  const onboardingStatus = await checkOnboardingStatus();
  
  if (onboardingStatus?.hasActivePlan && !onboardingStatus.hasCompleteProfile) {
    // Tem plano mas não tem perfil completo, redirecionar para perfil
    redirect("/dashboard/profile");
  }

  return <PlansContent subscription={subscription} />;
}
