# Configuração do Firebase Storage

Este projeto usa o Firebase Storage para armazenar as imagens de perfil dos profissionais.

## Passo 1: Obter as Credenciais do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto existente
3. Vá em **Configurações do Projeto** (ícone de engrenagem)
4. Vá na aba **Contas de serviço**
5. Clique em **Gerar nova chave privada**
6. Baixe o arquivo JSON de credenciais

## Passo 2: Configurar as Credenciais

### Opção A: Arquivo Local (Desenvolvimento)

1. Renomeie o arquivo baixado para `firebase-service-account.json`
2. Coloque na raiz do projeto (mesmo nível do `package.json`)
3. O arquivo já está no `.gitignore` para não ser commitado

### Opção B: Variável de Ambiente (Produção - Recomendado)

1. Abra o arquivo JSON baixado
2. Copie todo o conteúdo
3. Crie uma variável de ambiente `FIREBASE_SERVICE_ACCOUNT` com o conteúdo JSON (como string)
4. Crie uma variável de ambiente `FIREBASE_STORAGE_BUCKET` com o nome do bucket (ex: `seu-projeto.appspot.com`)

**Exemplo para Vercel/Netlify:**
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
```

## Passo 3: Configurar o Storage Bucket

1. No Firebase Console, vá em **Storage**
2. Copie o nome do bucket (geralmente no formato `seu-projeto.appspot.com`)
3. Configure a variável de ambiente `FIREBASE_STORAGE_BUCKET` com esse valor

## Passo 4: Configurar Regras de Segurança (Opcional)

No Firebase Console > Storage > Regras, você pode configurar:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profiles/{fileName} {
      // Permitir leitura pública
      allow read: if true;
      // Permitir escrita apenas para usuários autenticados (ajuste conforme necessário)
      allow write: if request.auth != null;
    }
  }
}
```

## Estrutura de Pastas no Storage

As imagens serão salvas em:
```
profiles/{userId}-{timestamp}.{extensão}
```

## Variáveis de Ambiente Necessárias

- `FIREBASE_SERVICE_ACCOUNT` (opcional se usar arquivo local)
- `FIREBASE_STORAGE_BUCKET` (obrigatório)

