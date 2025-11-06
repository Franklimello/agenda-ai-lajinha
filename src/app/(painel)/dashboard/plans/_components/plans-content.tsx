"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PlansContentProps {
  subscription: {
    id: string;
    status: string;
    plan: "BASIC" | "PROFESSIONAL";
    priceId: string;
  } | null;
}

export function PlansContent({ subscription }: PlansContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async (plan: "BASIC" | "PROFESSIONAL") => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar sessão de pagamento");
      }

      if (data.url) {
        // Redirecionar para o checkout do Stripe
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não retornada");
      }
    } catch (error: any) {
      console.error("Erro ao assinar plano:", error);
      toast.error(error.message || "Erro ao processar pagamento. Tente novamente.");
      setIsLoading(false);
    }
  };

  const plans = [
    {
      name: "Profissional",
      plan: "PROFESSIONAL" as const,
      price: "R$ 99,90",
      period: "mês",
      features: [
        "Agendamentos ilimitados",
        "Gestão completa de serviços",
        "Lembretes avançados",
        "Relatórios detalhados",
        "Suporte prioritário",
        "API de integração",
      ],
      icon: Crown,
      popular: true,
    },
  ];

  const currentPlan = subscription?.plan;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Plano Profissional</h1>
        <p className="text-muted-foreground mt-1">
          {subscription && subscription.status.toLowerCase() === "active"
            ? "Gerencie sua assinatura e tenha acesso a todas as funcionalidades"
            : "Assine o plano profissional para ter acesso a todas as funcionalidades. É necessário ter um plano ativo para usar o sistema."
          }
        </p>
      </div>

      {subscription ? (
        <Card className={`${subscription.status.toLowerCase() === "active" ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Plano Atual</h3>
                <p className="text-muted-foreground">
                  Você está no plano{" "}
                  <span className="font-semibold">
                    {subscription.plan === "BASIC" ? "Básico" : "Profissional"}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Status: <span className={`font-medium capitalize ${subscription.status.toLowerCase() === "active" ? "text-emerald-600" : "text-amber-600"}`}>
                    {subscription.status}
                  </span>
                  {subscription.status.toLowerCase() !== "active" && (
                    <span className="text-amber-600 ml-2">• Plano inativo. Assine um plano ativo para usar as funcionalidades.</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Nenhum Plano Ativo</h3>
                <p className="text-muted-foreground">
                  Você precisa assinar um plano para ter acesso às funcionalidades do sistema. Assine o plano profissional abaixo para começar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-1 max-w-2xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentPlan === plan.plan;

          return (
            <Card
              key={plan.plan}
              className={`relative ${
                plan.popular ? "border-emerald-500 border-2" : ""
              } ${isCurrentPlan ? "bg-emerald-50" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Mais Popular
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">
                        /{plan.period}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                  disabled={isCurrentPlan || isLoading}
                  onClick={() => !isCurrentPlan && handleSubscribe(plan.plan)}
                >
                  {isLoading
                    ? "Processando..."
                    : isCurrentPlan
                    ? "Plano Atual"
                    : subscription
                    ? "Alterar Plano"
                    : "Assinar Agora"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}

