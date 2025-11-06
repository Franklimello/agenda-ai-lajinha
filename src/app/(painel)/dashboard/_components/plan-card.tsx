"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PlanCardProps {
  subscription: {
    id: string;
    status: string;
    plan: "BASIC" | "PROFESSIONAL";
    priceId: string;
  } | null;
}

export function PlanCard({ subscription }: PlanCardProps) {
  const planName = subscription?.plan === "BASIC" ? "Básico" : subscription?.plan === "PROFESSIONAL" ? "Profissional" : null;
  const planStatus = subscription?.status || null;
  const hasActivePlan = subscription && subscription.status.toLowerCase() === "active";
  
  return (
    <Card className={`bg-gradient-to-r border-2 ${hasActivePlan ? 'from-emerald-50 to-blue-50 border-emerald-200' : 'from-amber-50 to-orange-50 border-amber-300'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasActivePlan ? (
              <Crown className="w-6 h-6 text-emerald-600" />
            ) : (
              <Sparkles className="w-6 h-6 text-amber-600" />
            )}
            <div>
              <h3 className="font-semibold text-lg">Seu Plano Atual</h3>
              <p className="text-sm text-muted-foreground">
                {hasActivePlan 
                  ? `Plano ${planName} - Status: ${planStatus}`
                  : subscription
                  ? `Plano ${planName} - Status: ${planStatus}. Assine um plano ativo para ter acesso às funcionalidades.`
                  : "Você não possui um plano ativo. Assine um plano para ter acesso às funcionalidades."
                }
              </p>
            </div>
          </div>
          <Button asChild variant={hasActivePlan ? "outline" : "default"} size="sm" className={!hasActivePlan ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
            <Link href="/dashboard/plans">
              {hasActivePlan ? "Gerenciar Plano" : "Assinar Plano Agora"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

