'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MultiSelect, UrlList } from '@/components/ui/multi-select'
import {
  FileText,
  Loader2,
  CheckCircle,
  Copy,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  promptFormSchema,
  type PromptFormData,
  projectTypeOptions,
  urgencyOptions,
  commonFeatures,
  commonIntegrations,
} from '@/lib/validations'

export default function FormularioPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null)
  const [promptId, setPromptId] = useState<string | null>(null)

  const form = useForm<PromptFormData>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      projectType: 'WEB_APP',
      title: '',
      description: '',
      targetAudience: '',
      preferredStack: '',
      urgency: 'MEDIUM',
      estimatedBudget: '',
      timeline: '',
      features: [],
      integrations: [],
      references: [],
      additionalNotes: '',
    },
  })

  const featuresOptions = commonFeatures.map((f) => ({ value: f, label: f }))
  const integrationsOptions = commonIntegrations.map((i) => ({ value: i, label: i }))

  const onSubmit = async (data: PromptFormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Erro ao gerar prompt')
      }

      setGeneratedPrompt(result.prompt.generatedPrompt)
      setPromptId(result.prompt.id)
      toast.success('Prompt gerado com sucesso!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao gerar prompt')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async () => {
    if (generatedPrompt) {
      await navigator.clipboard.writeText(generatedPrompt)
      toast.success('Prompt copiado para a área de transferência!')
    }
  }

  const handleNewPrompt = () => {
    form.reset({
      projectType: 'WEB_APP',
      title: '',
      description: '',
      targetAudience: '',
      preferredStack: '',
      urgency: 'MEDIUM',
      estimatedBudget: '',
      timeline: '',
      features: [],
      integrations: [],
      references: [],
      additionalNotes: '',
    })
    setGeneratedPrompt(null)
    setPromptId(null)
  }

  if (generatedPrompt) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Prompt Gerado</h1>
            <p className="text-muted-foreground">Seu prompt estruturado está pronto para uso</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleNewPrompt} className="gap-2">
              <ArrowRight className="h-4 w-4" />
              Novo Prompt
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                Ver Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Prompt Estruturado para a Equipe de Agentes</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyToClipboard} className="gap-2">
                <Copy className="h-4 w-4" />
                Copiar
              </Button>
              <Button onClick={() => router.push('/dashboard')} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Salvar e Ir ao Dashboard
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-6 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-[600px] overflow-y-auto border">
              {generatedPrompt}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gerar Novo Prompt</h1>
        <p className="text-muted-foreground mt-2">
          Preencha as informações do projeto para gerar um prompt estruturado para sua equipe de 12 agentes.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="projectType">Tipo de Projeto *</Label>
                <Select
                  value={form.watch('projectType')}
                  onValueChange={(value) => form.setValue('projectType', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.projectType && (
                  <p className="text-sm text-destructive" role="alert">
                    {form.formState.errors.projectType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título do Projeto *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Sistema de Gestão de E-commerce"
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive" role="alert">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Problema/Objetivo *</Label>
              <Textarea
                id="description"
                placeholder="Descreva detalhadamente o problema a ser resolvido, o objetivo do projeto, principais desafios e contexto..."
                rows={6}
                {...form.register('description')}
              />
              <p className="text-sm text-muted-foreground">
                Mínimo 50 caracteres. Seja específico sobre o que precisa ser construído.
              </p>
              {form.formState.errors.description && (
                <p className="text-sm text-destructive" role="alert">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Público-Alvo *</Label>
              <Textarea
                id="targetAudience"
                placeholder="Ex: Pequenas e médias empresas do varejo que precisam gerenciar estoque e vendas online..."
                rows={3}
                {...form.register('targetAudience')}
              />
              {form.formState.errors.targetAudience && (
                <p className="text-sm text-destructive" role="alert">
                  {form.formState.errors.targetAudience.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgência *</Label>
                <Select
                  value={form.watch('urgency')}
                  onValueChange={(value) => form.setValue('urgency', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedBudget">Orçamento Estimado</Label>
                <Input
                  id="estimatedBudget"
                  placeholder="Ex: R$ 50.000 - R$ 100.000"
                  {...form.register('estimatedBudget')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Prazo Desejado</Label>
                <Input
                  id="timeline"
                  placeholder="Ex: 3 meses"
                  {...form.register('timeline')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredStack">Stack Tecnológica Preferida (Opcional)</Label>
              <Input
                id="preferredStack"
                placeholder="Ex: Next.js, PostgreSQL, Prisma, Tailwind, Vercel"
                {...form.register('preferredStack')}
              />
              <p className="text-sm text-muted-foreground">
                Deixe em branco para receber recomendações baseadas no tipo de projeto.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Funcionalidades Específicas</CardTitle>
          </CardHeader>
          <CardContent>
            <MultiSelect
              label="Selecione as funcionalidades necessárias"
              options={featuresOptions}
              value={form.watch('features')}
              onChange={(value) => form.setValue('features', value)}
              placeholder="Nenhuma funcionalidade selecionada"
              searchable
            />
            <p className="text-sm text-muted-foreground mt-2">
              Selecione todas as funcionalidades que o projeto deve ter.
            </p>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Integrações Necessárias</CardTitle>
          </CardHeader>
          <CardContent>
            <MultiSelect
              label="Selecione as integrações necessárias"
              options={integrationsOptions}
              value={form.watch('integrations')}
              onChange={(value) => form.setValue('integrations', value)}
              placeholder="Nenhuma integração selecionada"
              searchable
            />
            <p className="text-sm text-muted-foreground mt-2">
              Selecione serviços externos, APIs e plataformas que precisam ser integradas.
            </p>
          </CardContent>
        </Card>

        {/* References */}
        <Card>
          <CardHeader>
            <CardTitle>Referências e Inspirações (URLs)</CardTitle>
          </CardHeader>
          <CardContent>
            <UrlList
              label="Adicione URLs de referência (sites, apps, designs)"
              value={form.watch('references')}
              onChange={(value) => form.setValue('references', value)}
              placeholder="https://exemplo.com"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Adicione links de projetos similares, designs de referência ou documentações relevantes.
            </p>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Observações Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Notas Extras</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Qualquer informação adicional, restrições, requisitos não-funcionais, compliance, LGPD, etc."
                rows={4}
                {...form.register('additionalNotes')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4 pt-4 border-t">
          <Button type="submit" className="flex-1 gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando Prompt...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Gerar Prompt Estruturado
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={handleNewPrompt} className="flex-1">
            Limpar Formulário
          </Button>
        </div>
      </form>
    </div>
  )
}