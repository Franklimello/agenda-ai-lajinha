# 🚀 Deploy para Firebase - Passo a Passo

## ⚠️ IMPORTANTE: Limitação do Firebase Hosting

Firebase Hosting é **estático** e **não suporta API Routes** do Next.js.

Para usar API Routes (Stripe, Auth, etc.), você tem 2 opções:

### Opção A: Vercel (Recomendado - Mais Fácil) ✅
- ✅ Suporta tudo (API Routes, Server Components)
- ✅ Deploy automático
- ✅ Configuração simples

### Opção B: Firebase Cloud Run (Avançado)
- ✅ Suporta tudo
- ⚠️ Mais complexo
- 💰 Pode ter custos

## 📋 Se quiser usar Vercel (Recomendado):

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Adicionar variáveis de ambiente
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_PRICE_ID_PROFESSIONAL
vercel env add STRIPE_WEBHOOK_SECRET
# ... adicionar todas as outras

# 5. Deploy de produção
vercel --prod
```

## 🔧 Se quiser continuar com Firebase:

### Passo 1: Login no Firebase
```bash
firebase login
```

### Passo 2: Verificar projeto
```bash
firebase use agendaailajinha
```

### Passo 3: Configurar variáveis de ambiente
No Firebase Console:
1. Acesse: https://console.firebase.google.com/project/agendaailajinha/settings/general
2. Vá em **Configurações** > **Variáveis de ambiente**
3. Adicione todas as variáveis do `.env.local`

### Passo 4: Build e Deploy
```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting
```

### ⚠️ Limitação:
- API Routes (`/api/*`) **NÃO funcionarão** com Firebase Hosting básico
- Para API Routes, use Cloud Run ou Vercel

## 🎯 Recomendação Final

Para manter todas as funcionalidades (Stripe, Auth, etc.), **use Vercel**:

1. ✅ Mais simples
2. ✅ Suporta tudo do Next.js
3. ✅ Deploy automático
4. ✅ Grátis para começar

Quer que eu configure para Vercel ou prefere tentar Cloud Run no Firebase?

