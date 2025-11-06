# Configuração do Stripe - Valores Atuais

## ✅ Configurações Já Fornecidas:

- **Publishable Key**: `pk_live_...` (obter no Stripe Dashboard)
- **Product ID**: `prod_TN3UoxoqKOZXEF`
- **Price ID (Profissional)**: `price_1SQJNnQ487P8PGjjTwViObtQ`

## ⚠️ Ainda Necessário:

### 1. Chave Secreta do Stripe (STRIPE_SECRET_KEY)
- Acesse: https://dashboard.stripe.com/apikeys
- Copie a **Secret key** (começa com `sk_live_...`)
- ⚠️ **NUNCA** compartilhe esta chave publicamente

### 2. Webhook Secret (STRIPE_WEBHOOK_SECRET)
- Acesse: https://dashboard.stripe.com/webhooks
- Clique em "Add endpoint"
- URL: `https://seudominio.com/api/stripe/webhook`
- Selecione os eventos:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- Copie o **Signing secret** (começa com `whsec_...`)

## 📝 Arquivo .env.local

Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Stripe Secret Key (OBTER NO STRIPE DASHBOARD)
STRIPE_SECRET_KEY=sk_live_...

# Stripe Publishable Key (JÁ FORNECIDA)
STRIPE_PUBLISHABLE_KEY=pk_live_... (obter no Stripe Dashboard)

# Price ID (JÁ FORNECIDO)
STRIPE_PRICE_ID_PROFESSIONAL=price_1SQJNnQ487P8PGjjTwViObtQ

# Webhook Secret (OBTER NO STRIPE DASHBOARD)
STRIPE_WEBHOOK_SECRET=whsec_...

# URL da Aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Em produção: NEXT_PUBLIC_APP_URL=https://seudominio.com

# Firebase (já configurado)
NEXT_PUBLIC_FIREBASE_API_KEY=...
FIREBASE_SERVICE_ACCOUNT=...
# ... outras variáveis Firebase
```

## 🚀 Próximos Passos:

1. Obter a `STRIPE_SECRET_KEY` no Stripe Dashboard
2. Configurar o Webhook e obter o `STRIPE_WEBHOOK_SECRET`
3. Adicionar todas as variáveis no `.env.local`
4. Reiniciar o servidor: `npm run dev`
5. Testar o botão "Assinar Agora" no dashboard

## 📌 Importante:

- ⚠️ O arquivo `.env.local` está no `.gitignore` - não será commitado
- ✅ Nunca commite suas chaves secretas
- ✅ Teste primeiro em modo de teste se possível

