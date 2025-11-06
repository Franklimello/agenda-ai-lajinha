# Como Encontrar a Role Correta para Firestore

## 🔍 Problema

Não encontrou "Cloud Datastore User" na busca.

## ✅ Soluções

### Opção 1: Procurar por "Datastore" (sem "Cloud")

1. No campo de busca, digite apenas: `Datastore`
2. Procure por:
   - **"Usuário do Datastore"**
   - **"Datastore User"**
   - **"Datastore"**

### Opção 2: Procurar por "Firestore"

1. No campo de busca, digite: `Firestore`
2. Procure por:
   - **"Firestore"**
   - **"Cloud Firestore"**
   - Qualquer role relacionada a Firestore

### Opção 3: Usar o ID Técnico da Role

1. No campo de busca, digite: `datastore.user`
2. Ou digite: `roles/datastore.user`
3. Isso deve encontrar a role mesmo que o nome esteja em português

### Opção 4: Procurar por Categorias

1. Na lista de roles, procure pela categoria:
   - **"Cloud Datastore"**
   - **"Firestore"**
   - **"Database"**

### Opção 5: Ver Todas as Roles Disponíveis

1. Vá em **"IAM e administração"** > **"Funções"** (Roles)
2. Procure por roles relacionadas a:
   - Datastore
   - Firestore
   - Database

## 🎯 Role Correta

A role que você precisa é:
- **Nome em inglês:** `Cloud Datastore User`
- **Nome em português:** `Usuário do Cloud Datastore`
- **ID técnico:** `roles/datastore.user`

## 💡 Dica

Se ainda não encontrar, tente:
1. Limpar o campo de busca
2. Digitar apenas: `user` (pode aparecer na lista)
3. Ou digitar: `datastore` (sem "Cloud")

## 🔄 Alternativa: Usar Firebase Console

Se não conseguir pelo Google Cloud Console, tente pelo Firebase Console:

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: **"agendaailajinha"**
3. Vá em **Configurações do projeto** (ícone de engrenagem)
4. Vá na aba **"Contas de serviço"**
5. Clique na conta de serviço
6. Verifique se há opção para adicionar permissões

## ⚠️ Importante

A role `Cloud Datastore User` é necessária para que o Firebase Admin SDK possa acessar o Firestore. Sem ela, você continuará recebendo o erro `16 UNAUTHENTICATED`.

