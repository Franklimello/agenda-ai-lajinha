"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleLogout() {
  try {
    // Deletar cookies do Firebase
    const cookieStore = await cookies();
    cookieStore.delete("firebase-token");
    cookieStore.delete("firebase-user-id");
    
    // Também deletar cookies do NextAuth (se existirem)
    cookieStore.delete("next-auth.session-token");
    cookieStore.delete("__Secure-next-auth.session-token");
    
    // Redirecionar para home
    redirect("/");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    redirect("/");
  }
}

