type ProjectTypeValue = 'WEBSITE' | 'WEB_APP' | 'DASHBOARD' | 'LANDING_PAGE' | 'ECOMMERCE' | 'API' | 'MOBILE_APP' | 'OTHER'
type UrgencyValue = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

interface FormData {
  projectType: ProjectTypeValue
  title: string
  description: string
  targetAudience: string
  preferredStack?: string
  urgency: UrgencyValue
  estimatedBudget?: string
  timeline?: string
  features: string[]
  integrations: string[]
  references: string[]
  additionalNotes?: string
}

interface PromptRecord {
  projectType: string
  title: string
  description: string
  targetAudience: string
  preferredStack: string | null
  urgency: string
  estimatedBudget: string | null
  timeline: string | null
  features: string
  integrations: string
  references: string
  additionalNotes: string | null
}

const PROJECT_TYPE_LABELS: Record<ProjectTypeValue, string> = {
  WEBSITE: 'Site Institucional',
  WEB_APP: 'Aplicação Web',
  DASHBOARD: 'Dashboard/ Painel Administrativo',
  LANDING_PAGE: 'Landing Page',
  ECOMMERCE: 'E-commerce',
  API: 'API/ Backend',
  MOBILE_APP: 'Aplicativo Mobile',
  OTHER: 'Outro',
}

const URGENCY_LABELS: Record<UrgencyValue, string> = {
  LOW: 'Baixa (Flexível)',
  MEDIUM: 'Média (2-4 semanas)',
  HIGH: 'Alta (1-2 semanas)',
  CRITICAL: 'Crítica (Imediato)',
}

const COMMON_FEATURES = [
  'Autenticação de usuários',
  'Painel administrativo',
  'Sistema de pagamentos',
  'Notificações (email/push)',
  'Chat/ Mensageria',
  'Relatórios e Analytics',
  'Sistema de permissões/roles',
  'Upload de arquivos',
  'Busca avançada',
  'Internacionalização (i18n)',
  'Modo offline/PWA',
  'Webhooks',
  'Agendamento de tarefas',
  'Logs de auditoria',
  'Cache/ Redis',
  'Testes automatizados',
  'CI/CD Pipeline',
  'Documentação Swagger/OpenAPI',
]

const COMMON_INTEGRATIONS = [
  'Stripe/ Pagamentos',
  'SendGrid/ Email',
  'Twilio/ SMS',
  'Firebase/ Auth',
  'AWS S3/ Storage',
  'Google Analytics',
  'Mixpanel/ Amplitude',
  'Sentry/ Error Tracking',
  'Slack/ Teams Notifications',
  'GitHub/ GitLab Webhooks',
  'Zapier/ Make',
  'HubSpot/ CRM',
  'Shopify',
  'WhatsApp Business API',
  'OpenAI/ LLMs',
  'PostgreSQL/ MySQL',
  'MongoDB',
  'Redis',
  'Elasticsearch',
  'Kafka/ RabbitMQ',
  'Docker/ Kubernetes',
]

