import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateStructuredPrompt } from '@/lib/prompt-generator'
import { promptFormSchema } from '@/lib/validations'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validated = promptFormSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validated.error.flatten() },
        { status: 400 }
      )
    }

    const formData = validated.data

    // Generate the structured prompt
    const generatedPrompt = generateStructuredPrompt({
      ...formData,
      title: formData.title,
    })

    // Save to database
    const prompt = await prisma.prompt.create({
      data: {
        userId: session.user.id,
        projectType: formData.projectType,
        title: formData.title,
        description: formData.description,
        targetAudience: formData.targetAudience,
        preferredStack: formData.preferredStack,
        urgency: formData.urgency,
        estimatedBudget: formData.estimatedBudget,
        timeline: formData.timeline,
        features: JSON.stringify(formData.features),
        integrations: JSON.stringify(formData.integrations),
        references: JSON.stringify(formData.references),
        additionalNotes: formData.additionalNotes,
        generatedPrompt,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      success: true,
      prompt: {
        id: prompt.id,
        title: prompt.title,
        projectType: prompt.projectType,
        status: prompt.status,
        generatedPrompt: prompt.generatedPrompt,
        createdAt: prompt.createdAt,
      },
    })
  } catch (error) {
    console.error('Error generating prompt:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}