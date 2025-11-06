// Firebase Auth Helper (Server-side)
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { join } from "path";
import { existsSync, readFileSync } from "fs";

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  console.log("🔧 Iniciando inicialização do Firebase Admin...");
  let serviceAccount;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log("✅ FIREBASE_SERVICE_ACCOUNT encontrado na variável de ambiente");
    try {
      let cleanJson = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
      console.log("📝 Primeiros 50 caracteres do JSON:", cleanJson.substring(0, 50));
      
      // Se o JSON está como string JSON (começa com "{")
      if (cleanJson.startsWith('{')) {
        console.log("✅ JSON começa com '{', tentando parse direto...");
        // Tentar parse direto primeiro
        try {
          serviceAccount = JSON.parse(cleanJson);
          console.log("✅ Parse do JSON bem-sucedido!");
        } catch (e) {
          console.error("❌ Erro no parse direto, tentando corrigir espaços...", e);
          // Se falhar, pode estar com escapes incorretos na private_key
          // A private_key já deve ter \n como caracteres reais, não como string "\\n"
          // Tentar parse novamente (pode estar tudo certo mas com algum espaço extra)
          cleanJson = cleanJson.replace(/\s+/g, ' ').trim();
          serviceAccount = JSON.parse(cleanJson);
        }
      } else {
        // Se não começa com "{", pode estar duplamente escapado
        // Tentar fazer unescape primeiro
        try {
          cleanJson = JSON.parse(`"${cleanJson}"`); // Unescape da string
          serviceAccount = JSON.parse(cleanJson);
        } catch (e) {
          console.error("❌ Erro ao fazer parse do FIREBASE_SERVICE_ACCOUNT:", e);
          serviceAccount = null;
        }
      }
    } catch (error) {
      console.error("❌ Erro ao fazer parse do FIREBASE_SERVICE_ACCOUNT:", error instanceof Error ? error.message : String(error));
      console.error("Tentando usar arquivo local...");
      serviceAccount = null; // Continuar para tentar arquivo local
    }
  }
  
  if (!serviceAccount) {
    const credPath = join(process.cwd(), "firebase-service-account.json");
    if (existsSync(credPath)) {
      try {
        const fileContent = readFileSync(credPath, "utf-8");
        serviceAccount = JSON.parse(fileContent);
      } catch (error) {
        console.error("❌ Erro ao fazer parse do firebase-service-account.json:", error);
        serviceAccount = null;
      }
    } else {
      // Modo temporário: usar credenciais do projeto atual
      // Você precisa substituir isso pelo arquivo real do Service Account
      console.warn("⚠️  Usando configuração temporária do Firebase. Adicione firebase-service-account.json para usar o Firebase Admin.");
      
      // Usar projectId para inicializar (sem autenticação completa)
      // Isso vai funcionar parcialmente, mas algumas operações podem falhar
      serviceAccount = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "agendaailajinha",
        // Nota: Isso não vai funcionar para operações que precisam de autenticação
        // Você PRECISA adicionar o arquivo real do Service Account
      };
    }
  }

  // Só inicializar se tiver serviceAccount válido
  if (serviceAccount && serviceAccount.private_key) {
    console.log("✅ serviceAccount válido encontrado, inicializando Firebase Admin...");
    console.log("📦 Project ID:", serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    console.log("📦 Storage Bucket:", process.env.FIREBASE_STORAGE_BUCKET || "agendaailajinha.firebasestorage.app");
    try {
      initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "agendaailajinha",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "agendaailajinha.firebasestorage.app",
      });
      console.log("✅ Firebase Admin inicializado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao inicializar Firebase Admin:", error);
      console.error("❌ Detalhes do erro:", error instanceof Error ? error.message : String(error));
    }
  } else {
    // Não inicializar - adminDb, adminAuth serão null
    console.error("❌ serviceAccount inválido ou sem private_key");
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.error("❌ FIREBASE_SERVICE_ACCOUNT configurado mas não foi possível fazer parse. Verifique o formato do JSON.");
      console.error("❌ Primeiros 100 caracteres:", process.env.FIREBASE_SERVICE_ACCOUNT.substring(0, 100));
      console.error("❌ serviceAccount:", serviceAccount ? "existe mas sem private_key" : "null");
    } else {
      console.warn("⚠️  FIREBASE_SERVICE_ACCOUNT não configurado. Firebase Admin não será inicializado.");
    }
  }
} else {
  console.log("ℹ️  Firebase Admin já inicializado (getApps().length > 0)");
}

// Exportar apenas se Firebase estiver corretamente configurado
let adminAuth: any = null;
let adminDb: any = null;
let adminStorage: any = null;
let adminBucket: any = null;