export function generateStructuredPrompt(formData: FormData): string {
  const projectTypeLabel = PROJECT_TYPE_LABELS[formData.projectType]
  const urgencyLabel = URGENCY_LABELS[formData.urgency]
  const timestamp = new Date().toISOString()

  const prompt = `# PROMPT ESTRUTURADO PARA EQUIPE DE AGENTES
**Gerado em:** ${timestamp}
**Tipo de Projeto:** ${projectTypeLabel}
**Urgência:** ${urgencyLabel}

---

## 1. CONTEXTO DA EMPRESA E PROBLEMA

### Descrição do Problema/Objetivo
${formData.description}

### Público-Alvo
${formData.targetAudience}

### Referências e Inspirações
${formData.references.length > 0 ? formData.references.map((r, i) => `${i + 1}. ${r}`).join('\n') : 'Nenhuma referência fornecida'}

### Observações Adicionais
${formData.additionalNotes || 'Nenhuma observação adicional'}

---

## 2. REQUISITOS TÉCNICOS

### Stack Tecnológica Preferida
${formData.preferredStack || 'Não especificada - Sugerir stack moderna adequada ao tipo de projeto'}

### Tipo de Projeto
${projectTypeLabel}

### Funcionalidades Obrigatórias
${formData.features.length > 0
  ? formData.features.map((f, i) => `${i + 1}. ${f}`).join('\n')
  : 'Nenhuma funcionalidade específica listada - Implementar padrão para o tipo de projeto'}

### Integrações Necessárias
${formData.integrations.length > 0
  ? formData.integrations.map((i, idx) => `${idx + 1}. ${i}`).join('\n')
  : 'Nenhuma integração específica listada'}

---

## 3. USER STORIES

${generateUserStories(formData)}

---

## 4. CRITÉRIOS DE ACEITAÇÃO

${generateAcceptanceCriteria(formData)}

---

## 5. ARQUITETURA SUGERIDA

${generateArchitecture(formData)}

---

## 6. STACK TECNOLÓGICA RECOMENDADA

${generateStackRecommendation(formData)}

---

## 7. TIMELINE E ENTREGAS

### Prazo Estimado
${formData.timeline || 'Não especificado'}

### Urgência
${urgencyLabel}

### Orçamento Estimado
${formData.estimatedBudget || 'Não especificado'}

### Fases Sugeridas
${generatePhases(formData)}

---

## 8. CHECKLIST TÉCNICO

- [ ] Setup do repositório e CI/CD
- [ ] Configuração de ambiente (dev/staging/prod)
- [ ] Banco de dados e migrações
- [ ] Autenticação e autorização
- [ ] API/Endpoints principais
- [ ] Interface de usuário (Frontend)
- [ ] Integrações externas
- [ ] Testes (unitários, integração, e2e)
- [ ] Documentação técnica
- [ ] Deploy e monitoramento
- [ ] Segurança (OWASP, LGPD)
- [ ] Performance e otimização
- [ ] Acessibilidade (WCAG 2.1)
- [ ] SEO técnico (se aplicável)

---

## 9. RISCOS E CONSIDERAÇÕES

${generateRisks(formData)}

---

## 10. PRÓXIMOS PASSOS

1. Revisão técnica pela equipe de arquitetura
2. Estimativa detalhada de esforço (story points/horas)
3. Definição de sprint backlog
4. Kick-off com stakeholders
5. Início do desenvolvimento

---

*Prompt gerado automaticamente pelo Sistema de Geração de Prompts v1.0*
*ID da Solicitação: ${formData.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`

  return prompt
}

function generateUserStories(formData: FormData): string {
  const stories: string[] = []
  const baseStories = [
    'Como **usuário**, quero **acessar a aplicação** para **realizar minhas tarefas principais**',
    'Como **admin**, quero **gerenciar usuários e permissões** para **controlar o acesso ao sistema**',
    'Como **usuário**, quero **receber feedback visual** das minhas ações para **entender o estado do sistema**',
  ]

  // Add project-type specific stories
  switch (formData.projectType) {
    case 'ECOMMERCE':
      stories.push(
        'Como **cliente**, quero **navegar por produtos e categorias** para **encontrar o que desejo comprar**',
        'Como **cliente**, quero **adicionar itens ao carrinho e finalizar compra** para **comprar produtos**',
        'Como **admin**, quero **gerenciar pedidos e estoque** para **controlar as vendas**',
      )
      break
    case 'DASHBOARD':
      stories.push(
        'Como **gestor**, quero **visualizar métricas em tempo real** para **tomar decisões baseadas em dados**',
        'Como **analista**, quero **filtrar e exportar relatórios** para **compartilhar insights**',
        'Como **admin**, quero **configurar dashboards personalizados** para **atender diferentes equipes**',
      )
      break
    case 'LANDING_PAGE':
      stories.push(
        'Como **visitante**, quero **entender a proposta de valor rapidamente** para **decidir se quero saber mais**',
        'Como **visitante**, quero **preencher um formulário de contato** para **solicitar informações**',
        'Como **marketing**, quero **rastrear conversões** para **medir performance da campanha**',
      )
      break
    case 'API':
      stories.push(
        'Como **desenvolvedor**, quero **documentação clara da API** para **integrar rapidamente**',
        'Como **sistema**, quero **rate limiting e autenticação** para **proteger os recursos**',
        'Como **admin**, quero **monitorar uso da API** para **identificar problemas**',
      )
      break
    case 'WEB_APP':
    case 'WEBSITE':
    default:
      stories.push(
        'Como **usuário**, quero **navegar intuitivamente** para **encontrar informação facilmente**',
        'Como **usuário**, quero **interagir com funcionalidades core** para **atingir meu objetivo**',
      )
  }

  // Add feature-specific stories
  if (formData.features.includes('Sistema de pagamentos')) {
    stories.push('Como **cliente**, quero **pagar de forma segura** para **completar minha compra**')
  }
  if (formData.features.includes('Chat/ Mensageria')) {
    stories.push('Como **usuário**, quero **conversar em tempo real** para **resolver dúvidas rapidamente**')
  }
  if (formData.features.includes('Notificações (email/push)')) {
    stories.push('Como **usuário**, quero **receber alertas importantes** para **não perder prazos ou atualizações**')
  }

  return [...baseStories, ...stories].map((s, i) => `${i + 1}. ${s}`).join('\n')
}

