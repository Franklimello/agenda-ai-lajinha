# 🚀 Deploy via GitHub + Vercel - Guia Completo

## ✅ Por que usar GitHub + Vercel?

1. ✅ **Deploy Automático** - A cada push no GitHub, o Vercel faz deploy automaticamente
2. ✅ **Controle de Versão** - Todo código versionado no Git
3. ✅ **CI/CD Integrado** - Build e deploy automáticos
4. ✅ **Mais Seguro** - Não precisa commitar chaves secretas
5. ✅ **Profissional** - Workflow padrão da indústria

## 📋 Passo 1: Criar Repositório no GitHub

### 1.1. Criar repositório:
1. Acesse: https://github.com/new
2. Nome: `agenda-ai-lajinha` (ou outro)
3. Visibilidade: **Private** (recomendado) ou **Public**
4. Não inicialize com README (se já tem código local)
5. Clique em **Create repository**

### 1.2. Conectar repositório local:

```bash
# Se ainda não inicializou Git no projeto
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Initial commit: Sistema de agendamento"

# Adicionar remote do GitHub (substitua USERNAME pelo seu)
git remote add origin https://github.com/USERNAME/agenda-ai-lajinha.git

# Ou se preferir SSH:
# git remote add origin git@github.com:USERNAME/agenda-ai-lajinha.git

# Push para GitHub
git branch -M main
git push -u origin main
```

## 📋 Passo 2: Conectar GitHub no Vercel

### 2.1. Acessar Vercel Dashboard:
1. Acesse: https://vercel.com/login
2. Faça login com GitHub (recomendado) ou email

### 2.2. Importar Projeto:
1. Clique em **Add New** > **Project**
2. Conecte sua conta GitHub (se ainda não conectou)
3. Selecione o repositório `agenda-ai-lajinha`
4. Clique em **Import**

## 📋 Passo 3: Configurar Projeto no Vercel

### 3.1. Configurações do Projeto:
- **Project Name**: `agenda-ai-lajinha`
- **Framework Preset**: Next.js (detectado automaticamente)
- **Root Directory**: `./` (raiz)
- **Build Command**: `npm run build` (já configurado)
- **Output Directory**: `.next` (automático)
- **Install Command**: `npm install` (automático)

### 3.2. Configurar Variáveis de Ambiente:

No Vercel, antes de fazer deploy, adicione todas as variáveis:

**Firebase Client SDK:**
- `NEXT_PUBLIC_FIREBASE_API_KEY` = `AIzaSyDZkm8gi4V_1BMdxR-uegqARttu3QsY1BQ`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `agendaailajinha.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `agendaailajinha`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = `agendaailajinha.firebasestorage.app`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = `19208521391`
- `NEXT_PUBLIC_FIREBASE_APP_ID` = `1:19208521391:web:1eaafba03f1bda4266765a`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` = `G-X8DBH900RJ`

**Firebase Admin SDK:**
- `FIREBASE_SERVICE_ACCOUNT` = (cole o JSON completo do firebase-service-account.json)

**Stripe:**
- `STRIPE_SECRET_KEY` = `sk_live_...` (obter no Stripe Dashboard)
- `STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (obter no Stripe Dashboard)
- `STRIPE_PRICE_ID_PROFESSIONAL` = `price_1SQJNnQ487P8PGjjTwViObtQ`
- `STRIPE_WEBHOOK_SECRET` = (adicionar após configurar webhook)

**App URL:**
- `NEXT_PUBLIC_APP_URL` = (será preenchido após primeiro deploy)

### 3.3. Como Adicionar Variáveis:
1. No Vercel, vá em **Settings** > **Environment Variables**
2. Clique em **Add New**
3. Adicione cada variável:
   - **Name**: Nome da variável
   - **Value**: Valor da variável
   - **Environment**: Marque todas (Production, Preview, Development)
4. Clique em **Save**

## 📋 Passo 4: Fazer Deploy

### 4.1. Deploy Inicial:
Após configurar tudo, clique em **Deploy** no Vercel.

Ou faça push para o GitHub:
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

O Vercel detectará automaticamente e fará deploy!

### 4.2. Após Deploy:
Você receberá uma URL: `https://agenda-ai-lajinha.vercel.app`

## 📋 Passo 5: Atualizar NEXT_PUBLIC_APP_URL

1. Copie a URL de produção
2. No Vercel: **Settings** > **Environment Variables**
3. Edite `NEXT_PUBLIC_APP_URL` e cole a URL
4. Faça um novo commit para trigger novo deploy:
   ```bash
   git commit --allow-empty -m "Update app URL"
   git push origin main
   ```

## 📋 Passo 6: Configurar Webhook do Stripe

1. Acesse: https://dashboard.stripe.com/webhooks
2. Edite ou crie endpoint:
   - **URL**: `https://agenda-ai-lajinha.vercel.app/api/stripe/webhook`
3. Selecione eventos:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
4. Copie o **Signing secret** (`whsec_...`)
5. Adicione no Vercel como `STRIPE_WEBHOOK_SECRET`
6. Faça commit vazio para trigger novo deploy:
   ```bash
   git commit --allow-empty -m "Update Stripe webhook"
   git push origin main
   ```

## ✅ Vantagens deste Método:

1. ✅ **Deploy Automático** - Push → Deploy automático
2. ✅ **Preview Deploys** - Cada PR recebe uma URL de preview
3. ✅ **Rollback Fácil** - Pode voltar para versões anteriores
4. ✅ **Histórico** - Vê todos os deploys no dashboard
5. ✅ **Seguro** - Variáveis de ambiente não vão pro Git

## 🔄 Workflow de Desenvolvimento:

```bash
# 1. Fazer mudanças no código
# 2. Commit
git add .
git commit -m "Descrição das mudanças"

# 3. Push para GitHub
git push origin main

# 4. Vercel faz deploy automaticamente! 🚀
```

## 📝 Checklist Final:

- [ ] Repositório criado no GitHub
- [ ] Código commitado e enviado para GitHub
- [ ] Projeto importado no Vercel
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Primeiro deploy feito
- [ ] `NEXT_PUBLIC_APP_URL` atualizado
- [ ] Webhook do Stripe configurado
- [ ] `STRIPE_WEBHOOK_SECRET` atualizado
- [ ] Deploy final feito
- [ ] Testado login/autenticação
- [ ] Testado agendamento
- [ ] Testado pagamento

## 🎯 Próximos Passos:

1. Criar repositório no GitHub
2. Fazer push do código
3. Conectar no Vercel
4. Configurar variáveis
5. Deploy! 🚀

