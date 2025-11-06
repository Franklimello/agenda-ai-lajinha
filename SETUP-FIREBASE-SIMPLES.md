# Setup Firebase - Forma Simples

## Opção 1: Firebase CLI (Mais Fácil)

1. Execute no terminal (na raiz do projeto):
```bash
firebase login
firebase use agendaailajinha
firebase init
```

2. Quando perguntar o que configurar, escolha:
   - Firestore
   - Storage
   - Functions (opcional)

3. O Firebase CLI vai criar tudo automaticamente!

## Opção 2: Firebase Console (Direto)

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto **agendaailajinha**
3. Clique no **ícone de engrenagem** (Configurações do projeto)
4. Vá na aba **"Geral"**
5. Role até a seção **"Seus aplicativos"**
6. Procure por **"SDK Admin"** ou **"Service accounts"**
7. Clique em **"Gerar nova chave privada"**
8. Baixe o arquivo JSON
9. Renomeie para `firebase-service-account.json`
10. Coloque na raiz do projeto

## Opção 3: Usar o projeto que já tem Service Account

Se você já tem outros projetos Firebase funcionando, pode:
- Copiar o `firebase-service-account.json` de outro projeto
- Ou usar as mesmas credenciais (só mudar o projectId)

## Qual você prefere?

Me diga qual opção você quer tentar e eu te guio passo a passo!