function generateAcceptanceCriteria(formData: FormData): string {
  const criteria = [
    'A aplicação carrega em menos de 3 segundos (Core Web Vitals)',
    'Funciona nos 2 últimos navegadores principais (Chrome, Firefox, Safari, Edge)',
    'Responsivo: mobile (320px+), tablet (768px+), desktop (1024px+)',
    'Acessibilidade WCAG 2.1 AA (contraste, navegação por teclado, screen readers)',
    'HTTPS obrigatório em produção com headers de segurança (CSP, HSTS, etc.)',
    'Tratamento de erros amigável ao usuário + logs detalhados para desenvolvedores',
    'Validação de entrada tanto no frontend quanto no backend',
    'Proteção contra ataques comuns (XSS, CSRF, SQL Injection, Rate Limiting)',
    'Backup automático do banco de dados com retenção de 30 dias',
    'Monitoramento de uptime (99.9% SLA) e alertas de erro',
  ]

  // Project-specific criteria
  switch (formData.projectType) {
    case 'ECOMMERCE':
      criteria.push(
        'Checkout completo em menos de 5 passos',
        'Conformidade PCI-DSS para pagamentos',
        'Emails transacionais (confirmação, envio, entrega)',
        'Gestão de estoque em tempo real',
      )
      break
    case 'DASHBOARD':
      criteria.push(
        'Dados atualizados em tempo real ou near-real-time (< 5s)',
        'Exportação CSV/PDF/Excel de relatórios',
        'Filtros e drill-down funcionais',
        'Performance com 10k+ registros',
      )
      break
    case 'API':
      criteria.push(
        'Documentação OpenAPI/Swagger completa',
        'Rate limiting: 1000 req/min por cliente',
        'Latência p95 < 200ms',
        'Versionamento de API (v1, v2)',
      )
      break
  }

  return criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')
}

function generateArchitecture(formData: FormData): string {
  let arch = '### Arquitetura Geral\n\n'

  switch (formData.projectType) {
    case 'WEBSITE':
    case 'LANDING_PAGE':
      arch += `
**Padrão:** Jamstack / Static Site Generation (SSG) com hidratação seletiva

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   CDN/Edge  │────▶│  Next.js    │────▶│   CMS/      │
│  (Vercel/   │     │  (App       │     │  Headless   │
│   Netlify)  │     │   Router)   │     │  (Opt.)     │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
              ┌─────────┐   ┌─────────┐
              │  ISR/   │   │  API    │
              │  SSG    │   │ Routes  │
              └─────────┘   └─────────┘
\`\`\`

**Decisões-chave:**
- Next.js App Router com Server Components por padrão
- Static Generation para páginas de conteúdo
- ISR (Incremental Static Regeneration) para dados semi-estáticos
- Edge Functions para middleware e geolocalização
`
      break

    case 'WEB_APP':
    case 'DASHBOARD':
      arch += `
**Padrão:** Single Page Application com Server-Side Rendering (SSR)

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Load      │────▶│  Next.js    │────▶│  Database   │
│  Balancer   │     │  (App       │     │  (PostgreSQL│
│  (Vercel/   │     │   Router)   │     │   / Prisma) │
│   AWS)      │     └──────┬──────┘     └─────────────┘
└─────────────┘            │
                    ┌──────┴──────┐
                    ▼             ▼
              ┌─────────┐   ┌─────────┐
              │  Auth   │   │  Cache  │
              │ (NextAuth│   │ (Redis) │
              │  v5)    │   └─────────┘
              └─────────┘
\`\`\`

**Decisões-chave:**
- Server Components para dados, Client Components para interatividade
- React Query / SWR para cache de dados no cliente
- NextAuth v5 para autenticação (credentials + OAuth)
- Prisma ORM com connection pooling
- Redis para sessões e cache de queries pesadas
`
      break

    case 'ECOMMERCE':
      arch += `
**Padrão:** Microserviços leves / Modular Monolith

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   CDN       │────▶│  Next.js    │────▶│  Services   │
│  (Imagens,  │     │  (App       │     │  ┌───────┐  │
│   Assets)   │     │   Router)   │     │  │ Catalog│  │
└─────────────┘     └──────┬──────┘     │  │ Service│  │
                           │            │  └───────┘  │
                    ┌──────┴──────┐     │  ┌───────┐  │
                    ▼             ▼     │  │ Cart  │  │
              ┌─────────┐   ┌─────────┐  │  │Service│  │
              │  Auth   │   │ Payments│  │  └───────┘  │
              │ (NextAuth)│  (Stripe) │  │  ┌───────┐  │
              └─────────┘   └─────────┘  │  │ Order │  │
                                         │  │Service│  │
                                         │  └───────┘  │
                                         └─────────────┘
\`\`\`

**Decisões-chave:**
- Stripe para pagamentos (PCI compliance delegado)
- Webhooks para sincronização de pedidos/pagamentos
- Event-driven para notificações (email, push, SMS)
- Saga pattern para transações distribuídas
- Idempotência em todas as operações críticas
`
      break

    case 'API':
      arch += `
**Padrão:** API-First com Clean Architecture

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  API        │────▶│  Next.js    │────▶│  Domain     │
│  Gateway    │     │  API Routes │     │  Layer      │
│  (Kong/     │     │  / tRPC     │     │  (Entities, │
│   AWS API   │     │             │     │   Use       │
│   Gateway)  │     └──────┬──────┘     │   Cases)    │
└─────────────┘            │            └──────┬──────┘
                           │                   │
                    ┌──────┴──────┐     ┌──────┴──────┐
                    ▼             ▼     ▼             ▼
              ┌─────────┐   ┌─────────┐ ┌─────────┐ ┌─────────┐
              │  Auth   │   │  Rate   │ │Database │ │ External│
              │ (JWT/   │   │  Limit  │ │(Prisma/ │ │ Services│
              │  OAuth) │   │         │ │ Postgres)│ │         │
              └─────────┘   └─────────┘ └─────────┘ └─────────┘
\`\`\`

**Decisões-chave:**
- tRPC ou REST com OpenAPI 3.0
- Zod para validação de schema (compartilhado client/server)
- Rate limiting por API key / IP
- Versionamento via header ou URL (/api/v1/)
- Observabilidade: OpenTelemetry + structured logging
`
      break

    default:
      arch += `
**Padrão:** Next.js App Router Full-Stack

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Vercel    │────▶│  Next.js    │────▶│  PostgreSQL │
│   Edge      │     │  (App       │     │  + Prisma   │
│   Network   │     │   Router)   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
\`\`\`
`
  }

  return arch
}

