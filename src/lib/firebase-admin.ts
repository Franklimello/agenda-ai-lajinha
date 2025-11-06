import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { join } from "path";
import { existsSync } from "fs";

// Verificar se já está inicializado
if (getApps().length === 0) {
  let serviceAccount;
  
  // Opção 1: Usar variável de ambiente (recomendado para produção)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      let cleanJson = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
      
      // Se o JSON está como string JSON (começa com "{")
      if (cleanJson.startsWith('{')) {
        // Tentar parse direto primeiro
        try {
          serviceAccount = JSON.parse(cleanJson);
        } catch (e) {
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
      console.error("❌ Erro ao fazer parse do FIREBASE_SERVICE_ACCOUNT:", error);
      serviceAccount = null;
    }
  }
  // Opção 2: Usar arquivo local (desenvolvimento)
  else {
    const credPath = join(process.cwd(), "firebase-service-account.json");
    if (existsSync(credPath)) {
      serviceAccount = require(credPath);
    } else {
      throw new Error(
        "Firebase não configurado. Configure FIREBASE_SERVICE_ACCOUNT ou adicione firebase-service-account.json"
      );
    }
  }

  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  
  if (!storageBucket) {
    throw new Error(
      "FIREBASE_STORAGE_BUCKET não configurado. Configure a variável de ambiente."
    );
  }

  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: storageBucket,
  });
}

export const storage = getStorage();
export const bucket = storage.bucket();

