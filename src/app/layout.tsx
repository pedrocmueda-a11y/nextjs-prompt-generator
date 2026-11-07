import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'PromptGen - Gerador de Prompts Estruturados para Equipes de IA',
    template: '%s | PromptGen',
  },
  description: 'Transforme requisitos em prompts estruturados para sua equipe de agentes de IA. Gera especificações técnicas completas com user stories, acceptance criteria, arquitetura e stack recomendada.',
  keywords: ['prompt engineering', 'IA', 'agentes', 'especificação técnica', 'software development'],
  authors: [{ name: 'PromptGen' }],
  creator: 'PromptGen',
  publisher: 'PromptGen',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://promptgen.app',
    siteName: 'PromptGen',
    title: 'PromptGen - Gerador de Prompts Estruturados',
    description: 'Transforme requisitos em prompts estruturados para sua equipe de agentes de IA.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PromptGen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptGen',
    description: 'Gerador de prompts estruturados para equipes de IA',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}