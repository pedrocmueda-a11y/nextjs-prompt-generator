# PromptGen - Gerador de Prompts Estruturados para Equipes de IA

Sistema completo para transformar requisitos de projetos em prompts estruturados que sua equipe de 12 agentes de IA pode entender e executar.

## 🚀 Funcionalidades

- **Landing Page** - Apresentação da empresa e produto
- **Autenticação** - NextAuth v5 com credentials (email/senha)
- **Dashboard do Cliente** - Histórico de prompts, status, visualização e cópia
- **Formulário de Geração** - Coleta completa de requisitos do projeto
- **Geração de Prompt Estruturado** - Formato otimizado para 12 agentes especializados
- **Dark Mode** - Suporte completo com next-themes
- **Banco de Dados** - Prisma com SQLite (dev) / PostgreSQL (prod)

## 📋 Estrutura do Prompt Gerado

O prompt inclui:
1. **Contexto da Empresa e Problema** - Descrição, público-alvo, referências
2. **Requisitos Técnicos** - Stack, tipo de projeto, funcionalidades, integrações
3. **User Stories** - Histórias de usuário específicas por tipo de projeto
4. **Critérios de Aceitação** - Checklist completo (performance, segurança, acessibilidade, etc.)
5. **Arquitetura Sugerida** - Diagramas e decisões técnicas por tipo de projeto
6. **Stack Tecnológica Recomendada** - Frontend, Backend, DevOps, Específico do projeto
7. **Timeline e Entregas** - Fases sugeridas com duração e tarefas
8. **Checklist Técnico** - 14 itens obrigatórios
9. **Riscos e Considerações** - Riscos identificados com mitigações
10. **Próximos Passos** - Ações imediatas para iniciar

## 🛠 Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: NextAuth.js v5
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **Forms**: React Hook Form + Zod
- **Theme**: next-themes
- **Notifications**: Sonner (toasts)

## 📦 Instalação

```bash
# Clone o repositório
cd nextjs-prompt-generator

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# Configure o banco de dados
npm run db:push

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🗄 Banco de Dados

### Desenvolvimento (SQLite)
```bash
npm run db:push    # Sincroniza schema com banco
npm run db:studio  # Abre Prisma Studio
```

### Produção (PostgreSQL)
1. Configure `DATABASE_URL` no `.env` para PostgreSQL
2. Execute `npm run db:push` ou use migrações:
   ```bash
   npx prisma migrate deploy
   ```

## 🔐 Autenticação

O sistema usa **NextAuth v5** com provider **Credentials**:
- Login com email/senha
- Registro de novos usuários
- Sessão JWT com 30 dias
- Middleware de proteção de rotas

### Adicionar OAuth (opcional)
Edite `src/lib/auth.ts` e adicione providers:
```typescript
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

providers: [
  Credentials({...}),
  GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }),
  Google({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET }),
]
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth endpoints
│   │   ├── generate-prompt/        # Gera prompt estruturado
│   │   └── prompts/                # CRUD de prompts do usuário
│   ├── dashboard/                  # Dashboard protegido
│   ├── formulario/                 # Formulário de geração
│   ├── login/                      # Login/Cadastro
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   └── globals.css                 # Estilos globais
├── components/
│   ├── ui/                         # Componentes shadcn/ui
│   ├── header.tsx                  # Header com navegação
│   ├── footer.tsx                  # Footer
│   └── providers.tsx               # Providers (Auth, Theme, Toast)
├── lib/
│   ├── auth.ts                     # Configuração NextAuth
│   ├── prisma.ts                   # Cliente Prisma
│   ├── prompt-generator.ts         # Lógica de geração de prompt
│   ├── utils.ts                    # Utilitários (cn)
│   └── validations.ts              # Schemas Zod
└── middleware.ts                   # Proteção de rotas
```

## 🎯 Tipos de Projeto Suportados

| Tipo | Label | Descrição |
|------|-------|-----------|
| `WEBSITE` | Site Institucional | Sites estáticos, blogs, portfólios |
| `WEB_APP` | Aplicação Web | SaaS, plataformas, sistemas complexos |
| `DASHBOARD` | Dashboard/Admin | Painéis administrativos, analytics |
| `LANDING_PAGE` | Landing Page | Campanhas, lançamento de produtos |
| `ECOMMERCE` | E-commerce | Lojas virtuais, marketplaces |
| `API` | API/Backend | REST, GraphQL, tRPC, microserviços |
| `MOBILE_APP` | App Mobile | React Native, Flutter, nativo |
| `OTHER` | Outro | Projetos personalizados |

## 📝 Formulário - Campos

- **Tipo de Projeto** (select) - Obrigatório
- **Título** (input) - Obrigatório, 5-100 chars
- **Descrição** (textarea) - Obrigatório, 50-5000 chars
- **Público-Alvo** (textarea) - Obrigatório, 10-1000 chars
- **Stack Preferida** (input) - Opcional
- **Urgência** (select) - Obrigatório: Baixa/Média/Alta/Crítica
- **Orçamento** (input) - Opcional
- **Prazo** (input) - Opcional
- **Funcionalidades** (multi-select) - 18 opções pré-definidas
- **Integrações** (multi-select) - 20 opções pré-definidas
- **Referências** (URL list) - Opcional
- **Observações** (textarea) - Opcional, 2000 chars

## 🎨 Temas

- **Light Mode** - Padrão do sistema
- **Dark Mode** - Alternável via botão no header
- **System** - Segue preferência do OS

## 📱 Responsividade

- Mobile-first design
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Navegação mobile com menu hambúrguer

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório no Vercel
2. Configure variáveis de ambiente:
   - `DATABASE_URL` (PostgreSQL - Neon, Supabase, Railway, etc.)
   - `AUTH_SECRET` (gere com `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (sua URL de produção)
3. Deploy automático

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento
npm run build      # Build de produção
npm run start      # Inicia produção
npm run lint       # ESLint
npm run db:push    # Sincroniza schema Prisma
npm run db:studio  # Prisma Studio
```

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

Desenvolvido com ❤️ para equipes que usam IA no desenvolvimento de software.