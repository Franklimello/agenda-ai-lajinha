# Como Configurar Regras do Firestore

## Passo a Passo

1. **Acesse o Firebase Console**: https://console.firebase.google.com/
2. **Selecione o projeto**: "agendaailajinha"
3. **No menu lateral**, clique em **"Firestore Database"**
4. **Clique na aba "Regras"** (Rules)
5. **Cole o seguinte código**:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Permitir tudo temporariamente (apenas para desenvolvimento)
      allow read, write: if true;
    }
  }
}
```

6. **Clique em "PUBLICAR"** (Publish)

## ⚠️ Importante

Essas regras permitem **TUDO** (leitura e escrita) para **QUALQUER UM**, sem autenticação.

**Isso é apenas para desenvolvimento/teste!**

Para produção, você deve usar regras mais restritivas como:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true; // Público pode ler
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /appointments/{appointmentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /reminders/{reminderId} {
      allow read, write: if request.auth != null;
    }
    match /subscriptions/{subscriptionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Após Configurar

Depois de publicar as regras, você pode:
- ✅ Criar serviços
- ✅ Criar agendamentos
- ✅ Criar lembretes
- ✅ Atualizar perfil
- ✅ Tudo funcionará!

