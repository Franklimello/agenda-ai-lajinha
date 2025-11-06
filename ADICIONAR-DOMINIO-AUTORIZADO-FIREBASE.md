# Como Adicionar Domínio Autorizado no Firebase

## Problema
Se você está recebendo o erro:
```
Firebase: Error (auth/unauthorized-domain)
The current domain is not authorized for OAuth operations.
```

Isso significa que o domínio do seu site (ex: `agenda-ai-lajinha-r6zv51pys.vercel.app`) não está autorizado no Firebase.

## Solução: Adicionar Domínio no Firebase Console

### Passo 1: Acessar o Firebase Console
1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto **"agendaailajinha"**

### Passo 2: Ir para Authentication
1. No menu lateral esquerdo, clique em **"Authentication"** (Autenticação)
2. Clique na aba **"Settings"** (Configurações) no topo
3. Role até a seção **"Authorized domains"** (Domínios autorizados)

### Passo 3: Adicionar Domínios
1. Clique no botão **"Add domain"** (Adicionar domínio)
2. Adicione os seguintes domínios:

#### Domínios do Vercel:
- `agenda-ai-lajinha-d2omnxyzg.vercel.app` (domínio de preview atual)
- `agenda-ai-lajinha-r6zv51pys.vercel.app` (domínio de preview anterior)
- `agenda-ai-lajinha.vercel.app` (domínio de produção, se aplicável)
- `*.vercel.app` (para aceitar todos os subdomínios do Vercel - **RECOMENDADO**)

#### Domínio de Produção (se tiver):
- Seu domínio customizado (ex: `seusite.com`)

#### Domínio Local (para desenvolvimento):
- `localhost` (já deve estar adicionado por padrão)

### Passo 4: Salvar
1. Clique em **"Add"** (Adicionar) para cada domínio
2. Os domínios serão adicionados imediatamente

## Domínios Padrão
Por padrão, o Firebase já autoriza:
- `localhost`
- Domínios do Firebase Hosting

## Verificação
Após adicionar os domínios:
1. Aguarde alguns segundos para a propagação
2. Recarregue a página do seu site
3. Tente fazer login novamente
4. O erro `auth/unauthorized-domain` deve desaparecer

## Importante
- Cada domínio precisa ser adicionado separadamente
- Domínios com subdomínios diferentes precisam ser adicionados separadamente (ex: `app.vercel.app` e `www.vercel.app`)
- Mudanças são aplicadas imediatamente, mas pode levar alguns segundos para propagar

## Troubleshooting

### Se o erro persistir:
1. Verifique se você adicionou o domínio correto (copie exatamente do erro)
2. Limpe o cache do navegador
3. Aguarde 1-2 minutos e tente novamente
4. Verifique se não há espaços extras no domínio adicionado

### Para encontrar o domínio exato:
1. Abra o console do navegador (F12)
2. Procure pela mensagem de erro
3. O domínio exato estará na mensagem de erro

## Exemplo de Domínios para Adicionar

Se seu site está em:
- Preview: `agenda-ai-lajinha-r6zv51pys.vercel.app`
- Produção: `agenda-ai-lajinha.vercel.app` ou seu domínio customizado

Adicione todos eles no Firebase Console.

