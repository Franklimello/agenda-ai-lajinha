"use client";

import { useFirebaseTokenRefresh } from "@/lib/firebase-token-refresh";

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  // Hook só executa no cliente devido à verificação interna
  useFirebaseTokenRefresh();
  
  return <>{children}</>;
}

