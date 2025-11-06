# 🚂 Deploy no Railway (Mais Simples)

## Por que Railway?

- ✅ Interface mais simples
- ✅ Menos configurações necessárias
- ✅ Detecta Next.js automaticamente
- ✅ Deploy automático a cada push

## ✅ Passo 1: Criar Conta

1. Acesse: https://railway.app
2. Clique em **"Login"**
3. Escolha **"Login with GitHub"**
4. Autorize o Railway

## ✅ Passo 2: Criar Novo Projeto

1. No dashboard, clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Se ainda não conectou GitHub:
   - Clique em **"Configure GitHub App"**
   - Autorize o Railway
4. Selecione o repositório: `agenda-ai-lajinha`
5. Clique em **"Deploy Now"**

## ✅ Passo 3: Adicionar Variáveis de Ambiente

1. No projeto, clique em **"Variables"** (aba lateral)
2. Clique em **"New Variable"**
3. Adicione cada variável do arquivo `env-para-upload.txt`:
   - Nome: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Valor: `AIzaSyDZkm8gi4V_1BMdxR-uegqARttu3QsY1BQ`
   - Clique em **"Add"**
4. Repita para todas as variáveis

**Ou importe de uma vez:**
- Clique em **"Raw Editor"** ou **"Bulk Edit"**
- Cole o conteúdo do `env-para-upload.txt`
- Salve

## ✅ Passo 4: Configurar Domínio (Opcional)

1. No projeto, vá em **"Settings"**
2. Em **"Domains"**, clique em **"Generate Domain"**
3. Ou adicione seu domínio personalizado

## ✅ Pronto!

O Railway fará deploy automaticamente. Você verá:
- ✅ Build em progresso
- ✅ URL de produção gerada
- ✅ Deploy automático a cada push no GitHub

---

## 🔄 Atualizar Variáveis

Sempre que precisar atualizar:
1. Vá em **"Variables"**
2. Edite ou adicione novas variáveis
3. O Railway reinicia automaticamente

---

## 💰 Preço

Railway tem:
- ✅ **Hobby Plan**: $5/mês (500 horas grátis)
- ✅ Plano gratuito para testes

**Para produção**, recomendo Railway ou Vercel (ambos são excelentes).