function generateStackRecommendation(formData: FormData): string {
  const stacks: Record<string, string[]> = {
    frontend: [
      '**Framework:** Next.js 14 (App Router, Server Components, RSC)',
      '**Language:** TypeScript 5.x (strict mode)',
      '**Styling:** Tailwind CSS + shadcn/ui (Radix UI primitives)',
      '**State:** React Query / TanStack Query + Zustand (global UI state)',
      '**Forms:** React Hook Form + Zod (validação schema-first)',
      '**Auth:** NextAuth v5 (credentials, OAuth, magic links)',
    ],
    backend: [
      '**Runtime:** Node.js 20 LTS (Edge Runtime onde possível)',
      '**Database:** PostgreSQL 16 + Prisma ORM',
      '**Cache:** Redis 7 (Upstash / Vercel KV / Railway)',
      '**Queue:** BullMQ (Redis) ou Inngest para background jobs',
      '**Storage:** AWS S3 / Vercel Blob / Cloudflare R2',
      '**Search:** Meilisearch / Algolia / PostgreSQL FTS',
    ],
    devops: [
      '**Hosting:** Vercel (recomendado) / AWS / Railway / Fly.io',
      '**CI/CD:** GitHub Actions / Vercel Deploy Hooks',
      '**Monitoring:** Sentry (erros) + Vercel Analytics / PostHog',
      '**Logging:** Pino / Axiom / Datadog',
      '**Secrets:** 1Password / Vercel Env / Doppler',
      '**Testing:** Vitest (unit) + Playwright (e2e) + Testing Library',
    ],
  }

  let output = ''

  for (const [category, items] of Object.entries(stacks)) {
    output += `### ${category.toUpperCase()}\n\n`
    output += items.map(item => `- ${item}`).join('\n')
    output += '\n\n'
  }

  // Add project-specific recommendations
  output += '### ESPECÍFICO PARA ESTE PROJETO\n\n'

  if (formData.preferredStack) {
    output += `**Stack solicitada pelo cliente:** ${formData.preferredStack}\n\n`
  }

  switch (formData.projectType) {
    case 'ECOMMERCE':
      output += `- **Pagamentos:** Stripe (Checkout, Elements, Billing)\n`
      output += `- **CMS Produtos:** Medusa / Saleor / Custom + Prisma\n`
      output += `- **Email:** Resend / SendGrid (transacional)\n`
      output += `- **Busca:** Meilisearch / Algolia\n`
      break
    case 'DASHBOARD':
      output += `- **Charts:** Recharts / Tremor / Chart.js\n`
      output += `- **Tabelas:** TanStack Table (virtualização, sorting, filtering)\n`
      output += `- **Export:** xlsx / jspdf / papaparse\n`
      output += `- **Real-time:** Socket.io / Pusher / Supabase Realtime\n`
      break
    case 'API':
      output += `- **API Layer:** tRPC (type-safe) ou REST + OpenAPI\n`
      output += `- **Validation:** Zod schemas compartilhados\n`
      output += `- **Rate Limit:** Upstash Ratelimit / Arcjet\n`
      output += `- **Documentação:** Scalar / Swagger UI / Redoc\n`
      break
  }

  return output
}

