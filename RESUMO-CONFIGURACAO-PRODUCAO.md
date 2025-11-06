# Resumo: Configurar Produção no Vercel

## ✅ O que fazer AGORA

### 1. No Vercel Dashboard (5 minutos)

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **"agenda-ai-lajinha"**
3. Vá em **Settings** > **Git**
4. Configure a branch **"main"** como **Production Branch**
5. Salve

### 2. No Firebase Console (2 minutos)

1. Acesse: https://console.firebase.google.com/
2. Vá em **Authentication** > **Settings** > **Authorized domains**
3. Adicione apenas: `agenda-ai-lajinha.vercel.app`
4. Remova domínios de preview antigos (opcional)

### 3. Testar (1 minuto)

1. Faça um commit vazio:
   ```bash
   git commit --allow-empty -m "Teste produção"
   git push origin main
   ```

2. Verifique no Vercel se o deploy é de **Production**

## 🎯 Resultado

- ✅ Sempre o mesmo domínio
- ✅ Não precisa adicionar novos domínios
- ✅ Deploy automático de produção

## 📝 Próximos Passos

Após configurar, o erro de domínio não autorizado não vai mais acontecer porque sempre será o mesmo domínio!

