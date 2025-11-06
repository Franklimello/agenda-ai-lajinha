import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionFromToken, createOrUpdateUser } from "@/lib/firebase-auth";
import { adminAuth } from "@/lib/firebase-auth";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 400 }
      );
    }

    // Verificar se Firebase Admin está inicializado
    if (!adminAuth) {
      console.error("❌ Firebase Admin não está inicializado. Verifique FIREBASE_SERVICE_ACCOUNT.");
      return NextResponse.json(
        { error: "Servidor não configurado corretamente. Firebase Admin não inicializado." },
        { status: 500 }
      );
    }

    // Verificar token
    const session = await getSessionFromToken(token);
    
    if (!session) {
      console.error("❌ Token inválido ou expirado");
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 }
      );
    }

    // Obter dados adicionais do usuário (apenas para email)
    const firebaseUser = await adminAuth.getUser(session.user.id);
    
    // Criar ou atualizar usuário no Firestore
    // NÃO salvar dados do Google (name, image) - profissional deve preencher manualmente
    await createOrUpdateUser(session.user.id, {
      email: firebaseUser.email, // Apenas email para identificação
      // name, image e outros campos devem ser preenchidos pelo profissional no perfil
      emailVerified: firebaseUser.emailVerified,
      createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date(),
    });

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

    return NextResponse.json({
      success: true,
      user: session.user,
    });
  } catch (error: any) {
    console.error("❌ Erro ao autenticar:", error);
    console.error("Detalhes do erro:", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    return NextResponse.json(
      { 
        error: "Erro ao autenticar",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined
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

