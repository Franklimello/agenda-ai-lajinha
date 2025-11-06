import { NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";

export async function GET() {
  try {
    const session = await getSession();
    
    if (session?.user) {
      return NextResponse.json({
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        },
      });
    }
    
    return NextResponse.json({ user: null }, { status: 401 });
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

