# 📋 Como Fazer Upload do Arquivo .env no Vercel

## ✅ Passo a Passo:

1. **Localize o arquivo** `env.vercel.upload` na raiz do projeto

2. **Renomeie o arquivo** para `.env`:
   - Windows: Clique com botão direito > Renomear > Digite `.env`
   - Ou use o comando: renomeie `env.vercel.upload` para `.env`

3. **No Vercel Dashboard:**
   - Acesse: https://vercel.com/dashboard
   - Selecione seu projeto `agenda-ai-lajinha`
   - Vá em **Settings** > **Environment Variables**
   - Clique em **"Import .env file"** ou **"Upload .env file"**
   - Selecione o arquivo `.env` que você renomeou
   - **Marque todas as opções:**
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Clique em **Import** ou **Save**

## ⚠️ Importante:

- O arquivo `.env` está no `.gitignore`, então não será commitado no Git
- Após importar, você pode deletar o arquivo `.env` local se quiser
- **Após o primeiro deploy**, adicione manualmente:
  - `NEXT_PUBLIC_APP_URL` = URL do seu projeto (ex: `https://agenda-ai-lajinha.vercel.app`)
  - `STRIPE_WEBHOOK_SECRET` = Obter após configurar webhook no Stripe

## 🚀 Alternativa: Copiar e Colar Manualmente

Se preferir não fazer upload, você pode adicionar cada variável manualmente:

1. No Vercel: **Settings** > **Environment Variables** > **Add New**
2. Para cada variável do arquivo `env.vercel.upload`:
   - **Name**: Nome da variável (ex: `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - **Value**: Valor da variável (ex: `AIzaSyDZkm8gi4V_1BMdxR-uegqARttu3QsY1BQ`)
   - Marque: Production, Preview, Development
   - Clique em **Save**

