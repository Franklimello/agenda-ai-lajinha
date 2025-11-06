# Como Obter Service Account do Firebase

## Método 1: Google Cloud Console (Mais Direto)

1. Acesse: https://console.cloud.google.com/
2. Certifique-se de que o projeto **"agendaailajinha"** está selecionado no topo
3. No menu lateral esquerdo, vá em:
   **"IAM e administração" → "Contas de serviço"**
4. Clique no botão **"+ CRIAR CONTA DE SERVIÇO"** (no topo)
5. Preencha:
   - **Nome da conta de serviço**: `firebase-admin`
   - **ID da conta de serviço**: deixe o padrão
   - Clique em **"CRIAR E CONTINUAR"**
6. Em **"Conceder acesso a este serviço"**, selecione:
   - Role: **"Firebase Admin SDK Administrator Service"**
   - Clique em **"CONTINUAR"**
7. Clique em **"CONCLUÍDO"**
8. Na lista de contas de serviço, clique na que você acabou de criar
9. Vá na aba **"CHAVES"**
10. Clique em **"ADICIONAR CHAVE" → "Criar nova chave"**
11. Escolha **"JSON"** e clique em **"CRIAR"**
12. O arquivo será baixado automaticamente
13. Renomeie para `firebase-service-account.json`
14. Coloque na **raiz do projeto** (mesmo nível do `package.json`)

## Método 2: Firebase Console (Alternativo)

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto **"agendaailajinha"**
3. Clique no **ícone de engrenagem** (Configurações do projeto)
4. Vá na aba **"Contas de serviço"** (pode estar em "Geral" ou "Usuários e permissões")
5. Se não aparecer, use o **Método 1** acima

## Método 3: Via Firebase CLI

Se você tiver o Firebase CLI instalado:

```bash
firebase login
firebase projects:list
firebase use agendaailajinha
firebase init
```

Depois, nas configurações, escolha "Firestore" e "Storage".

## Verificação

Após baixar o arquivo, verifique se ele contém:
- `type: "service_account"`
- `project_id: "agendaailajinha"`
- `private_key`
- `client_email`

Se tiver esses campos, está correto!

## Importante

- O arquivo `firebase-service-account.json` **NÃO deve** ser commitado no Git
- Ele já está no `.gitignore`
- Mantenha-o seguro e nunca compartilhe

