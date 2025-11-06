import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionFromToken, createOrUpdateUser } from "@/lib/firebase-auth";
import { adminAuth } from "@/lib/firebase-auth";

export async function POST(request: NextRequest) {
  try {
    console.log("🔵 Iniciando autenticação Firebase...");
    const { token } = await request.json();

    if (!token) {
      console.error("❌ Token não fornecido");
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 400 }
      );
    }

    console.log("✅ Token recebido, verificando Firebase Admin...");

    // Verificar se Firebase Admin está inicializado
    if (!adminAuth) {
      console.error("❌ Firebase Admin não está inicializado. Verifique FIREBASE_SERVICE_ACCOUNT.");
      return NextResponse.json(
        { error: "Servidor não configurado corretamente. Firebase Admin não inicializado." },
        { status: 500 }
      );
    }

    console.log("✅ Firebase Admin está inicializado, verificando token...");

    // Verificar token
    const session = await getSessionFromToken(token);
    
    if (!session) {
      console.error("❌ Token inválido ou expirado");
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 }
      );
    }

    console.log("✅ Token válido, obtendo dados do usuário...");

    // Obter dados adicionais do usuário (apenas para email)
    const firebaseUser = await adminAuth.getUser(session.user.id);
    console.log("✅ Dados do usuário obtidos:", { email: firebaseUser.email, uid: firebaseUser.uid });
    
    // TEMPORARIAMENTE DESABILITADO: Criar usuário no Firestore
    // Vamos fazer o login funcionar primeiro, depois resolvemos o Firestore
    // Isso evita que erros do Firestore bloqueiem o login
    console.log("⚠️  Pulando criação de usuário no Firestore (temporário)");
    
    // TODO: Reativar quando as permissões do Firestore estiverem funcionando
    /*
    try {
      await createOrUpdateUser(session.user.id, {
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified,
        createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date(),
      });
      console.log("✅ Usuário criado/atualizado no Firestore com sucesso");
    } catch (firestoreError: any) {
      console.error("⚠️  Erro ao criar/atualizar usuário no Firestore:", firestoreError);
    }
    */

    console.log("🔵 Salvando cookies...");
    // Salvar token no cookie
    const cookieStore = await cookies();
    cookieStore.set("firebase-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });
    
    // Salvar também o userId para fallback caso token expire
    cookieStore.set("firebase-user-id", session.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    console.log("✅ Login concluído com sucesso!");
    return NextResponse.json({
      success: true,
      user: session.user,
    });
  } catch (error: any) {
    console.error("❌ ERRO CRÍTICO ao autenticar:", error);
    console.error("❌ Tipo do erro:", typeof error);
    console.error("❌ Detalhes completos do erro:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: error?.stack,
      details: error?.details,
      cause: error?.cause,
    });
    
    // Log adicional para erros específicos
    if (error?.code === 16 || error?.message?.includes("UNAUTHENTICATED")) {
      console.error("❌ ERRO DE AUTENTICAÇÃO DO FIRESTORE - Verifique as permissões do Service Account");
    }
    
    return NextResponse.json(
      { 
        error: "Erro ao autenticar",
        details: process.env.NODE_ENV === "development" ? error?.message : "Verifique os logs do servidor",
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("firebase-token");
    cookieStore.delete("firebase-user-id");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return NextResponse.json(
      { error: "Erro ao fazer logout" },
      { status: 500 }
    );
  }
}

