# Configurar Vercel para Sempre Usar Produção

## 🎯 Objetivo

Garantir que todos os deploys da branch `main` sejam sempre de **produção**, usando sempre o mesmo domínio: `agenda-ai-lajinha.vercel.app`

## ✅ Passo 1: Verificar Configuração no Vercel Dashboard

### 1.1. Acessar Vercel Dashboard
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **"agenda-ai-lajinha"**

### 1.2. Verificar Branch de Produção
1. Vá em **Settings** > **Git**
2. Verifique se a branch **"main"** está configurada como **Production Branch**
3. Se não estiver, configure:
   - Clique em **"Edit"** ou **"Configure"**
   - Selecione **"main"** como Production Branch
   - Salve as alterações

### 1.3. Verificar Deploy Automático
1. Ainda em **Settings** > **Git**
2. Verifique se **"Automatic deployments from Git"** está ativado
3. Verifique se está configurado para fazer deploy apenas da branch `main` em produção

## ✅ Passo 2: Verificar Deployments

### 2.1. Verificar Tipo de Deploy
1. Vá em **Deployments**
2. Veja a coluna **"Type"** do último deployment:
   - Se for **"Production"** ✅ = Está correto
   - Se for **"Preview"** ❌ = Precisa corrigir

### 2.2. Se o Último Deploy for Preview
1. Clique nos três pontos (⋯) do deployment
2. Selecione **"Promote to Production"**
3. Isso vai promover o preview para produção

## ✅ Passo 3: Adicionar Domínio de Produção no Firebase

Agora que você sabe que sempre será o mesmo domínio, adicione apenas ele no Firebase:

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto **"agendaailajinha"**
3. Vá em **Authentication** > **Settings** > **Authorized domains**
4. Adicione apenas: `agenda-ai-lajinha.vercel.app`
5. Remova os domínios de preview antigos (se quiser)

## ✅ Passo 4: Verificar Configuração do Git

### 4.1. Verificar Branch Atual
```bash
git branch
```

Deve mostrar:
```
* main
```

### 4.2. Sempre Fazer Push para Main
Sempre que fizer alterações, faça push para `main`:

```bash
git add .
git commit -m "Sua mensagem"
git push origin main
```

Isso vai fazer deploy de **produção** automaticamente.

## 🎯 Resultado Esperado

Após configurar:

- ✅ Todos os pushes para `main` = Deploy de **Produção**
- ✅ Sempre o mesmo domínio: `agenda-ai-lajinha.vercel.app`
- ✅ Não precisa adicionar novos domínios no Firebase
- ✅ Deploy automático a cada push

## 📝 Notas Importantes

1. **Deploy de Preview:** Apenas quando você criar Pull Requests ou fizer push para outras branches
2. **Deploy de Produção:** Sempre quando fizer push para `main`
3. **Domínio Fixo:** O domínio de produção sempre será o mesmo

## 🔍 Como Verificar se Está Funcionando

1. Faça um pequeno commit e push:
   ```bash
   git commit --allow-empty -m "Teste deploy produção"
   git push origin main
   ```

2. No Vercel Dashboard, vá em **Deployments**
3. Verifique se o novo deployment tem **Type: Production**
4. Verifique se o domínio é `agenda-ai-lajinha.vercel.app`

## 🆘 Se Ainda Estiver Criando Preview

1. Verifique se você está fazendo push para `main` (não outra branch)
2. Verifique se a branch `main` está configurada como Production no Vercel
3. Promova manualmente o último deployment para produção
4. Verifique se não há configurações de Pull Requests ativadas

