# Configuração do Login com Google - Passo a Passo

## Passo 1: Obter Client ID e Client Secret

1. No Google Cloud Console, clique em **"Web client (auto created by Google Service)"**
2. Você verá:
   - **Client ID**: `821962501479-62l3...` (copie o ID completo)
   - **Client Secret**: Clique em **"Mostrar"** para ver o secret
3. Copie ambos os valores

## Passo 2: Configurar URLs de Redirecionamento

No mesmo lugar onde você viu o Client ID e Secret:

1. Vá na seção **"URIs de redirecionamento autorizados"**
2. Clique em **"+ ADICIONAR URI"**
3. Adicione as seguintes URLs:

   **Desenvolvimento (localhost):**
   ```
   http://localhost:3000/api/auth/callback/google
   ```

   **Produção (seu domínio):**
   ```
   https://seu-dominio.com/api/auth/callback/google
   ```

4. Clique em **"SALVAR"**

## Passo 3: Configurar Variáveis de Ambiente

Crie ou edite o arquivo `.env.local` na raiz do projeto:

```env
# Google OAuth (use o Web client que você já tem)
GOOGLE_CLIENT_ID=821962501479-62l3xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx

# Firebase Storage (se já configurou)
FIREBASE_STORAGE_BUCKET=compreaqui-324df.appspot.com
```

**Importante:**
- Substitua `62l3xxxxxxxxxxxx` pelo Client ID completo
- Substitua `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx` pelo Client Secret completo
- O Client ID termina com `.apps.googleusercontent.com`
- O Client Secret começa com `GOCSPX-`

## Passo 4: Verificar se está Funcionando

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse: `http://localhost:3000/login`
3. Clique em "Entrar com Google"
4. Deve abrir a tela de autenticação do Google
5. Após autenticar, você será redirecionado para `/dashboard`

## Estrutura das Credenciais

Você já tem:
- ✅ **Web client** criado (pode usar este)
- ✅ **Contas de serviço** do Firebase (para Storage)

**Não precisa criar nada novo!** Só configurar as variáveis de ambiente.

## Notas Importantes

1. **Mesmo projeto**: Você está usando o mesmo projeto Google Cloud para:
   - Firebase Storage (fotos de perfil)
   - Google OAuth (login)
   - Isso é perfeito e recomendado!

2. **URLs de redirecionamento**: O NextAuth precisa das URLs exatas acima. Se não configurar, o login não funcionará.

3. **Segurança**: Nunca commite o arquivo `.env.local` no Git (já está no `.gitignore`)

## Troubleshooting

**Erro: "redirect_uri_mismatch"**
→ Verifique se adicionou a URL correta: `http://localhost:3000/api/auth/callback/google`

**Erro: "invalid_client"**
→ Verifique se o Client ID e Secret estão corretos no `.env.local`

**Não redireciona após login**
→ Verifique se a URL de redirecionamento está correta no Google Cloud Console