try {
  const apps = getApps();
  console.log("🔍 Verificando apps do Firebase Admin. Total de apps:", apps.length);
  if (apps.length > 0) {
    console.log("✅ Apps encontrados, inicializando adminAuth, adminDb, adminStorage...");
    adminAuth = getAuth();
    adminDb = getFirestore();
    adminStorage = getStorage();
    
    // Obter o bucket do storage
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || "agendaailajinha.firebasestorage.app";
    adminBucket = adminStorage.bucket(storageBucket);
    console.log("✅ Firebase Admin exports inicializados com sucesso!");
    console.log("📦 adminAuth:", adminAuth ? "✅" : "❌");
    console.log("📦 adminDb:", adminDb ? "✅" : "❌");
  } else {
    console.error("❌ Firebase Admin não inicializado. Nenhum app encontrado (apps.length = 0)");
  }
} catch (error) {
  console.error("❌ Erro ao inicializar exports do Firebase Admin:", error);
  console.error("❌ Detalhes:", error instanceof Error ? error.message : String(error));
}

export { adminAuth, adminDb, adminStorage, adminBucket };

// Get user session from token
export async function getSessionFromToken(token: string, checkRevoked: boolean = false) {
  try {
    if (!adminAuth) {
      console.error("❌ Firebase Admin não está configurado. Verifique FIREBASE_SERVICE_ACCOUNT.");
      return null;
    }
    
    const decodedToken = await adminAuth.verifyIdToken(token, checkRevoked);
    
    // Buscar dados do usuário no Firestore (não usar dados do token do Google)
    const userData = await getUserFromFirestore(decodedToken.uid);
    
    return {
      user: {
        id: decodedToken.uid,
        email: decodedToken.email || "",
        // Usar dados do Firestore (preenchidos pelo profissional), não do Google
        name: userData?.name || null,
        image: userData?.image || null,
      },
    };
  } catch (error: any) {
    // Se o token expirou, tentar buscar dados do usuário no Firestore usando o UID do cookie
    if (error.code === 'auth/id-token-expired') {
      console.warn("⚠️  Token expirado. O cliente deve renovar o token automaticamente.");
      // Retornar null para forçar o cliente a renovar
      // O hook de renovação automática vai cuidar disso
      return null;
    }
    console.error("❌ Erro ao verificar token:", {
      code: error?.code,
      message: error?.message,
    });
    return null;
  }
}

// Get user data from Firestore
export async function getUserFromFirestore(userId: string) {
  try {
    if (!adminDb) {
      console.error("Firebase Admin não está configurado. Adicione firebase-service-account.json");
      return null;
    }
    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (userDoc.exists) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}

// Create or update user in Firestore
export async function createOrUpdateUser(userId: string, userData: any) {
  try {
    if (!adminDb) {
      console.error("❌ Firebase Admin não está configurado. Adicione firebase-service-account.json");
      throw new Error("Firebase Admin não está configurado");
    }
    
    // Verificar se o usuário já existe
    const existingUser = await adminDb.collection("users").doc(userId).get();
    
    // Preparar dados para atualização
    // IMPORTANTE: Não sobrescrever campos que o profissional já preencheu (name, phone, address, times, image, etc)
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    // Se é um novo usuário, criar apenas com dados essenciais
    if (!existingUser.exists) {
      updateData.status = true;
      updateData.createdAt = userData.createdAt || new Date();
      updateData.email = userData.email || null; // Apenas email para identificação
      updateData.emailVerified = userData.emailVerified || false;
      // NÃO salvar name, image, phone, address, times - profissional deve preencher manualmente
    } else {
      // Se o usuário existe, apenas atualizar email se necessário (não sobrescrever outros campos)
      const currentData = existingUser.data();
      
      // Manter status atual ou definir como true se não existir
      if (currentData?.status === undefined || currentData?.status === null) {
        updateData.status = true;
      }
      
      // Atualizar apenas email se não existir (não sobrescrever se já tiver)
      if (!currentData?.email && userData.email) {
        updateData.email = userData.email;
      }
      
      // Não sobrescrever createdAt se já existir
      if (currentData?.createdAt) {
        // Não fazer nada
      }
      
      // NÃO atualizar name, phone, address, times, image - esses campos devem ser preenchidos pelo profissional
      // e não devem ser sobrescritos pelos dados do Google
    }
    
    await adminDb.collection("users").doc(userId).set(
      updateData,
      { merge: true }
    );
    console.log("✅ Usuário criado/atualizado no Firestore com sucesso");
    return true;
  } catch (error: any) {
    console.error("❌ Erro ao criar/atualizar usuário no Firestore:", error);
    console.error("❌ Detalhes do erro:", {
      code: error?.code,
      message: error?.message,
      details: error?.details,
    });
    
    // Se for erro de autenticação, lançar erro específico
    if (error?.code === 16 || error?.message?.includes("UNAUTHENTICATED")) {
      throw new Error("Firestore não autenticado. Verifique as permissões do Service Account no Google Cloud IAM.");
    }
    
    throw error;
  }
}

