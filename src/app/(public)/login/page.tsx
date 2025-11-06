"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FirebaseLogin } from "./_components/firebase-login";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
          <CardDescription>
            Faça login com sua conta Google para acessar o painel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FirebaseLogin />
        </CardContent>
      </Card>
    </div>
  );
}

