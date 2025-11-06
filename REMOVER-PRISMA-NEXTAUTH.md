# Plano para Remover Prisma e NextAuth

## 🎯 Objetivo

Remover completamente Prisma e NextAuth, usando apenas Firebase Auth (que já está funcionando).

## 📋 O que precisa ser feito

### 1. Remover NextAuth do código

**Arquivos para modificar:**

1. **`src/lib/auth.ts`** - Remover completamente (não é mais necessário)
2. **`src/app/api/auth/[...nextauth]/route.ts`** - Remover (não é mais necessário)
3. **`src/components/session-ajth.tsx`** - Remover ou substituir
4. **`src/app/(painel)/dashboard/profile/_components/profile.tsx`** - Substituir `useSession` do NextAuth por Firebase Auth
5. **`src/app/(painel)/dashboard/_components/sidebar.tsx`** - Substituir `useSession` do NextAuth por Firebase Auth

### 2. Substituir `useSession` do NextAuth

**Onde está sendo usado:**
- `src/app/(painel)/dashboard/profile/_components/profile.tsx`
- `src/app/(painel)/dashboard/_components/sidebar.tsx`

**Substituir por:**
- `useFirebaseSession()` de `@/lib/use-firebase-session`

### 3. Remover Prisma

**Arquivos para remover:**
- `prisma/` (pasta inteira)
- `src/lib/prisma.ts`
- `src/generated/prisma/` (pasta inteira)

**Dependências para remover do `package.json`:**
- `@auth/prisma-adapter`
- `@prisma/client`
- `prisma` (devDependencies)

### 4. Remover SessionProvider do NextAuth

**Arquivo:** `src/app/layout.tsx`
- Remover `SessionAuthProvider` se estiver sendo usado
- Já deve estar usando `FirebaseAuthProvider`

## ✅ Benefícios

1. **Menos dependências** - Remove Prisma e NextAuth
2. **Menos erros** - Não precisa configurar PostgreSQL
3. **Mais simples** - Usa apenas Firebase (já está funcionando)
4. **Melhor performance** - Menos código para carregar

## 🚀 Próximos Passos

Vou fazer essas mudanças agora. Quer que eu continue?

