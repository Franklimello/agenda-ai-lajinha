# 📦 Comandos para Enviar ao GitHub

## ✅ Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. **Repository name**: `agenda-ai-lajinha`
3. **Description**: Sistema de agendamento para profissionais
4. **Visibility**: Private (recomendado) ou Public
5. **NÃO marque** "Add a README file" (já temos)
6. Clique em **Create repository**

## ✅ Passo 2: Conectar e Enviar Código

Após criar o repositório, o GitHub mostrará comandos. Use estes:

```bash
# Adicionar remote (substitua USERNAME pelo seu usuário do GitHub)
git remote add origin https://github.com/USERNAME/agenda-ai-lajinha.git

# Ou se preferir SSH (mais seguro):
# git remote add origin git@github.com:USERNAME/agenda-ai-lajinha.git

# Renomear branch para main (se necessário)
git branch -M main

# Enviar código para GitHub
git push -u origin main
```

## ✅ Passo 3: Conectar no Vercel

1. Acesse: https://vercel.com/login
2. Faça login com **GitHub** (recomendado)
3. Clique em **Add New** > **Project**
4. Selecione o repositório `agenda-ai-lajinha`
5. Clique em **Import**

## ✅ Passo 4: Configurar Variáveis no Vercel

No Vercel Dashboard, antes de fazer deploy:

1. Vá em **Settings** > **Environment Variables**
2. Adicione todas as variáveis (veja lista abaixo)
3. Marque todas as opções: Production, Preview, Development

### Lista de Variáveis:

#### Firebase Client SDK:
```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyDZkm8gi4V_1BMdxR-uegqARttu3QsY1BQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = agendaailajinha.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = agendaailajinha
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = agendaailajinha.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 19208521391
NEXT_PUBLIC_FIREBASE_APP_ID = 1:19208521391:web:1eaafba03f1bda4266765a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = G-X8DBH900RJ
```

#### Firebase Admin SDK:
```
FIREBASE_SERVICE_ACCOUNT = (cole o JSON completo do firebase-service-account.json)
```

#### Stripe:
```
STRIPE_SECRET_KEY = sk_live_... (obter no Stripe Dashboard)
STRIPE_PUBLISHABLE_KEY = pk_live_... (obter no Stripe Dashboard)
STRIPE_PRICE_ID_PROFESSIONAL = price_1SQJNnQ487P8PGjjTwViObtQ
STRIPE_WEBHOOK_SECRET = (adicionar após configurar webhook)
```

#### App URL:
```
NEXT_PUBLIC_APP_URL = (será preenchido após primeiro deploy)
```

## ✅ Passo 5: Deploy

Após configurar variáveis, clique em **Deploy** no Vercel.

Ou faça um novo commit:
```bash
git commit --allow-empty -m "Trigger deploy"
git push origin main
```

## 🎯 Próximos Passos Após Deploy:

1. Copiar URL de produção (ex: `https://agenda-ai-lajinha.vercel.app`)
2. Atualizar `NEXT_PUBLIC_APP_URL` no Vercel
3. Configurar webhook do Stripe com a URL de produção
4. Adicionar `STRIPE_WEBHOOK_SECRET` no Vercel
5. Fazer deploy novamente

## ✅ Vantagens:

- ✅ Deploy automático a cada push
- ✅ Preview de cada PR
- ✅ Histórico de versões
- ✅ Rollback fácil
- ✅ Variáveis seguras (não vão pro Git)

