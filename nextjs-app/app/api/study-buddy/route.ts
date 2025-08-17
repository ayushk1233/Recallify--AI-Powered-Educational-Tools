import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    const prompt = `You are a helpful study buddy AI. Answer the following question in a clear, educational way. 

IMPORTANT FORMATTING RULES:
- Use proper paragraph breaks (double line breaks between sections)
- Use clear subheadings with descriptive titles in this format: **Heading Name**
- Use bullet points (•) for lists, not asterisks (*) or hash marks (#)
- IMPORTANT: Each bullet point should be on a separate line with proper spacing
- Structure your answer with Introduction, Main Points, Examples, and Summary
- Keep paragraphs concise (2-3 sentences max)
- Use friendly, encouraging language
- NEVER use # marks for headings - only use **Heading Name** format
- For emphasis within text, use **bold text** format
- Keep formatting clean and consistent
- Format bullet points like this:
  • First point with details
  • Second point with details  
  • Third point with details

Question: ${question}`

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt: prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()
    
    return NextResponse.json({ 
      answer: data.response || 'I could not process your question. Please try again!' 
    })
  } catch (error) {
    console.error('Study Buddy API error:', error)
    return NextResponse.json(
      { error: 'Failed to get study buddy response' },
      { status: 500 }
    )
  }
} 