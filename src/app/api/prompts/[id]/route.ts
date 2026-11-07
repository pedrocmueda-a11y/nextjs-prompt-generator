import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    const prompt = await prisma.prompt.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ prompt })
  } catch (error) {
    console.error('Error fetching prompt:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    const prompt = await prisma.prompt.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt não encontrado' }, { status: 404 })
    }

    const updated = await prisma.prompt.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ prompt: updated })
  } catch (error) {
    console.error('Error updating prompt:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    const prompt = await prisma.prompt.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt não encontrado' }, { status: 404 })
    }

    await prisma.prompt.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting prompt:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}