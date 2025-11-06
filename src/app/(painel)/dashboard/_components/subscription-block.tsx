"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import Link from "next/link";

interface SubscriptionBlockProps {
  title?: string;
  message?: string;
}

export function SubscriptionBlock({ 
  title = "Plano Necessário",
  message = "Você precisa ter um plano ativo para acessar esta funcionalidade."
}: SubscriptionBlockProps) {
  return (
    <Card className="border-2 border-amber-200 bg-amber-50/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Lock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          {message}
        </p>
        <div className="flex items-center gap-3">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/dashboard/plans">
              <Crown className="w-4 h-4 mr-2" />
              Assinar Plano Agora
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Voltar ao Dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

