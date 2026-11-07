import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Monitor,
  Zap,
  Brain,
  GitBranch,
  CheckCircle,
  ArrowRight,
  FileText,
  Users,
  Clock,
  Layers,
  Terminal,
  Shield,
  Rocket,
} from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Prompts Estruturados',
    description: 'Gera prompts completos no formato que seus 12 agentes entendem: contexto, requirements, user stories, acceptance criteria, arquitetura e stack.',
  },
  {
    icon: Brain,
    title: '12 Agentes Especializados',
    description: 'Prompts otimizados para cada agente da equipe: arquiteto, backend, frontend, DevOps, QA, security, UX, data, mobile, API, docs, PM.',
  },
  {
    icon: Layers,
    title: 'Arquitetura Sugerida',
    description: 'Receba diagramas de arquitetura, decisões técnicas, stack recomendada e fases de desenvolvimento baseadas no tipo de projeto.',
  },
  {
    icon: Users,
    title: 'Histórico do Cliente',
    description: 'Dashboard com todos os prompts gerados, status de cada solicitação (pendente, em análise, em desenvolvimento, entregue).',
  },
  {
    icon: Clock,
    title: 'Timeline e Estimativas',
    description: 'Fases sugeridas com duração, estimativa de esforço, marcos e checklists técnicos para cada etapa do projeto.',
  },
  {
    icon: Shield,
    title: 'Critérios de Aceitação',
    description: 'Checklist completo: performance, segurança, acessibilidade, LGPD, testes, CI/CD, monitoramento e documentação.',
  },
]

const projectTypes = [
  { type: 'WEBSITE', label: 'Site Institucional', icon: Monitor, desc: 'Sites estáticos, blogs, portfólios' },
  { type: 'WEB_APP', label: 'Aplicação Web', icon: Layers, desc: 'SaaS, plataformas, sistemas complexos' },
  { type: 'DASHBOARD', label: 'Dashboard/Admin', icon: Terminal, desc: 'Painéis administrativos, analytics' },
  { type: 'LANDING_PAGE', label: 'Landing Page', icon: Rocket, desc: 'Campanhas, lançamento de produtos' },
  { type: 'ECOMMERCE', label: 'E-commerce', icon: GitBranch, desc: 'Lojas virtuais, marketplaces' },
  { type: 'API', label: 'API/Backend', icon: Shield, desc: 'REST, GraphQL, tRPC, microserviços' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              <span>Nova versão 2.0 com 12 agentes especializados</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
              Transforme requisitos em <span className="text-primary">prompts estruturados</span> para sua equipe de IA
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Gere especificações técnicas completas com user stories, acceptance criteria, arquitetura sugerida,
              stack recomendada e timeline. Pronto para usar com seus agentes de desenvolvimento.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login?register=true">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Começar Grátis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/formulario">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Ver Exemplo de Prompt
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Confiado por equipes de:</span>
            <span>Startups</span>
            <span>Agências</span>
            <span>Times Internos</span>
            <span>Freelancers</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Tudo que você precisa para <span className="text-primary">especificar projetos</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Do briefing ao prompt estruturado. Nossa IA organiza seus requisitos no formato padrão
              que toda equipe de agentes entende.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Types */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Suporte para <span className="text-primary">qualquer tipo de projeto</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Templates otimizados para cada categoria com arquitetura, stack e critérios específicos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectTypes.map((project, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <project.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-lg">{project.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{project.desc}</p>
                  <Link
                    href="/formulario"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Testar <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Como funciona em <span className="text-primary">3 passos</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Preencha o Formulário',
                description: 'Tipo de projeto, descrição, público-alvo, stack, funcionalidades, integrações, referências e observações.',
                icon: FileText,
              },
              {
                step: '02',
                title: 'IA Gera o Prompt',
                description: 'Estruturamos no formato padrão: contexto, requirements, user stories, acceptance criteria, arquitetura, stack, timeline.',
                icon: Brain,
              },
              {
                step: '03',
                title: 'Use com seus Agentes',
                description: 'Copie o prompt, salve no histórico, acompanhe status. Pronto para seus 12 agentes especializados.',
                icon: CheckCircle,
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-4 top-0 text-4xl font-bold text-primary/20">{step.step}</div>
                <div className="pl-4">
                  <step.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Pronto para estruturar seus projetos?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Junte-se a centenas de equipes que usam PromptGen para acelerar o desenvolvimento com IA.
          </p>
          <Link href="/login?register=true">
            <Button size="lg" variant="secondary" className="gap-2">
              Criar Conta Grátis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}