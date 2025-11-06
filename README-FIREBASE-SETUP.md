# Configuração do Firebase - Projeto agendaailajinha

## ✅ Serviços Ativados

Você já ativou:
- ✅ **Authentication** - Para login
- ✅ **Firestore Database** - Para banco de dados
- ✅ **Storage** - Para armazenar imagens
- ✅ **Functions** - Para funções serverless

## 📋 Próximos Passos

### 1. Obter Service Account (para Firebase Admin)

Para o upload de imagens funcionar, você precisa das credenciais do Service Account:

1. No Firebase Console, vá em **Configurações do Projeto** (ícone de engrenagem)
2. Vá na aba **Contas de serviço**
3. Clique em **Gerar nova chave privada**
4. Baixe o arquivo JSON
5. Renomeie para `firebase-service-account.json` e coloque na raiz do projeto

**OU** configure como variável de ambiente:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"agendaailajinha",...}
```

### 2. Configurar Storage Rules

No Firebase Console → **Storage** → **Regras**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profiles/{fileName} {
      // Permitir leitura pública
      allow read: if true;
      // Permitir escrita apenas para usuários autenticados
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Configurar Firestore Rules (se for usar)

No Firebase Console → **Firestore Database** → **Regras**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Configurar Authentication (se for usar Firebase Auth)

No Firebase Console → **Authentication** → **Sign-in method**:
- Ative **Google** como provedor
- Configure as URLs autorizadas

## 📁 Estrutura de Arquivos

- `src/lib/firebase.ts` - Cliente Firebase (frontend)
- `src/lib/firebase-admin.ts` - Admin SDK (backend)
- `.env.local` - Variáveis de ambiente (já configurado)

## 🔧 Arquivos Já Configurados

- ✅ Firebase Client SDK configurado
- ✅ Firebase Admin SDK configurado
- ✅ Upload de imagens de perfil configurado para usar Storage
- ✅ Variáveis de ambiente atualizadas

## 🚀 Testar

1. Adicione o `firebase-service-account.json` na raiz do projeto
2. Reinicie o servidor: `npm run dev`
3. Teste o upload de foto de perfil em `/dashboard/profile`

