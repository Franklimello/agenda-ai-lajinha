# Guia de Migração para Firebase

## ✅ O que já foi feito

1. **Firebase Auth configurado** - Login com Google funcionando
2. **Firestore helpers criados** - Funções para trabalhar com Firestore
3. **API de autenticação** - `/api/auth/firebase` para criar sessões
4. **Componente de login** - Substituído para usar Firebase Auth

## 📋 Próximos Passos (Faltam)

### 1. Substituir Prisma por Firestore nas funções

Você precisa migrar todas as funções que usam `prisma` para usar `firestore`:

**Arquivos que precisam ser migrados:**
- `src/app/(painel)/dashboard/profile/_data-access/get-info-user.ts`
- `src/app/(painel)/dashboard/service/_actions/service-actions.ts`
- `src/app/(painel)/dashboard/_actions/appointment-actions.ts`
- `src/app/(painel)/dashboard/_actions/reminder-actions.ts`
- `src/app/(painel)/dashboard/plans/_data-access/get-plans.ts`
- `src/app/(painel)/dashboard/_data-access/get-dashboard-stats.ts`
- `src/app/(painel)/dashboard/profile/_actions/update-profile.ts`
- `src/app/(public)/profissional/[id]/_data-access/get-professional-data.ts`
- `src/app/(public)/_data-access/get-professionals.ts`
- `src/app/(public)/agendar/_actions/create-public-appointment.ts`
- `src/app/(public)/agendar/_actions/get-occupied-times.ts`
- `src/app/(public)/agendar/_actions/get-available-dates.ts`

### 2. Estrutura de dados no Firestore

As coleções serão:
- `users` - Dados dos usuários
- `services` - Serviços oferecidos
- `appointments` - Agendamentos
- `reminders` - Lembretes
- `subscriptions` - Assinaturas

### 3. Migrar dados existentes (se houver)

Se você já tem dados no PostgreSQL, precisa criar um script para migrar:
- Exportar dados do PostgreSQL
- Importar para Firestore

### 4. Atualizar componentes client-side

Componentes que usam `useSession` do NextAuth precisam ser atualizados para usar Firebase Auth.

## 🔧 Como usar Firestore

### Exemplo de leitura:
```typescript
import { getDocument, getDocuments } from "@/lib/firestore";
import { COLLECTIONS } from "@/lib/firestore";

// Buscar um usuário
const user = await getDocument(COLLECTIONS.users, userId);

// Buscar todos os serviços de um usuário
const services = await getDocuments(COLLECTIONS.services, [
  { field: "userId", operator: "==", value: userId }
]);
```

### Exemplo de escrita:
```typescript
import { createDocument, updateDocument } from "@/lib/firestore";

// Criar serviço
const service = await createDocument(COLLECTIONS.services, {
  name: "Consulta",
  price: 100,
  duration: 30,
  status: true,
  userId: userId,
});

// Atualizar serviço
await updateDocument(COLLECTIONS.services, serviceId, {
  price: 150,
});
```

## ⚠️ Importante

1. **Firestore não tem relações** - Você precisa usar IDs e fazer queries separadas
2. **Timestamps** - Use `serverTimestamp()` ou `dateToTimestamp()` helper
3. **Subcollections** - Pode usar subcollections se necessário (ex: `users/{userId}/services/{serviceId}`)

## 🚀 Testar

1. Adicione o `firebase-service-account.json` na raiz
2. Configure as regras do Firestore e Storage no Firebase Console
3. Teste o login em `/login`
4. Migre uma função por vez testando

