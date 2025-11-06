# 🚀 Deploy Simplificado para Firebase Hosting

## ⚠️ Importante: Limitações

Com `output: "export"`, o Next.js gera um site estático. Isso significa:
- ❌ **API Routes não funcionarão** (incluindo `/api/stripe/*`, `/api/auth/*`)
- ✅ Páginas estáticas funcionam
- ✅ Server Components são pré-renderizados

## 🎯 Opções de Deploy

### Opção 1: Firebase Hosting (Estático) - Atual
- ✅ Mais simples
- ❌ Não suporta API Routes
- ✅ Rápido e barato

### Opção 2: Vercel (Recomendado para Next.js)
- ✅ Suporta tudo (API Routes, Server Components)
- ✅ Configuração automática
- ✅ Deploy com um comando

### Opção 3: Firebase Cloud Run (Avançado)
- ✅ Suporta tudo
- ⚠️ Mais complexo de configurar
- 💰 Pode ter custos

## 📋 Se quiser continuar com Firebase Hosting (estático):

### 1. Build:
```bash
npm run build
```

### 2. Deploy:
```bash
firebase deploy --only hosting
```

### 3. Configurar variáveis de ambiente:
No Firebase Console, configure apenas as variáveis `NEXT_PUBLIC_*` (elas são injetadas no build).

## 🔄 Recomendação: Migrar para Vercel

Para manter todas as funcionalidades (API Routes, Stripe, etc.), recomendo usar Vercel:

### 1. Instalar Vercel CLI:
```bash
npm install -g vercel
```

### 2. Deploy:
```bash
vercel
```

### 3. Configurar variáveis:
```bash
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY
# ... adicionar todas as variáveis
```

### 4. Deploy de produção:
```bash
vercel --prod
```

## 🤔 Qual escolher?

- **Se precisa de API Routes (Stripe, Auth)**: Use **Vercel**
- **Se o site é totalmente estático**: Use **Firebase Hosting**

Quer que eu configure para Vercel ou prefere ajustar o Firebase para Cloud Run?

