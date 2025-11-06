# Como Funcionam os Domínios no Vercel

## 📋 Tipos de Deploy no Vercel

### 1. Deploy de Produção
- **Domínio:** Sempre o mesmo (ex: `agenda-ai-lajinha.vercel.app`)
- **Quando:** Quando você faz push para a branch `main` (ou branch de produção configurada)
- **Domínio fixo:** Não muda

### 2. Deploy de Preview
- **Domínio:** Novo a cada PR ou branch
- **Quando:** Quando você cria um Pull Request ou faz push para uma branch diferente de `main`
- **Domínio dinâmico:** Muda a cada PR/branch

## 🎯 O que está acontecendo

Se você está vendo domínios diferentes a cada deploy, pode ser porque:

1. **Você está fazendo deploy de preview** (não de produção)
2. **Você está fazendo push para branches diferentes**
3. **Você está criando Pull Requests**

## ✅ Solução: Usar Domínio de Produção

### Opção 1: Fazer Deploy de Produção

Quando você faz push para a branch `main`, o Vercel faz deploy de **produção** que usa sempre o mesmo domínio:
- `agenda-ai-lajinha.vercel.app` (ou seu domínio customizado)

### Opção 2: Adicionar Domínio Customizado

Você pode adicionar um domínio customizado no Vercel:

1. No Vercel Dashboard, vá em **Settings** > **Domains**
2. Adicione seu domínio (ex: `agendaailajinha.com`)
3. Configure o DNS conforme instruções
4. Adicione esse domínio no Firebase Console
5. **Pronto!** Sempre será o mesmo domínio

### Opção 3: Adicionar Wildcard no Firebase (NÃO FUNCIONA)

O Firebase **NÃO aceita wildcards** como `*.vercel.app`. Você precisa adicionar cada domínio manualmente.

## 💡 Recomendação

### Para Desenvolvimento/Teste:
- Use o domínio de **produção** (`agenda-ai-lajinha.vercel.app`)
- Adicione apenas esse domínio no Firebase
- Sempre faça push para `main` para usar o mesmo domínio

### Para Produção:
- Adicione um **domínio customizado** no Vercel
- Adicione esse domínio no Firebase
- Use sempre esse domínio

## 🔍 Como Verificar Qual Tipo de Deploy

No Vercel Dashboard:
1. Vá em **Deployments**
2. Veja a coluna **"Type"**:
   - **"Production"** = Domínio fixo
   - **"Preview"** = Domínio dinâmico (muda)

## 📝 Resumo

- **Deploy de Produção** = Sempre o mesmo domínio ✅
- **Deploy de Preview** = Novo domínio a cada PR/branch ❌
- **Solução:** Use sempre deploy de produção ou adicione domínio customizado

