import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getDashboardStats } from "./_data-access/get-dashboard-stats";
import { DashboardStats } from "./_components/dashboard-stats";
import { AppointmentsList } from "./_components/appointments-list";
import { getAppointments } from "./_actions/appointment-actions";
import { getServices } from "./service/_actions/service-actions";
import { getUserSubscription } from "./plans/_data-access/get-plans";
import { PlanCard } from "./_components/plan-card";
import { checkOnboardingStatus } from "./_utils/check-onboarding";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  // Verificar status de onboarding e redirecionar se necessário
  const onboardingStatus = await checkOnboardingStatus();

  if (onboardingStatus) {
    if (onboardingStatus.nextStep === "plan") {
      redirect("/dashboard/plans");
    } else if (onboardingStatus.nextStep === "profile") {
      redirect("/dashboard/profile");
    }
  }

  const [stats, appointmentsResult, servicesResult, subscription] =
    await Promise.all([
      getDashboardStats(),
      getAppointments(),
      getServices(),
      getUserSubscription(),
    ]);

  if (!stats) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-red-500">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  const appointments = appointmentsResult.success
    ? appointmentsResult.data
    : [];
  const services = servicesResult.success ? servicesResult.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agendamentos</h1>
        <p className="text-muted-foreground mt-1">Gerencie seus agendamentos</p>
      </div>

      {/* Card do Plano Atual */}
      <PlanCard subscription={subscription} />

      <DashboardStats
        servicesCount={stats.servicesCount}
        appointmentsCount={stats.appointmentsCount}
      />

      <AppointmentsList appointments={appointments} services={services} />
    </div>
  );
}
