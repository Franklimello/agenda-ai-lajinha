# 🚀 Deploy Completo na Vercel - Guia Passo a Passo

## ✅ O que está configurado:

- ✅ `vercel.json` - Configuração do projeto
- ✅ Scripts no `package.json` - Comandos de deploy
- ✅ Região: `gru1` (São Paulo) para melhor latência

## 📋 Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

## 📋 Passo 2: Login

```bash
vercel login
```

Isso abrirá o navegador para fazer login.

## 📋 Passo 3: Deploy Inicial (Preview)

```bash
vercel
```

Responda as perguntas:
- **Set up and deploy?** → `Y`
- **Which scope?** → Seu email/empresa
- **Link to existing project?** → `N` (primeira vez)
- **Project name?** → `agenda-ai-lajinha` (ou pressione Enter)
- **Directory?** → `./` (pressione Enter)
- **Override settings?** → `N`

Após o deploy, você receberá uma URL de preview: `https://agenda-ai-lajinha-xxx.vercel.app`

## 📋 Passo 4: Configurar Variáveis de Ambiente

### Opção A: Via CLI (Mais Rápido)

Execute cada comando e cole o valor quando solicitado:

```bash
# Firebase Client SDK
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production

# Firebase Admin SDK (cole o JSON completo)
vercel env add FIREBASE_SERVICE_ACCOUNT production

# Stripe
vercel env add STRIPE_SECRET_KEY production
# Cole: sk_live_... (obter no Stripe Dashboard)

vercel env add STRIPE_PUBLISHABLE_KEY production
# Cole: pk_live_... (obter no Stripe Dashboard)

vercel env add STRIPE_PRICE_ID_PROFESSIONAL production
# Cole: price_1SQJNnQ487P8PGjjTwViObtQ

vercel env add STRIPE_WEBHOOK_SECRET production
# Cole o webhook secret (whsec_...)

# App URL (atualizar após primeiro deploy)
vercel env add NEXT_PUBLIC_APP_URL production
# Cole: https://agenda-ai-lajinha.vercel.app
```

### Opção B: Via Dashboard

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `agenda-ai-lajinha`
3. Vá em **Settings** > **Environment Variables**
4. Adicione cada variável (use o checklist em `scripts/setup-vercel-env.md`)

## 📋 Passo 5: Deploy de Produção

```bash
vercel --prod
```

Ou use o script:
```bash
npm run deploy
```

Você receberá a URL de produção: `https://agenda-ai-lajinha.vercel.app`

## 📋 Passo 6: Atualizar NEXT_PUBLIC_APP_URL

Após descobrir a URL de produção:

```bash
vercel env rm NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_APP_URL production
# Cole a URL: https://agenda-ai-lajinha.vercel.app
```

Depois, faça deploy novamente:
```bash
vercel --prod
```

## 📋 Passo 7: Configurar Webhook do Stripe

1. Acesse: https://dashboard.stripe.com/webhooks
2. Edite ou crie endpoint:
   - **URL**: `https://agenda-ai-lajinha.vercel.app/api/stripe/webhook`
3. Selecione eventos:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
4. Copie o **Signing secret** (começa com `whsec_...`)
5. Atualize no Vercel:
   ```bash
   vercel env rm STRIPE_WEBHOOK_SECRET production
   vercel env add STRIPE_WEBHOOK_SECRET production
   # Cole o novo secret
   ```
6. Deploy novamente:
   ```bash
   vercel --prod
   ```

## 🔄 Deploy Automático (Opcional)

### Conectar com Git:

1. No Vercel Dashboard, vá em **Settings** > **Git**
2. Conecte seu repositório (GitHub, GitLab, Bitbucket)
3. A cada push na branch `main`, o Vercel faz deploy automaticamente

## 📝 Comandos Úteis

```bash
# Deploy de produção
npm run deploy
# ou
vercel --prod

# Deploy de preview
npm run deploy:preview
# ou
vercel

# Ver logs
vercel logs

# Ver variáveis de ambiente
vercel env ls

# Remover variável
vercel env rm NOME_DA_VARIAVEL production

# Adicionar variável
vercel env add NOME_DA_VARIAVEL production
```

## ✅ Checklist Final

- [ ] Deploy inicial feito
- [ ] Todas as variáveis de ambiente configuradas
- [ ] `NEXT_PUBLIC_APP_URL` atualizado com URL de produção
- [ ] Webhook do Stripe configurado
- [ ] `STRIPE_WEBHOOK_SECRET` atualizado
- [ ] Deploy de produção feito
- [ ] Testado login/autenticação
- [ ] Testado agendamento
- [ ] Testado pagamento (Stripe)

## 🎯 URLs Após Deploy

- **Produção**: `https://agenda-ai-lajinha.vercel.app`
- **Preview**: `https://agenda-ai-lajinha-xxx.vercel.app` (a cada deploy)

## 🔒 Segurança

- ✅ Variáveis de ambiente seguras (não expostas no código)
- ✅ Firebase Service Account protegido
- ✅ Stripe keys protegidas
- ✅ Webhook secret protegido

## 🆘 Problemas Comuns

### Erro: "Environment variable not found"
- Verifique se adicionou a variável no ambiente correto (production)
- Use `vercel env ls` para listar variáveis

### Erro: "Build failed"
- Verifique os logs: `vercel logs`
- Teste build local: `npm run build`

### Firebase não conecta
- Verifique se `FIREBASE_SERVICE_ACCOUNT` está como JSON completo
- Verifique se todas as variáveis `NEXT_PUBLIC_FIREBASE_*` estão configuradas

---

**Pronto! Seu app está no ar! 🚀**

