import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
        name: { label: 'Nome', type: 'text' },
        confirmPassword: { label: 'Confirmar Senha', type: 'password' },
        isRegister: { label: 'isRegister', type: 'hidden' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        const isRegister = credentials.isRegister === 'true'
        const creds = credentials as Record<string, string>

        if (isRegister) {
          // Registration flow
          const validated = registerSchema.safeParse({
            name: creds.name,
            email: creds.email,
            password: creds.password,
            confirmPassword: creds.confirmPassword,
          })

          if (!validated.success) {
            throw new Error(validated.error.errors[0].message)
          }

          const existingUser = await prisma.user.findUnique({
            where: { email: validated.data.email },
          })

          if (existingUser) {
            throw new Error('Este email já está cadastrado')
          }

          const hashedPassword = await bcrypt.hash(validated.data.password, 12)

          const user = await prisma.user.create({
            data: {
              name: validated.data.name,
              email: validated.data.email,
              password: hashedPassword,
              role: 'CLIENT',
            },
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } else {
          // Login flow
          const validated = loginSchema.safeParse({
            email: credentials.email,
            password: credentials.password,
          })

          if (!validated.success) {
            throw new Error(validated.error.errors[0].message)
          }

          const user = await prisma.user.findUnique({
            where: { email: validated.data.email },
          })

          if (!user || !user.password) {
            throw new Error('Credenciais inválidas')
          }

          const isValid = await bcrypt.compare(validated.data.password, user.password)

          if (!isValid) {
            throw new Error('Credenciais inválidas')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? ''
        token.role = (user as any).role ?? 'CLIENT'
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})

declare module 'next-auth' {
  interface User {
    role: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}