
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getServices } from "./_actions/service-actions";
import { ServicesList } from "./_components/services-list";
import { getUserSubscription } from "../plans/_data-access/get-plans";
import { SubscriptionBlock } from "../_components/subscription-block";

export const dynamic = 'force-dynamic';

export default async function Service() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  // Verificar se tem subscription ativa
  const subscription = await getUserSubscription();
  const hasActivePlan = subscription && subscription.status.toLowerCase() === "active";

  if (!hasActivePlan) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Serviços</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus serviços</p>
        </div>
        <SubscriptionBlock 
          title="Plano Necessário para Criar Serviços"
          message="Você precisa ter um plano ativo para criar e gerenciar serviços. Assine um plano para começar a usar esta funcionalidade."
        />
      </div>
    );
  }

  const result = await getServices();

  if (!result.success) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Serviços</h1>
        <p className="text-red-500">{result.error}</p>
      </div>
    );
  }

  return <ServicesList services={result.data} />;
}