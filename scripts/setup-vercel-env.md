# 📋 Checklist de Variáveis de Ambiente para Vercel

## 🔥 Firebase Client SDK (NEXT_PUBLIC_*)

Copie do seu arquivo `.env.local` ou `src/lib/firebase.ts`:

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (opcional)

## 🔐 Firebase Admin SDK

- [ ] `FIREBASE_SERVICE_ACCOUNT` (JSON completo do service account)

## 💳 Stripe

- [ ] `STRIPE_SECRET_KEY` = `sk_live_...` (obter no Stripe Dashboard)
- [ ] `STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (obter no Stripe Dashboard)
- [ ] `STRIPE_PRICE_ID_PROFESSIONAL` = `price_1SQJNnQ487P8PGjjTwViObtQ`
- [ ] `STRIPE_WEBHOOK_SECRET` (obter após configurar webhook)

## 🌐 App URL

- [ ] `NEXT_PUBLIC_APP_URL` = `https://agenda-ai-lajinha.vercel.app` (atualizar após primeiro deploy)

## 📝 Como Adicionar:

### Via CLI:
```bash
vercel env add NOME_DA_VARIAVEL production
# Cole o valor quando solicitado
```

### Via Dashboard:
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Settings > Environment Variables
4. Adicione cada variável

