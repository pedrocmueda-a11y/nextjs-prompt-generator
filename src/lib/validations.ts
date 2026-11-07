import { z } from 'zod'

export const projectTypeOptions = [
  { value: 'WEBSITE', label: 'Site Institucional' },
  { value: 'WEB_APP', label: 'Aplicação Web' },
  { value: 'DASHBOARD', label: 'Dashboard / Painel Administrativo' },
  { value: 'LANDING_PAGE', label: 'Landing Page' },
  { value: 'ECOMMERCE', label: 'E-commerce' },
  { value: 'API', label: 'API / Backend' },
  { value: 'MOBILE_APP', label: 'Aplicativo Mobile' },
  { value: 'OTHER', label: 'Outro' },
] as const

export const urgencyOptions = [
  { value: 'LOW', label: 'Baixa (Flexível)' },
  { value: 'MEDIUM', label: 'Média (2-4 semanas)' },
  { value: 'HIGH', label: 'Alta (1-2 semanas)' },
  { value: 'CRITICAL', label: 'Crítica (Imediato)' },
] as const

export type ProjectTypeValue = (typeof projectTypeOptions)[number]['value']
export type UrgencyValue = (typeof urgencyOptions)[number]['value']

export const commonFeatures = [
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
] as const

export const commonIntegrations = [
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
] as const

export const promptFormSchema = z.object({
  projectType: z.enum([
    'WEBSITE',
    'WEB_APP',
    'DASHBOARD',
    'LANDING_PAGE',
    'ECOMMERCE',
    'API',
    'MOBILE_APP',
    'OTHER',
  ], {
    required_error: 'Selecione o tipo de projeto',
  }),
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres').max(100, 'Título muito longo'),
  description: z.string().min(50, 'Descrição deve ter pelo menos 50 caracteres').max(5000, 'Descrição muito longa'),
  targetAudience: z.string().min(10, 'Descreva o público-alvo (mín. 10 caracteres)').max(1000),
  preferredStack: z.string().max(500).optional(),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
    required_error: 'Selecione a urgência',
  }),
  estimatedBudget: z.string().max(100).optional(),
  timeline: z.string().max(200).optional(),
  features: z.array(z.string()).default([]),
  integrations: z.array(z.string()).default([]),
  references: z.array(z.string().url('URL inválida')).default([]),
  additionalNotes: z.string().max(2000).optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export type PromptFormData = z.infer<typeof promptFormSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>