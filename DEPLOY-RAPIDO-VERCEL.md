# 🚀 Deploy Rápido no Vercel (Interface Web)

## ✅ Passo 1: Conectar Repositório

1. Acesse: https://vercel.com/new
2. Faça login com GitHub
3. Clique em **"Import Git Repository"**
4. Selecione: `Franklimello/agenda-ai-lajinha`
5. Clique em **"Import"**

## ✅ Passo 2: Configurar Projeto

**NÃO clique em "Deploy" ainda!**

Primeiro, configure as variáveis de ambiente:

### 2.1. Abrir Configurações de Variáveis

1. Antes de fazer deploy, clique em **"Settings"** (ou no ícone de engrenagem)
2. Vá em **"Environment Variables"**
3. Clique em **"Add New"**

### 2.2. Importar Arquivo .env

**Opção Mais Fácil:**
1. Abra o arquivo `env-para-upload.txt` da sua área de trabalho
2. Copie **TODO** o conteúdo
3. No Vercel, procure por **"Import .env file"** ou **"Bulk Add"**
4. Cole o conteúdo
5. Marque todas: ✅ Production, ✅ Preview, ✅ Development
6. Clique em **"Save"**

**Se não tiver opção de importar:**
- Adicione cada variável manualmente (uma por uma)

## ✅ Passo 3: Fazer Deploy

1. Volte para a aba **"Deployments"**
2. Clique em **"Deploy"** (ou faça um novo commit no GitHub)
3. Aguarde o build completar

## ✅ Passo 4: Após Primeiro Deploy

1. Copie a URL do projeto (ex: `https://agenda-ai-lajinha.vercel.app`)
2. Vá em **Settings** > **Environment Variables**
3. Adicione: `NEXT_PUBLIC_APP_URL` = URL do projeto
4. Faça um novo deploy (ou aguarde o próximo commit)

---

## 🎯 Alternativa: Railway (Ainda Mais Simples)

Se quiser algo ainda mais fácil:

1. Acesse: https://railway.app
2. Faça login com GitHub
3. Clique em **"New Project"** > **"Deploy from GitHub repo"**
4. Selecione o repositório
5. Railway detecta Next.js automaticamente
6. Adicione as variáveis de ambiente na interface
7. Pronto! Deploy automático

**Vantagens do Railway:**
- ✅ Interface mais simples
- ✅ Menos configurações
- ✅ Deploy ainda mais rápido

---

## 📝 Nota Importante

O Vercel é **a melhor opção** para Next.js, mas se estiver tendo muitos problemas, o Railway pode ser uma alternativa mais tranquila.

