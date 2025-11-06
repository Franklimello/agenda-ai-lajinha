// Hook para renovar token do Firebase automaticamente
"use client";

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export function useFirebaseTokenRefresh() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Verificar se estamos no cliente e se auth está disponível
    if (!isClient || typeof window === "undefined" || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Limpar intervalo anterior se existir
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (user) {
        // Função para renovar token
        const refreshToken = async () => {
          try {
            const token = await user.getIdToken(true); // true força renovação
            await fetch("/api/auth/firebase", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token }),
            });
          } catch (error) {
            console.error("Erro ao renovar token:", error);
          }
        };

        // Renovar imediatamente
        refreshToken();

        // Renovar token a cada 50 minutos (antes de expirar em 1 hora)
        intervalRef.current = setInterval(refreshToken, 50 * 60 * 1000); // 50 minutos
      }
    });

    return () => {
      unsubscribe();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isClient]);
}