function generatePhases(formData: FormData): string {
  const basePhases = [
    { name: 'Fase 1: Discovery & Setup', duration: '1-2 semanas', tasks: ['Kick-off e alinhamento', 'Setup repo, CI/CD, ambientes', 'Arquitetura e decisões técnicas', 'Design System / UI Kit'] },
    { name: 'Fase 2: Core Development', duration: '3-6 semanas', tasks: ['Autenticação e autorização', 'Models de dados e migrations', 'API endpoints principais', 'Frontend: layouts e componentes base'] },
    { name: 'Fase 3: Features & Integrations', duration: '2-4 semanas', tasks: ['Funcionalidades específicas', 'Integrações externas', 'Testes automatizados', 'Otimização de performance'] },
    { name: 'Fase 4: QA & Deploy', duration: '1-2 semanas', tasks: ['Testes E2E e carga', 'Revisão de segurança', 'Documentação técnica', 'Deploy produção + monitoramento'] },
  ]

  return basePhases.map((phase, i) => `
#### ${i + 1}. ${phase.name} (${phase.duration})
${phase.tasks.map(t => `- [ ] ${t}`).join('\n')}
`).join('\n')
}

function generateRisks(formData: FormData): string {
  const risks = [
    { risk: 'Escopo creep', mitigation: 'Definir MVP claro, change control process', probability: 'Alta' },
    { risk: 'Integrações externas instáveis', mitigation: 'Circuit breakers, fallbacks, mocks para dev', probability: 'Média' },
    { risk: 'Performance em escala', mitigation: 'Load testing desde fase 2, cache strategy', probability: 'Média' },
    { risk: 'Segurança / LGPD', mitigation: 'Security review, DPIA, encryption at rest/transit', probability: 'Alta' },
    { risk: 'Dependência de terceiros (APIs)', mitigation: 'SLA contracts, abstração de providers', probability: 'Baixa' },
  ]

  // Project-specific risks
  if (formData.projectType === 'ECOMMERCE') {
    risks.push({ risk: 'Fraude em pagamentos', mitigation: 'Stripe Radar, 3D Secure, monitoramento', probability: 'Média' })
    risks.push({ risk: 'Chargebacks', mitigation: 'Políticas claras, evidências de entrega', probability: 'Média' })
  }
  if (formData.urgency === 'CRITICAL' || formData.urgency === 'HIGH') {
    risks.push({ risk: 'Qualidade comprometida por prazo', mitigation: 'Scope reduction, tech debt tracking, phased delivery', probability: 'Alta' })
  }

  return risks.map((r, i) => `${i + 1}. **${r.risk}** (Probabilidade: ${r.probability})\n   - Mitigação: ${r.mitigation}`).join('\n\n')
}

export function parsePromptToFormData(prompt: PromptRecord): FormData {
  return {
    projectType: prompt.projectType as ProjectTypeValue,
    title: prompt.title,
    description: prompt.description,
    targetAudience: prompt.targetAudience,
    preferredStack: prompt.preferredStack || undefined,
    urgency: prompt.urgency as UrgencyValue,
    estimatedBudget: prompt.estimatedBudget || undefined,
    timeline: prompt.timeline || undefined,
    features: JSON.parse(prompt.features || '[]'),
    integrations: JSON.parse(prompt.integrations || '[]'),
    references: JSON.parse(prompt.references || '[]'),
    additionalNotes: prompt.additionalNotes || undefined,
  }
}

export { PROJECT_TYPE_LABELS, URGENCY_LABELS, COMMON_FEATURES, COMMON_INTEGRATIONS }