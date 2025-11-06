# Verificação Final - Variáveis de Ambiente no Vercel

## ✅ Variáveis Já Configuradas (Confirmadas)

Baseado na imagem do Vercel, estas variáveis estão configuradas:

- ✅ `AUTH_SECRET` (adicionado há 7m)
- ✅ `FIREBASE_SERVICE_ACCOUNT` (atualizado há 14m)
- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY`
- ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- ✅ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_APP_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- ✅ `STRIPE_SECRET_KEY`
- ✅ `STRIPE_PUBLISHABLE_KEY`
- ✅ `STRIPE_PRICE_ID_PROFESSIONAL`

## ⚠️ Variável que Pode Estar Faltando

### `FIREBASE_STORAGE_BUCKET`

Esta variável **não aparece na lista** mas é necessária para o Firebase Admin funcionar.

**Valor:** `agendaailajinha.firebasestorage.app`

**Como adicionar:**
1. No Vercel, vá em **Settings** > **Environment Variables**
2. Clique em **"Add New"**
3. **Name:** `FIREBASE_STORAGE_BUCKET`
4. **Value:** `agendaailajinha.firebasestorage.app`
5. Selecione: **Production**, **Preview**, **Development**
6. Clique em **Save**

**Nota:** O código tem um fallback, mas é melhor configurar explicitamente.

## 🔍 Próximos Passos

### 1. Verificar se FIREBASE_STORAGE_BUCKET está configurado

Se não estiver na lista, adicione conforme instruções acima.

### 2. Verificar o formato do FIREBASE_SERVICE_ACCOUNT

O JSON deve estar em **uma única linha**. Para verificar:

1. No Vercel, clique nos três pontos (`...`) ao lado de `FIREBASE_SERVICE_ACCOUNT`
2. Selecione **"View"** ou **"Edit"**
3. Verifique se:
   - ✅ Começa com `{` e termina com `}`
   - ✅ Está em uma única linha (sem quebras)
   - ✅ Não tem aspas extras ao redor

### 3. Fazer um novo deploy

Após verificar/adicionar as variáveis:

1. Vá em **Deployments**
2. Clique nos três pontos do último deployment
3. Selecione **"Redeploy"**
4. Aguarde o deploy terminar

### 4. Verificar os logs

Após o deploy, verifique os logs:

1. Vá em **Deployments** > Clique no deployment > **Functions**
2. Procure por estas mensagens:

**✅ Se estiver funcionando:**
```
✅ Firebase Admin inicializado com sucesso
```

**❌ Se não estiver funcionando:**
```
❌ FIREBASE_SERVICE_ACCOUNT configurado mas não foi possível fazer parse
❌ Firebase Admin não está inicializado. Verifique FIREBASE_SERVICE_ACCOUNT.
❌ FIREBASE_STORAGE_BUCKET não configurado
```

### 5. Testar o site

Após o deploy:

1. Acesse o site
2. Abra o console do navegador (F12)
3. Verifique se não há mais erros `16 UNAUTHENTICATED`
4. Tente fazer login
5. Verifique se a página inicial carrega os profissionais

## 📋 Checklist Final

- [ ] `FIREBASE_STORAGE_BUCKET` está configurado (se não estiver na lista)
- [ ] `FIREBASE_SERVICE_ACCOUNT` está em formato correto (uma linha, sem aspas extras)
- [ ] Novo deploy foi feito
- [ ] Logs mostram "✅ Firebase Admin inicializado com sucesso"
- [ ] Erro `16 UNAUTHENTICATED` desapareceu
- [ ] Site está funcionando corretamente

## 🆘 Se ainda houver problemas

1. **Copie os logs completos** do Vercel
2. **Verifique o formato do JSON:**
   - Tente fazer parse do JSON localmente
   - Use um validador JSON online
3. **Verifique se todas as variáveis estão corretas:**
   - Compare com o arquivo `FIREBASE_SERVICE_ACCOUNT_VERCEL.txt`
   - Verifique se não há caracteres extras

## 💡 Dica

Se você quiser verificar o valor exato do `FIREBASE_SERVICE_ACCOUNT` no Vercel:

1. Clique nos três pontos (`...`) ao lado da variável
2. Selecione **"View"** (não "Edit")
3. O valor será mostrado (mas mascarado)
4. Compare com o arquivo `FIREBASE_SERVICE_ACCOUNT_VERCEL.txt`

