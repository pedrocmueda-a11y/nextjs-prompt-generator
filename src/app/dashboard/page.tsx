'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  LayoutDashboard,
  FileText,
  Plus,
  Search,
  Filter,
  Copy,
  Eye,
  Trash2,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

const statusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  IN_REVIEW: 'Em Análise',
  IN_DEVELOPMENT: 'Em Desenvolvimento',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  IN_REVIEW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  IN_DEVELOPMENT: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const projectTypeLabels: Record<string, string> = {
  WEBSITE: 'Site Institucional',
  WEB_APP: 'Aplicação Web',
  DASHBOARD: 'Dashboard/Admin',
  LANDING_PAGE: 'Landing Page',
  ECOMMERCE: 'E-commerce',
  API: 'API/Backend',
  MOBILE_APP: 'App Mobile',
  OTHER: 'Outro',
}

const urgencyLabels: Record<string, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
}

interface Prompt {
  id: string
  title: string
  projectType: string
  description: string
  urgency: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchPrompts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      })
      if (statusFilter) params.append('status', statusFilter)

      const res = await fetch(`/api/prompts?${params}`)
      if (res.ok) {
        const data = await res.json()
        setPrompts(data.prompts)
        setTotalPages(data.pagination.totalPages)
      } else {
        toast.error('Erro ao carregar prompts')
      }
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrompts()
  }, [page, statusFilter])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Prompt excluído')
        setPrompts((prev) => prev.filter((p) => p.id !== id))
        setShowDeleteConfirm(false)
        setDeletingId(null)
      } else {
        toast.error('Erro ao excluir')
      }
    } catch {
      toast.error('Erro de conexão')
    }
  }

  const copyPrompt = async (prompt: Prompt) => {
    try {
      const res = await fetch(`/api/prompts/${prompt.id}`)
      if (res.ok) {
        const data = await res.json()
        await navigator.clipboard.writeText(data.prompt.generatedPrompt)
        toast.success('Prompt copiado para a área de transferência!')
      }
    } catch {
      toast.error('Erro ao copiar')
    }
  }

  const filteredPrompts = prompts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Gerencie seus prompts e acompanhe o status das solicitações
          </p>
        </div>
        <Link href="/formulario">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Prompt
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', count: prompts.length, icon: FileText },
          { label: 'Pendentes', count: prompts.filter(p => p.status === 'PENDING').length, icon: LayoutDashboard },
          { label: 'Em Andamento', count: prompts.filter(p => p.status === 'IN_REVIEW' || p.status === 'IN_DEVELOPMENT').length, icon: ChevronDown },
          { label: 'Entregues', count: prompts.filter(p => p.status === 'DELIVERED').length, icon: FileText },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
            <Filter className="h-4 w-4 opacity-50" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="PENDING">Pendente</SelectItem>
            <SelectItem value="IN_REVIEW">Em Análise</SelectItem>
            <SelectItem value="IN_DEVELOPMENT">Em Desenvolvimento</SelectItem>
            <SelectItem value="DELIVERED">Entregue</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prompts Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {search || statusFilter
                  ? 'Nenhum prompt encontrado com esses filtros'
                  : 'Nenhum prompt criado ainda. Clique em "Novo Prompt" para começar.'}
              </p>
              {!search && !statusFilter && (
                <Link href="/formulario" className="mt-4 inline-block">
                  <Button>Criar Primeiro Prompt</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Prompt</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Tipo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Urgência</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Criado em</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrompts.map((prompt) => (
                    <tr key={prompt.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium truncate max-w-xs">{prompt.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs line-clamp-1">
                            {prompt.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {projectTypeLabels[prompt.projectType] || prompt.projectType}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground capitalize">
                          {urgencyLabels[prompt.urgency] || prompt.urgency}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[prompt.status]}`}
                        >
                          {statusLabels[prompt.status] || prompt.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-sm text-muted-foreground">
                        {format(new Date(prompt.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyPrompt(prompt)}
                            className="h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedPrompt(prompt)}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingId(prompt.id)
                              setShowDeleteConfirm(true)
                            }}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 px-4 py-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Prompt Dialog */}
      <Dialog open={!!selectedPrompt} onOpenChange={(open) => !open && setSelectedPrompt(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedPrompt?.title}</DialogTitle>
          </DialogHeader>
          {selectedPrompt && (
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Tipo</p>
                  <p className="font-medium">{projectTypeLabels[selectedPrompt.projectType]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Urgência</p>
                  <p className="font-medium capitalize">{urgencyLabels[selectedPrompt.urgency]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{statusLabels[selectedPrompt.status]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Criado em</p>
                  <p className="font-medium">{format(new Date(selectedPrompt.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Descrição</p>
                <p className="whitespace-pre-wrap">{selectedPrompt.description}</p>
              </div>
              <div className="flex gap-2 border-t pt-4">
                <Button variant="outline" onClick={() => copyPrompt(selectedPrompt)} className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copiar Prompt Completo
                </Button>
                <Button variant="outline" onClick={() => setSelectedPrompt(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Prompt</DialogTitle>
          </DialogHeader>
          <p className="py-4">Tem certeza que deseja excluir este prompt? Esta ação não pode ser desfeita.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowDeleteConfirm(false); setDeletingId(null); }}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => deletingId && handleDelete(deletingId)}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}