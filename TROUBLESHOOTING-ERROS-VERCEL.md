# Troubleshooting - Erros no Vercel

## Erros Comuns e Soluções

### ❌ Erro 500 em `/api/auth/session`
**Causa:** NextAuth não está configurado corretamente.

**Solução:**
1. Verifique se `AUTH_SECRET` está configurado no Vercel
2. Gere um novo secret se necessário:
   ```bash
   openssl rand -base64 32
   ```
3. Adicione no Vercel: Settings > Environment Variables > `AUTH_SECRET`
4. Faça um novo deploy

### ❌ Erro 401 em `/api/auth/firebase`
**Causa:** Firebase Admin não está inicializado.

**Solução:**
1. Verifique se `FIREBASE_SERVICE_ACCOUNT` está configurado no Vercel
2. O valor deve ser o JSON completo em **uma única linha**
3. Copie o conteúdo do arquivo `FIREBASE_SERVICE_ACCOUNT_VERCEL.txt`
4. Cole no Vercel sem adicionar aspas extras
5. Verifique se `FIREBASE_STORAGE_BUCKET` está configurado
6. Faça um novo deploy

### ❌ Erro `auth/unauthorized-domain`
**Causa:** Domínio não autorizado no Firebase.

**Solução:**
1. Acesse: https://console.firebase.google.com/
2. Projeto: "agendaailajinha"
3. Authentication > Settings > Authorized domains
4. Adicione: `agenda-ai-lajinha-r6zv51pys.vercel.app`
5. Aguarde alguns segundos e teste novamente

## Como Verificar os Logs no Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Deployments**
4. Clique no deployment mais recente
5. Vá em **Functions** ou **Logs**
6. Procure por mensagens de erro que começam com:
   - `❌` (erros)
   - `⚠️` (avisos)
   - `✅` (sucesso)

## Checklist de Variáveis de Ambiente

Verifique se todas estas variáveis estão configuradas no Vercel:

### Obrigatórias:
- [ ] `AUTH_SECRET` - Secret do NextAuth (gerar com `openssl rand -base64 32`)
- [ ] `FIREBASE_SERVICE_ACCOUNT` - JSON completo em uma linha
- [ ] `FIREBASE_STORAGE_BUCKET` - `agendaailajinha.firebasestorage.app`

### Firebase Public (já devem estar configuradas):
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

### Opcionais (se usar):
- [ ] `GOOGLE_CLIENT_ID` - Se usar login com Google
- [ ] `GOOGLE_CLIENT_SECRET` - Se usar login com Google

## Passo a Passo para Resolver

### 1. Verificar Variáveis no Vercel
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**
4. Verifique se todas as variáveis acima estão configuradas
5. **Importante:** Verifique se `FIREBASE_SERVICE_ACCOUNT` está em uma única linha

### 2. Verificar Logs do Deploy
1. Vá em **Deployments**
2. Clique no deployment mais recente
3. Veja os logs de build
4. Procure por erros relacionados ao Firebase

### 3. Verificar Logs em Runtime
1. Vá em **Deployments** > Clique no deployment > **Functions**
2. Procure por logs que começam com:
   - `❌ Firebase Admin não está inicializado`
   - `❌ FIREBASE_SERVICE_ACCOUNT configurado mas não foi possível fazer parse`
   - `✅ Firebase Admin inicializado com sucesso`

### 4. Testar Localmente (Opcional)
Se quiser testar localmente antes de fazer deploy:

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione todas as variáveis de ambiente
3. Execute: `npm run dev`
4. Verifique se funciona localmente
5. Se funcionar localmente mas não no Vercel, o problema é na configuração das variáveis no Vercel

### 5. Fazer Novo Deploy
Após corrigir as variáveis:

1. No Vercel, vá em **Deployments**
2. Clique nos três pontos do último deployment
3. Selecione **"Redeploy"**
4. Ou faça um commit para trigger automático

## Mensagens de Erro Comuns nos Logs

### `Firebase Admin não está inicializado`
- **Causa:** `FIREBASE_SERVICE_ACCOUNT` não configurado ou inválido
- **Solução:** Verifique se o JSON está correto e em uma linha

### `FIREBASE_SERVICE_ACCOUNT configurado mas não foi possível fazer parse`
- **Causa:** JSON mal formatado ou com caracteres inválidos
- **Solução:** Copie novamente do arquivo `FIREBASE_SERVICE_ACCOUNT_VERCEL.txt`

### `Token inválido ou expirado`
- **Causa:** Token do Firebase expirado
- **Solução:** Faça login novamente (o sistema deve renovar automaticamente)

### `There was a problem with the server configuration`
- **Causa:** `AUTH_SECRET` não configurado
- **Solução:** Adicione `AUTH_SECRET` no Vercel

## Testando Após Correções

1. Aguarde o deploy terminar
2. Acesse o site
3. Abra o console do navegador (F12)
4. Verifique se não há mais erros
5. Tente fazer login
6. Verifique os logs no Vercel se ainda houver problemas

## Ainda com Problemas?

Se após seguir todos os passos ainda houver problemas:

1. Verifique os logs completos no Vercel
2. Copie as mensagens de erro exatas
3. Verifique se todas as variáveis estão configuradas corretamente
4. Verifique se o domínio está autorizado no Firebase
5. Tente fazer um novo deploy limpo

