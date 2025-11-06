# Configuração do Login com Google

Este projeto agora suporta login com Google usando o mesmo projeto OAuth do Google que você já usa.

## Passo 1: Obter Credenciais do Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione o projeto que você já usa (mesmo do Firebase)
3. Vá em **APIs e Serviços** → **Credenciais**
4. Se você já tem credenciais OAuth 2.0, use-as
5. Se não, clique em **Criar credenciais** → **ID do cliente OAuth 2.0**

## Passo 2: Configurar URLs de Redirecionamento

No Google Cloud Console, nas credenciais OAuth:

1. Adicione as URLs de redirecionamento autorizadas:
   - **Desenvolvimento**: `http://localhost:3000/api/auth/callback/google`
   - **Produção**: `https://seu-dominio.com/api/auth/callback/google`

## Passo 3: Configurar Variáveis de Ambiente

Adicione ao seu arquivo `.env.local`:

```env
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret
```

**Para produção (Vercel/Netlify):**
- Adicione essas variáveis nas configurações do projeto

## Passo 4: Usar o Login

1. Acesse `/login` no navegador
2. Escolha entre **GitHub** ou **Google**
3. Será redirecionado para o dashboard após autenticação

## Estrutura

- **GitHub**: Login com GitHub (já existente)
- **Google**: Login com Google (novo)
- Ambos salvam o usuário no mesmo banco de dados (Prisma)
- Ambos usam a mesma sessão (NextAuth)

## Notas

- Você pode usar as mesmas credenciais OAuth do Google que já usa em outros projetos
- O NextAuth gerencia automaticamente os callbacks e tokens
- O usuário pode escolher qual provider usar no login

