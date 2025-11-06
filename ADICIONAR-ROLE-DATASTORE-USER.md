# Como Adicionar a Role "Cloud Datastore User"

## ✅ O que você já tem

O Service Account `firebase-adminsdk-fbsvc@agendaailajinha.iam.gserviceaccount.com` já tem:
- ✅ Administrador de armazenamento
- ✅ Administrador do Cloud Functions
- ✅ Administrador do Firebase Authentication
- ✅ Agente de serviço administrador do SDK Admin do Firebase
- ✅ Criador do token da conta de serviço

## ❌ O que está faltando

- ❌ **Cloud Datastore User** - Necessária para acessar o Firestore

## 🔧 Como Adicionar

### Passo 1: Editar o Service Account

Na tela que você está vendo:

1. Clique no **ícone de lápis (✏️)** ao lado do Service Account `firebase-adminsdk-fbsvc@agendaailajinha.iam.gserviceaccount.com`
2. Ou clique no **nome do Service Account** para abrir os detalhes

### Passo 2: Adicionar a Role

1. Na página de detalhes, você verá uma seção de **"Papéis"** (Roles)
2. Clique em **"ADICIONAR PAPEL"** ou **"GRANT ACCESS"**
3. No campo de busca, digite: `Cloud Datastore User`
4. Selecione a role: **"Usuário do Cloud Datastore"** ou **"Cloud Datastore User"**
5. Clique em **"SALVAR"** (Save)

### Passo 3: Alternativa - Usar o Botão "Permitir acesso"

Se preferir usar o botão no topo:

1. Clique no botão **"+ Permitir acesso"** (Grant access) no topo da página
2. No campo **"Novos principais"** (New principals), digite: `firebase-adminsdk-fbsvc@agendaailajinha.iam.gserviceaccount.com`
3. No campo **"Selecionar uma função"** (Select a role), procure por: **"Cloud Datastore User"** ou **"Usuário do Cloud Datastore"**
4. Clique em **"SALVAR"** (Save)

## 🔍 Nome da Role em Português

A role pode aparecer como:
- **"Usuário do Cloud Datastore"** (português)
- **"Cloud Datastore User"** (inglês)
- **`roles/datastore.user`** (ID técnico)

Todas são a mesma role!

## ✅ Após Adicionar

1. Aguarde 1-2 minutos para as permissões serem propagadas
2. O erro `16 UNAUTHENTICATED` deve desaparecer
3. O site deve funcionar corretamente

## 🎯 Verificação

Após adicionar, você deve ver a role **"Usuário do Cloud Datastore"** ou **"Cloud Datastore User"** na lista de papéis do Service Account.

