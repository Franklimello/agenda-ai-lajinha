# 🚀 Deploy na Vercel - Guia Completo

## ✅ O que você pode usar:

### Firebase (Continua funcionando normalmente):
- ✅ **Firestore** - Banco de dados
- ✅ **Firebase Auth** - Autenticação
- ✅ **Firebase Storage** - Armazenamento de imagens
- ✅ **Firebase Functions** - Cloud Functions (se você usar)
- ✅ **Firebase Admin SDK** - Server-side

### Vercel (Hospedagem):
- ✅ **Next.js completo** - Com API Routes
- ✅ **Server Components** - Renderização no servidor
- ✅ **API Routes** - `/api/stripe/*`, `/api/auth/*`, etc.
- ✅ **Edge Functions** - Se necessário

## 🎯 Como funciona:

1. **Frontend + API Routes** → Rodam na Vercel
2. **Firebase Services** → Continuam no Firebase (Firestore, Auth, Storage)
3. **Comunicação** → Vercel se conecta ao Firebase normalmente

## 📋 Passo a Passo:

### 1. Instalar Vercel CLI:
```bash
npm install -g vercel
```

### 2. Login:
```bash
vercel login
```

### 3. Deploy inicial:
```bash
vercel
```
- Vai perguntar algumas coisas, responda:
  - Set up and deploy? **Y**
  - Which scope? **Seu email/empresa**
  - Link to existing project? **N** (primeira vez)
  - Project name? **agenda-ai-lajinha** (ou outro)
  - Directory? **./** (pressione Enter)
  - Override settings? **N**

### 4. Configurar Variáveis de Ambiente:

#### Via CLI (Recomendado):
```bash
# Firebase
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

# Firebase Admin (Service Account JSON)
vercel env add FIREBASE_SERVICE_ACCOUNT

# Stripe
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_PRICE_ID_PROFESSIONAL
vercel env add STRIPE_WEBHOOK_SECRET

# App URL (será preenchido após primeiro deploy)
vercel env add NEXT_PUBLIC_APP_URL
```

#### Via Dashboard (Alternativa):
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**
4. Adicione todas as variáveis

### 5. Deploy de Produção:
```bash
vercel --prod
```

### 6. Atualizar NEXT_PUBLIC_APP_URL:
Após o deploy, você receberá uma URL (ex: `https://agenda-ai-lajinha.vercel.app`)

```bash
vercel env add NEXT_PUBLIC_APP_URL production
# Cole a URL: https://agenda-ai-lajinha.vercel.app
```

Depois, faça deploy novamente:
```bash
vercel --prod
```

## 🔗 Configurar Webhook do Stripe:

Após descobrir a URL do Vercel:

1. Acesse: https://dashboard.stripe.com/webhooks
2. Edite ou crie endpoint:
   - URL: `https://agenda-ai-lajinha.vercel.app/api/stripe/webhook`
3. Copie o novo `STRIPE_WEBHOOK_SECRET` e adicione no Vercel

## 📝 Arquivo .env.local (Local):

Para desenvolvimento local, mantenha o `.env.local` com todas as variáveis.

## ✅ Vantagens:

1. ✅ **API Routes funcionam** - Stripe, Auth, Upload
2. ✅ **Firebase continua funcionando** - Firestore, Auth, Storage
3. ✅ **Deploy automático** - A cada push no Git (opcional)
4. ✅ **CDN global** - Site rápido no mundo todo
5. ✅ **Grátis** - Plano Hobby é suficiente para começar

## 🔄 Deploy Automático (Opcional):

1. Conecte seu repositório Git no Vercel Dashboard
2. A cada push, o Vercel faz deploy automaticamente

## 🎯 Resumo:

- ✅ Firebase Services → Continuam no Firebase
- ✅ Next.js App → Roda na Vercel
- ✅ API Routes → Funcionam na Vercel
- ✅ Tudo integrado → Funciona perfeitamente!

Quer que eu crie um script para facilitar o deploy?

