'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Monitor, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from '@/lib/validations'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isRegister = searchParams.get('register') === 'true'
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [activeTab, setActiveTab] = useState(isRegister ? 'register' : 'login')
  const [isLoading, setIsLoading] = useState(false)

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Bem-vindo!')
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        isRegister: 'true',
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Conta criada com sucesso!')
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-6">
            <Monitor className="h-8 w-8 text-primary" />
            <span>PromptGen</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {activeTab === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {activeTab === 'login'
              ? 'Faça login para acessar seu dashboard'
              : 'Comece a gerar prompts estruturados para sua equipe'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {activeTab === 'login' ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...loginForm.register('email')}
                    disabled={isLoading}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive" role="alert">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Esqueci a senha
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...loginForm.register('password')}
                    disabled={isLoading}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive" role="alert">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    {...registerForm.register('name')}
                    disabled={isLoading}
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-destructive" role="alert">
                      {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...registerForm.register('email')}
                    disabled={isLoading}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-destructive" role="alert">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    {...registerForm.register('password')}
                    disabled={isLoading}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-destructive" role="alert">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    {...registerForm.register('confirmPassword')}
                    disabled={isLoading}
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive" role="alert">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center">
              {activeTab === 'login'
                ? 'Não tem conta?'
                : 'Já tem conta?'}
              <Button
                variant="ghost"
                className="ml-1"
                onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
              >
                {activeTab === 'login' ? 'Cadastre-se' : 'Faça login'}
              </Button>
            </p>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" disabled>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                  />
                </svg>
                GitHub
              </Button>
              <Button variant="outline" disabled>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M20.317 4.37a19.791 19.791 0 00-4.885 1.515A13.16 13.16 0 0123 5.438a26.292 26.292 0 01-7.313 2.794 13.112 13.112 0 01-10.235-5.31 37.2 37.2 0 002.79 18.928 13.16 13.16 0 01-19.84-10.147v.214a13.157 13.157 0 005.948 13.052A13.25 13.25 0 01.316 12.667a13.112 13.112 0 0013.128 9.838 26.331 26.331 0 01-16.17-5.572A37.146 37.146 0 0012.12 23.76c17.187 0 26.563-14.227 15.033-27.494z"
                  />
                </svg>
                Google
              </Button>
            </div>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ao continuar, você concorda com nossos{' '}
          <Link href="/termos" className="text-primary hover:underline">Termos de Uso</Link>{' '}
          e{' '}
          <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}