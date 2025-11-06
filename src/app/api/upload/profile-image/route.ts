import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";
import { adminBucket } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // Verificar se o adminBucket está disponível
    if (!adminBucket) {
      console.error("Firebase Storage não está configurado. Verifique o firebase-service-account.json");
      return NextResponse.json(
        { error: "Serviço de armazenamento não configurado. Entre em contato com o suporte." },
        { status: 500 }
      );
    }

    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo inválido. Use JPG, PNG ou WEBP." },
        { status: 400 }
      );
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 5MB." },
        { status: 400 }
      );
    }

    // Converter File para Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const fileName = `profiles/${session.user.id}-${timestamp}.${extension}`;

    // Criar referência do arquivo no Firebase Storage
    const fileRef = adminBucket.file(fileName);

    // Fazer upload do arquivo
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          uploadedBy: session.user.id,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // Tornar o arquivo público (opcional, você pode configurar regras de segurança)
    await fileRef.makePublic();

    // Obter URL pública do arquivo
    // Formato: https://storage.googleapis.com/BUCKET_NAME/FILE_NAME
    const bucketName = adminBucket.name;
    const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    
    // Alternativa usando publicUrl() se disponível
    // const imageUrl = fileRef.publicUrl();

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Detalhes do erro:", errorMessage);
    return NextResponse.json(
      { error: `Erro ao fazer upload da imagem: ${errorMessage}. Verifique o console do servidor para mais detalhes.` },
      { status: 500 }
    );
  }
}
