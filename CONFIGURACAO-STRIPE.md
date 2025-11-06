# Configuração do Stripe

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis no arquivo `.env.local`:

```env
# Stripe Secret Key (chave secreta)
STRIPE_SECRET_KEY=sk_live_...

# Stripe Publishable Key (chave pública - já fornecida)
STRIPE_PUBLISHABLE_KEY=pk_live_... (obter no Stripe Dashboard)

# Price IDs dos Planos (obter no Stripe Dashboard > Products)
STRIPE_PRICE_ID_PROFESSIONAL=price_...
STRIPE_PRICE_ID_BASIC=price_...

# Webhook Secret (obter no Stripe Dashboard > Webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...

# URL da Aplicação (para redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Em produção: NEXT_PUBLIC_APP_URL=https://seudominio.com
```

## Como Obter os Price IDs

1. Acesse o [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá em **Products** (Produtos)
3. Crie ou selecione um produto
4. Adicione um preço recorrente (mensal)
5. Copie o **Price ID** (começa com `price_`)

## Como Configurar o Webhook

1. Acesse o [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá em **Developers > Webhooks**
3. Clique em **Add endpoint**
4. URL do endpoint: `https://seudominio.com/api/stripe/webhook`
5. Selecione os eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Copie o **Signing secret** (começa com `whsec_`)

## Para Desenvolvimento Local

Para testar webhooks localmente, use o Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Isso irá gerar um webhook signing secret temporário que você pode usar em `.env.local`.

## Como Funciona

1. **Cliente clica em "Assinar Agora"**: 
   - Cria uma sessão de checkout no Stripe
   - Redireciona para a página de pagamento do Stripe

2. **Após pagamento bem-sucedido**:
   - Webhook recebe o evento `checkout.session.completed`
   - Cria/atualiza a subscription no Firestore
   - Cliente é redirecionado de volta para `/dashboard/plans?success=true`

3. **Gerenciamento de Subscription**:
   - Webhooks atualizam o status automaticamente
   - Pagamentos falhados mudam status para `past_due`
   - Cancelamentos mudam status para `canceled`

## Estrutura de Dados no Firestore

A subscription é salva na coleção `subscriptions` com:

```typescript
{
  userId: string;
  plan: "BASIC" | "PROFESSIONAL";
  status: "active" | "past_due" | "canceled";
  priceId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Notas Importantes

- ⚠️ **Nunca** commite suas chaves secretas no Git
- ✅ Use variáveis de ambiente para todas as configurações sensíveis
- ✅ Teste em modo de teste primeiro (use `sk_test_` e `pk_test_`)
- ✅ Configure os webhooks antes de ir para produção

