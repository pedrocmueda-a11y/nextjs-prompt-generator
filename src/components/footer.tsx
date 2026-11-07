import Link from 'next/link'
import { Monitor, Github, Twitter, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Gerar Prompt', href: '/formulario' },
      { label: 'Preços', href: '#' },
      { label: 'Documentação', href: '#' },
    ],
    company: [
      { label: 'Sobre', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Carreiras', href: '#' },
      { label: 'Contato', href: '#' },
    ],
    legal: [
      { label: 'Privacidade', href: '#' },
      { label: 'Termos', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  }

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ]

  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Monitor className="h-6 w-6 text-primary" />
              <span>PromptGen</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Gere prompts estruturados para sua equipe de agentes de IA. Transforme requisitos em especificações técnicas completas.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Produto</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Empresa</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {currentYear} PromptGen. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}