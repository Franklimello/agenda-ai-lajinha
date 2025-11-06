// Firebase Auth Session Helper (Server-side)
import { cookies } from "next/headers";
import { getSessionFromToken, adminDb } from "./firebase-auth";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebase-token")?.value;
    
    if (!token) {
      return null;
    }

    const session = await getSessionFromToken(token);
    
    // Se o token expirou, não deslogar imediatamente
    // O cliente vai renovar automaticamente via hook
    if (!session) {
      // Verificar se há um userId no cookie como fallback
      const userId = cookieStore.get("firebase-user-id")?.value;
      if (userId && adminDb) {
        try {
          const userDoc = await adminDb.collection("users").doc(userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            return {
              user: {
                id: userId,
                email: userData.email || "",
                name: userData.name || null,
                image: userData.image || null,
              },
            };
          }
        } catch {
          // Ignorar erro
        }
      }
    }
    
    return session;
  } catch (error) {
    console.error("Erro ao obter sessão:", error);
    return null;
  }
}

