# 🔧 Como Corrigir o Deploy no Vercel

## ✅ Passo 1: Conectar o Repositório ao Projeto Existente

1. **Acesse o Vercel Dashboard**: https://vercel.com/dashboard
2. **Clique no projeto** "agenda-ai-lajinha"
3. **Vá em Settings** > **Git**
4. **Clique em "Connect Git Repository"** ou **"Disconnect"** e reconecte
5. **Selecione o repositório**: `Franklimello/agenda-ai-lajinha`
6. **Confirme a conexão**

## ✅ Passo 2: Verificar Variáveis de Ambiente

1. **No projeto**, vá em **Settings** > **Environment Variables**
2. **Verifique se todas as variáveis estão configuradas:**
   - ✅ `NEXT_PUBLIC_FIREBASE_API_KEY`
   - ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - ✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - ✅ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - ✅ `NEXT_PUBLIC_FIREBASE_APP_ID`
   - ✅ `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
   - ✅ `FIREBASE_SERVICE_ACCOUNT` (JSON completo)
   - ✅ `STRIPE_SECRET_KEY`
   - ✅ `STRIPE_PUBLISHABLE_KEY`
   - ✅ `STRIPE_PRICE_ID_PROFESSIONAL`

3. **Se faltar alguma**, importe o arquivo `.env` da sua área de trabalho

## ✅ Passo 3: Verificar Logs do Build

1. **No projeto**, vá na aba **Deployments**
2. **Clique no último deployment** (deve estar com erro)
3. **Veja os logs** para identificar o problema
4. **Erros comuns:**
   - ❌ Variáveis de ambiente faltando
   - ❌ Erros de TypeScript/compilação
   - ❌ Erros de dependências

## ✅ Passo 4: Fazer Novo Deploy

### Opção A: Deploy Automático (Após conectar Git)
- Faça um commit no GitHub
- O Vercel fará deploy automaticamente

### Opção B: Deploy Manual
1. No projeto, clique em **"Redeploy"** no último deployment
2. Ou vá em **Deployments** > **"Redeploy"**

## ✅ Passo 5: Verificar Erros Específicos

Se ainda houver erros, verifique:

1. **Build Logs**: Copie a mensagem de erro completa
2. **Runtime Errors**: Veja o console do navegador na URL de produção
3. **Variáveis de Ambiente**: Confirme que todas estão marcadas para Production

## 🚀 Comandos para Forçar Novo Deploy

Se quiser forçar um novo deploy via Git:

```bash
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin main
```

