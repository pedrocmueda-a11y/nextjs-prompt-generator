'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Menu, X, Sun, Moon, Monitor, LogOut, User, LayoutDashboard, FileText } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function Header() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/formulario', label: 'Novo Prompt', icon: FileText },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl" aria-label="Home">
            <Monitor className="h-6 w-6 text-primary" />
            <span>PromptGen</span>
          </Link>

          <div className="hidden md:flex md:gap-6">
            {session ? (
              navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )
              })
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Entrar
                </Link>
                <Link href="/login?register=true">
                  <Button size="sm">Cadastrar</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                    <AvatarFallback>{session.user?.name?.[0] || session.user?.email?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/formulario" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Novo Prompt
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex md:gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link href="/login?register=true">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4">
          <div className="flex flex-col gap-4">
            {session ? (
              navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                )
              })
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/login?register=true"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full">Cadastrar</Button>
                </Link>
              </>
            )}
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
              {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}