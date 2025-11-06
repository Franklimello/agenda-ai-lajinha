# Configurar Variáveis de Ambiente no Vercel

## ⚠️ Problemas Comuns e Soluções

### Erro 500 no `/api/auth/session`
Este erro geralmente ocorre quando faltam variáveis de ambiente essenciais.

### Erro `auth/unauthorized-domain`
Este erro ocorre quando o domínio não está autorizado no Firebase. Veja: `ADICIONAR-DOMINIO-AUTORIZADO-FIREBASE.md`

## Variáveis de Ambiente Obrigatórias

### 1. Firebase Service Account
**Nome:** `FIREBASE_SERVICE_ACCOUNT`  
**Valor:** O JSON completo do Service Account em uma única linha

**Como obter:**
1. Abra o arquivo `FIREBASE_SERVICE_ACCOUNT_VERCEL.txt`
2. Copie TODO o conteúdo (é um JSON em uma linha)
3. Cole no Vercel

**Importante:**
- Deve ser o JSON completo em uma única linha
- Não adicione aspas extras
- Não quebre em múltiplas linhas

### 2. Firebase Storage Bucket
**Nome:** `FIREBASE_STORAGE_BUCKET`  
**Valor:** `agendaailajinha.firebasestorage.app`

### 3. NextAuth Secret (OBRIGATÓRIO)
**Nome:** `AUTH_SECRET` ou `NEXTAUTH_SECRET`  
**Valor:** Uma string aleatória segura

**Como gerar:**
```bash
# No terminal, execute:
openssl rand -base64 32
```

Ou use este gerador online: https://generate-secret.vercel.app/32

**Exemplo:**
```
AUTH_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### 4. Google OAuth (se usar login com Google)
**Nome:** `GOOGLE_CLIENT_ID`  
**Valor:** Seu Client ID do Google (ex: `821962501479-xxx.apps.googleusercontent.com`)

**Nome:** `GOOGLE_CLIENT_SECRET`  
**Valor:** Seu Client Secret do Google (ex: `GOCSPX-xxx`)

### 5. Firebase Public Config (já deve estar configurado)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Como Adicionar no Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**
4. Para cada variável:
   - Clique em **"Add New"**
   - Digite o **Name** (nome da variável)
   - Cole o **Value** (valor)
   - Selecione os ambientes: **Production**, **Preview**, **Development**
   - Clique em **Save**

## Checklist de Variáveis

Marque conforme adicionar:

- [ ] `FIREBASE_SERVICE_ACCOUNT` (JSON completo em uma linha)
- [ ] `FIREBASE_STORAGE_BUCKET` = `agendaailajinha.firebasestorage.app`
- [ ] `AUTH_SECRET` (gerar com `openssl rand -base64 32`)
- [ ] `GOOGLE_CLIENT_ID` (se usar Google login)
- [ ] `GOOGLE_CLIENT_SECRET` (se usar Google login)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Após Adicionar as Variáveis

1. **Faça um novo deploy** no Vercel:
   - Vá em **Deployments**
   - Clique nos três pontos do último deployment
   - Selecione **"Redeploy"**

2. **Ou faça um commit** para trigger um novo deploy automático

3. **Aguarde o deploy terminar**

4. **Teste novamente** o site

## Verificar se Está Funcionando

1. Acesse seu site no Vercel
2. Abra o console do navegador (F12)
3. Verifique se não há mais erros 500
4. Tente fazer login
5. Verifique se não há mais erros de domínio não autorizado

## Troubleshooting

### Erro 500 persiste
1. Verifique os logs do Vercel:
   - Vá em **Deployments** > Clique no deployment > **Functions** > Veja os logs
2. Verifique se todas as variáveis foram adicionadas corretamente
3. Verifique se o `FIREBASE_SERVICE_ACCOUNT` está em uma única linha
4. Verifique se o `AUTH_SECRET` foi adicionado

### Erro de domínio não autorizado
Veja: `ADICIONAR-DOMINIO-AUTORIZADO-FIREBASE.md`

### Erro ao fazer parse do JSON
1. Verifique se o `FIREBASE_SERVICE_ACCOUNT` está completo
2. Verifique se não há quebras de linha extras
3. Tente copiar novamente do arquivo `FIREBASE_SERVICE_ACCOUNT_VERCEL.txt`

