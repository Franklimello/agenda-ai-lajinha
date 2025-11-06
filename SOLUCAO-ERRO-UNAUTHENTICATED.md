# Solução: Erro 16 UNAUTHENTICATED

## ❌ Erro
```
16 UNAUTHENTICATED: Request had invalid authentication credentials. 
Expected OAuth 2 access token, login cookie or other valid authentication credential.
```

## 🔍 Causa
O Firebase Admin não está sendo inicializado corretamente. Isso acontece quando:
1. A variável `FIREBASE_SERVICE_ACCOUNT` não está configurada no Vercel
2. O JSON do `FIREBASE_SERVICE_ACCOUNT` está mal formatado
3. O JSON não está em uma única linha
4. Há caracteres inválidos no JSON

## ✅ Solução

### Passo 1: Verificar se FIREBASE_SERVICE_ACCOUNT está configurado

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**
4. Procure por `FIREBASE_SERVICE_ACCOUNT`
5. Se não existir, você precisa adicionar

### Passo 2: Adicionar FIREBASE_SERVICE_ACCOUNT

1. Abra o arquivo `FIREBASE_SERVICE_ACCOUNT_VERCEL.txt` na raiz do projeto
2. Copie **TODO o conteúdo** (é um JSON em uma única linha)
3. No Vercel:
   - Clique em **"Add New"**
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** Cole o JSON completo (sem aspas extras)
   - Selecione: **Production**, **Preview**, **Development**
   - Clique em **Save**

### Passo 3: Verificar o formato do JSON

O JSON deve:
- ✅ Estar em **uma única linha**
- ✅ Começar com `{` e terminar com `}`
- ✅ Não ter quebras de linha
- ✅ Não ter aspas extras ao redor

**Exemplo correto:**
```
{"type":"service_account","project_id":"agendaailajinha",...}
```

**Exemplo incorreto:**
```
'{"type":"service_account",...}'  ❌ (aspas extras)
{
  "type": "service_account",      ❌ (múltiplas linhas)
  ...
}
```

### Passo 4: Verificar outras variáveis obrigatórias

Certifique-se de que estas variáveis também estão configuradas:

- `FIREBASE_STORAGE_BUCKET` = `agendaailajinha.firebasestorage.app`
- `AUTH_SECRET` = (um secret gerado)

### Passo 5: Verificar logs no Vercel

Após adicionar a variável, faça um novo deploy e verifique os logs:

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
```

### Passo 6: Fazer novo deploy

1. No Vercel, vá em **Deployments**
2. Clique nos três pontos do último deployment
3. Selecione **"Redeploy"**
4. Aguarde o deploy terminar

## 🔍 Como verificar se está funcionando

Após o deploy, verifique os logs novamente. Se você ver:
- `✅ Firebase Admin inicializado com sucesso` → Está funcionando!
- O erro `16 UNAUTHENTICATED` deve desaparecer

## 📝 Checklist

- [ ] `FIREBASE_SERVICE_ACCOUNT` está configurado no Vercel
- [ ] O JSON está em uma única linha
- [ ] O JSON não tem aspas extras
- [ ] `FIREBASE_STORAGE_BUCKET` está configurado
- [ ] Novo deploy foi feito
- [ ] Logs mostram "✅ Firebase Admin inicializado com sucesso"
- [ ] Erro `16 UNAUTHENTICATED` desapareceu

## 🆘 Ainda com problemas?

Se após seguir todos os passos ainda houver problemas:

1. **Verifique os logs completos** no Vercel
2. **Copie a mensagem de erro exata** dos logs
3. **Verifique se o JSON está correto:**
   - Tente fazer parse do JSON localmente
   - Use um validador JSON online
4. **Verifique se todas as variáveis estão configuradas:**
   - `FIREBASE_SERVICE_ACCOUNT`
   - `FIREBASE_STORAGE_BUCKET`
   - `AUTH_SECRET`
   - Todas as variáveis `NEXT_PUBLIC_FIREBASE_*`

## 💡 Dica

Se você tiver o arquivo `firebase-service-account.json` localmente, pode usar este comando para converter para uma linha:

```bash
# No terminal (Linux/Mac)
cat firebase-service-account.json | jq -c .

# Ou simplesmente copie o conteúdo e remova as quebras de linha manualmente
```

