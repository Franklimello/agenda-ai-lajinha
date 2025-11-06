# 📋 Como Importar Variáveis de Ambiente no Vercel

## ✅ Método 1: Importar Arquivo .env (Recomendado)

1. **Abra o arquivo** `env.vercel.txt` na raiz do projeto
2. **Copie TODO o conteúdo** do arquivo (Ctrl+A, Ctrl+C)
3. **No Vercel Dashboard:**
   - Acesse: https://vercel.com/dashboard
   - Selecione seu projeto `agenda-ai-lajinha`
   - Vá em **Settings** > **Environment Variables**
   - Clique em **"Import .env file"** ou **"Import variables"**
   - Cole o conteúdo copiado
   - Clique em **Import** ou **Save**

## ✅ Método 2: Colar Conteúdo Direto

No Vercel Dashboard > Settings > Environment Variables, procure a opção:
- **"Import .env file"** ou 
- **"Paste .env contents"** ou
- **"Import variables"**

Cole o conteúdo abaixo:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (sua chave da API do Firebase)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=agendaailajinha.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=agendaailajinha
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=agendaailajinha.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=19208521391
NEXT_PUBLIC_FIREBASE_APP_ID=1:19208521391:web:1eaafba03f1bda4266765a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-X8DBH900RJ
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"seu-projeto","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"...","universe_domain":"googleapis.com"}
STRIPE_SECRET_KEY=sk_live_... (sua chave secreta do Stripe)
STRIPE_PUBLISHABLE_KEY=pk_live_... (sua chave pública do Stripe)
STRIPE_PRICE_ID_PROFESSIONAL=price_1SQJNnQ487P8PGjjTwViObtQ
```

## ⚠️ Importante:

1. **Marque todas as opções** ao importar:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

2. **Após o primeiro deploy**, adicione manualmente:
   - `NEXT_PUBLIC_APP_URL` = URL do seu projeto (ex: `https://agenda-ai-lajinha.vercel.app`)
   - `STRIPE_WEBHOOK_SECRET` = Obter após configurar webhook no Stripe

3. **FIREBASE_SERVICE_ACCOUNT** está em uma linha completa (sem quebras)

## 🚀 Próximos Passos:

1. Importe as variáveis
2. Faça o deploy
3. Configure o webhook do Stripe
4. Adicione as variáveis restantes

