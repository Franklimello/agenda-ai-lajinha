# 🚀 Guia de Deploy para Firebase

## 📋 Pré-requisitos

1. ✅ Firebase CLI instalado: `npm install -g firebase-tools`
2. ✅ Login no Firebase: `firebase login`
3. ✅ Projeto Firebase criado: `agendaailajinha`

## 🔧 Configuração

### 1. Verificar se está logado:
```bash
firebase login
```

### 2. Verificar projeto:
```bash
firebase projects:list
```

### 3. Selecionar projeto (se necessário):
```bash
firebase use agendaailajinha
```

## 📝 Variáveis de Ambiente

### No Firebase Console:
1. Acesse: https://console.firebase.google.com/project/agendaailajinha/settings/general
2. Vá em **Configurações do Projeto** > **Variáveis de ambiente**
3. Adicione todas as variáveis do `.env.local`:

**Firebase:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_SERVICE_ACCOUNT` (JSON completo ou path)

**Stripe:**
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_ID_PROFESSIONAL`
- `STRIPE_WEBHOOK_SECRET`

**App:**
- `NEXT_PUBLIC_APP_URL` (URL do Firebase Hosting)

### OU usar .env na raiz (para Cloud Functions):
O Firebase Functions automaticamente lê variáveis de `.env.local` ou `.env`, mas é melhor configurar no Console.

## 🏗️ Build e Deploy

### Opção 1: Deploy Completo (Hosting + Functions)

```bash
# Build do Next.js
npm run build

# Deploy
firebase deploy
```

### Opção 2: Deploy Apenas Hosting

```bash
npm run build
firebase deploy --only hosting
```

### Opção 3: Deploy Apenas Functions

```bash
firebase deploy --only functions
```

## 🔗 URLs após Deploy

Após o deploy, você receberá:
- **Hosting URL**: `https://agendaailajinha.web.app`
- **Custom Domain** (se configurado)

## ⚙️ Configurar Webhook do Stripe

Após o deploy, atualize a URL do webhook no Stripe:

1. Acesse: https://dashboard.stripe.com/webhooks
2. Edite o endpoint existente ou crie novo
3. URL: `https://agendaailajinha.web.app/api/stripe/webhook`
4. Copie o novo `STRIPE_WEBHOOK_SECRET` se necessário

## 📝 Atualizar NEXT_PUBLIC_APP_URL

Após descobrir a URL do deploy, atualize no Firebase Console:

```
NEXT_PUBLIC_APP_URL=https://agendaailajinha.web.app
```

## 🔄 Deploy Contínuo (Opcional)

Para automatizar, configure GitHub Actions ou use Firebase CI/CD.

## ⚠️ Importante

1. **Firebase Service Account**: O arquivo `firebase-service-account.json` deve estar no servidor ou configurado via variável de ambiente
2. **Build**: O Next.js será buildado em modo `standalone` para otimização
3. **Variáveis**: Todas as variáveis sensíveis devem estar no Firebase Console, não no código

## 🐛 Troubleshooting

### Erro: "Functions directory not found"
- Verifique se o `firebase.json` está correto
- Para Next.js standalone, pode ser necessário ajustar a configuração

### Erro: "Environment variables not found"
- Configure todas as variáveis no Firebase Console
- Verifique se estão marcadas como "Secret" quando necessário

### Build falha
- Verifique se todas as dependências estão instaladas
- Limpe o cache: `rm -rf .next` e `npm run build` novamente

