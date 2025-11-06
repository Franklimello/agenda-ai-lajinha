// Hook para verificar sessão do Firebase no cliente
"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

interface FirebaseSession {
  user: {
    id: string;
    email: string | null;
    name: string | null;
    image: string | null;
  } | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

export function useFirebaseSession(): FirebaseSession {
  const [session, setSession] = useState<FirebaseSession>({
    user: null,
    status: "loading",
  });
  const pathname = usePathname();

  const checkServerSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/check-session", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setSession({
            user: {
              id: data.user.id,
              email: data.user.email || null,
              name: data.user.name || null,
              image: data.user.image || null,
            },
            status: "authenticated",
          });
          return true;
        }
      }
      // Se não há sessão, definir como não autenticado
      setSession({ user: null, status: "unauthenticated" });
      return false;
    } catch (error) {
      console.error("Erro ao verificar sessão no servidor:", error);
      setSession({ user: null, status: "unauthenticated" });
      return false;
    }
  }, []);

  useEffect(() => {
    // Verificar sessão no servidor sempre que a rota mudar
    checkServerSession();

    // Se Firebase Auth estiver disponível, ouvir mudanças
    if (typeof window !== "undefined" && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Verificar se o token está válido no servidor
          try {
            const token = await firebaseUser.getIdToken();
            const response = await fetch("/api/auth/firebase", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token }),
            });

            if (response.ok) {
              const data = await response.json();
              setSession({
                user: {
                  id: data.user.id,
                  email: data.user.email,
                  name: data.user.name,
                  image: data.user.image,
                },
                status: "authenticated",
              });
            } else {
              // Se falhar, verificar novamente no servidor
              await checkServerSession();
            }
          } catch (error) {
            console.error("Erro ao verificar sessão:", error);
            await checkServerSession();
          }
        } else {
          // Se não há usuário no Firebase, verificar servidor
          await checkServerSession();
        }
      });

      return () => unsubscribe();
    } else {
      // Se não há Firebase Auth, apenas verificar servidor
      checkServerSession();
    }
  }, [pathname, checkServerSession]);

  return session;
}

