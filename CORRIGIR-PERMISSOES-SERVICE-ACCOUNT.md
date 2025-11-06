# Como Corrigir Permissões do Service Account

## ❌ Problema

Erro `16 UNAUTHENTICATED` mesmo com Firebase Admin inicializado (`adminDb: ✅`).

Isso significa que o Service Account não tem as permissões corretas no Google Cloud IAM para acessar o Firestore.

## ✅ Solução

### Passo 1: Acessar Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Selecione o projeto: **"agendaailajinha"**

### Passo 2: Ir para IAM & Admin

1. No menu lateral, clique em **"IAM e administração"** (IAM & Admin)
2. Clique em **"IAM"** (ou "Service Accounts" se quiser ir direto)

### Passo 3: Encontrar o Service Account

1. Procure por: `firebase-adminsdk-fbsvc@agendaailajinha.iam.gserviceaccount.com`
2. Ou vá em **"Contas de serviço"** (Service Accounts) e encontre a conta

### Passo 4: Adicionar Permissões

1. Clique na conta de serviço
2. Vá na aba **"PERMISSÕES"** (Permissions)
3. Clique em **"CONCEDER ACESSO"** (Grant Access) ou **"ADICIONAR PRINCÍPAL"** (Add Principal)

### Passo 5: Adicionar Roles Necessárias

Adicione estas roles (uma por vez ou todas de uma vez):

1. **Cloud Datastore User** (ou `roles/datastore.user`)
   - Permite leitura e escrita no Firestore

2. **Firebase Admin SDK Administrator Service Agent** (ou `roles/firebase.adminsdk.adminServiceAgent`)
   - Permite acesso completo ao Firebase Admin SDK

3. **Service Account User** (ou `roles/iam.serviceAccountUser`)
   - Permite usar a conta de serviço

### Passo 6: Salvar

1. Clique em **"SALVAR"** (Save)
2. Aguarde alguns segundos para as permissões serem aplicadas

## 🔍 Verificar Permissões Atuais

Para ver quais permissões a conta já tem:

1. Vá em **IAM e administração** > **IAM**
2. Encontre a conta: `firebase-adminsdk-fbsvc@agendaailajinha.iam.gserviceaccount.com`
3. Veja a coluna **"Funções"** (Roles)

## ⚠️ Permissões Mínimas Necessárias

O Service Account precisa ter pelo menos:

- ✅ **Cloud Datastore User** - Para acessar o Firestore
- ✅ **Firebase Admin SDK Administrator Service Agent** - Para usar o Firebase Admin SDK

## 🚀 Após Adicionar Permissões

1. Aguarde 1-2 minutos para as permissões serem propagadas
2. Faça um novo deploy no Vercel (ou aguarde o próximo)
3. Teste novamente o site
4. O erro `16 UNAUTHENTICATED` deve desaparecer

## 📝 Alternativa: Usar Firebase Console

Se preferir usar o Firebase Console:

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: **"agendaailajinha"**
3. Vá em **Configurações do projeto** (ícone de engrenagem)
4. Vá na aba **"Contas de serviço"**
5. Clique na conta de serviço
6. Verifique as permissões e adicione se necessário

## 🆘 Ainda com Problemas?

Se após adicionar as permissões o erro persistir:

1. Verifique se você adicionou a conta correta
2. Verifique se as permissões foram salvas
3. Aguarde mais tempo para propagação (pode levar até 5 minutos)
4. Verifique os logs no Vercel para ver se há outras mensagens de erro

