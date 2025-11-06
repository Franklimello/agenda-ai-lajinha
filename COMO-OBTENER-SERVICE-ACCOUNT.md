# Como Obter o Service Account do Firebase

## Método Mais Simples (Google Cloud Console)

1. **Acesse**: https://console.cloud.google.com/
2. **Selecione o projeto**: "agendaailajinha" (no topo)
3. **Menu lateral**: Clique em **"IAM e administração"** → **"Contas de serviço"**
4. **Criar conta**: Clique em **"+ CRIAR CONTA DE SERVIÇO"**
5. **Preencha**:
   - Nome: `firebase-admin`
   - Clique em **"CRIAR E CONTINUAR"**
6. **Permissões**: Selecione **"Editor"** (ou "Firebase Admin SDK Administrator" se aparecer)
7. **Clique em "CONTINUAR"** e depois **"CONCLUÍDO"**
8. **Na lista**, clique na conta que você criou
9. **Aba "CHAVES"**: Clique em **"ADICIONAR CHAVE"** → **"Criar nova chave"**
10. **Escolha "JSON"** e clique em **"CRIAR"**
11. **O arquivo será baixado** automaticamente
12. **Renomeie** para `firebase-service-account.json`
13. **Coloque na raiz do projeto** (mesmo nível do `package.json`)

## Estrutura do Arquivo

O arquivo deve ter esta estrutura:
```json
{
  "type": "service_account",
  "project_id": "agendaailajinha",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@agendaailajinha.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

## Verificação

Após adicionar o arquivo:
1. Reinicie o servidor: `npm run dev`
2. O erro deve desaparecer
3. Você verá logs normais (sem avisos sobre Firebase)

## Importante

- ✅ O arquivo está no `.gitignore` (não será commitado)
- ✅ Mantenha-o seguro
- ✅ Nunca compartilhe o arquivo

