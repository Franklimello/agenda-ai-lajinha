// Get Session - SIMPLIFICADO
import { cookies } from "next/headers";
import { verifyIdToken, getUserFromFirestore, adminDb } from "./firebase-admin";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebase-token")?.value;
    
    if (!token) {
      return null;
    }

    try {
      const decodedToken = await verifyIdToken(token);
      const user = await getUserFromFirestore(decodedToken.uid);
      
      if (user) {
        return {
          user: {
            id: user.id,
            email: user.email || "",
            name: user.name || null,
            image: user.image || null,
          },
        };
      }

      // Se não existe no Firestore, criar com dados do token
      if (adminDb) {
        await adminDb.collection("users").doc(decodedToken.uid).set({
          email: decodedToken.email || null,
          emailVerified: decodedToken.email_verified || false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, { merge: true });
      }

      return {
        user: {
          id: decodedToken.uid,
          email: decodedToken.email || "",
          name: decodedToken.name || null,
          image: decodedToken.picture || null,
        },
      };
    } catch (error) {
      // Token inválido ou expirado
      const userId = cookieStore.get("firebase-user-id")?.value;
      if (userId) {
        const user = await getUserFromFirestore(userId);
        if (user) {
          return {
            user: {
              id: user.id,
              email: user.email || "",
              name: user.name || null,
              image: user.image || null,
            },
          };
        }
      }
      return null;
    }
  } catch (error) {
    console.error("Erro ao obter sessão:", error);
    return null;
  }
}

