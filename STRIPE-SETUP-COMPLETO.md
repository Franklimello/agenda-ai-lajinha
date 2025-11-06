# ✅ Configuração do Stripe - COMPLETA

## 📋 Todas as Chaves Configuradas:

### ✅ Chaves do Stripe:
- **Publishable Key**: `pk_live_...` (obter no Stripe Dashboard)
- **Secret Key**: `sk_live_...` (obter no Stripe Dashboard)
- **Product ID**: `prod_TN3UoxoqKOZXEF`
- **Price ID (Profissional)**: `price_1SQJNnQ487P8PGjjTwViObtQ`

### ⚠️ Ainda Necessário:
- **Webhook Secret**: `whsec_...` (precisa configurar o webhook)

## 📝 Arquivo .env.local

Crie/atualize o arquivo `.env.local` na raiz do projeto:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_... (obter no Stripe Dashboard)
STRIPE_PUBLISHABLE_KEY=pk_live_... (obter no Stripe Dashboard)
STRIPE_PRICE_ID_PROFESSIONAL=price_1SQJNnQ487P8PGjjTwViObtQ
STRIPE_WEBHOOK_SECRET=whsec_... (adicionar após configurar webhook)

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Em produção: NEXT_PUBLIC_APP_URL=https://seudominio.com
```

## 🔗 Configurar Webhook (Último Passo)

### 1. Acesse o Stripe Dashboard:
https://dashboard.stripe.com/webhooks

### 2. Clique em "Add endpoint"

### 3. Configure:
- **URL**: `https://seudominio.com/api/stripe/webhook`
  - Para teste local: use Stripe CLI (veja abaixo)
- **Eventos a selecionar**:
  - ✅ `checkout.session.completed`
  - ✅ `customer.subscription.updated`
  - ✅ `customer.subscription.deleted`
  - ✅ `invoice.payment_succeeded`
  - ✅ `invoice.payment_failed`

### 4. Copie o Signing secret:
- Começa com `whsec_...`
- Adicione no `.env.local` como `STRIPE_WEBHOOK_SECRET`

## 🧪 Para Testar Localmente (Webhook):

```bash
# Instalar Stripe CLI (se ainda não tiver)
# Windows: https://stripe.com/docs/stripe-cli

# No terminal, execute:
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Isso vai gerar um webhook secret temporário
# Use esse secret no .env.local para testes locais
```

## ✅ Como Testar:

1. ✅ Adicione todas as variáveis no `.env.local`
2. ✅ Reinicie o servidor: `npm run dev`
3. ✅ Acesse: `http://localhost:3000/dashboard/plans`
4. ✅ Clique em "Assinar Agora"
5. ✅ Deve redirecionar para o checkout do Stripe

## 🔒 Segurança:

- ⚠️ O arquivo `.env.local` está no `.gitignore` - não será commitado
- ✅ Nunca compartilhe suas chaves secretas
- ✅ Use chaves de teste (`_test_`) para desenvolvimento

## 📌 Próximos Passos:

1. Configurar o webhook (obter `STRIPE_WEBHOOK_SECRET`)
2. Adicionar no `.env.local`
3. Reiniciar o servidor
4. Testar o fluxo completo de pagamento

