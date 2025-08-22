import { NextRequest, NextResponse } from 'next/server'
import { generateResponse, parseJSONFromResponse } from '../../../lib/together-ai'

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json()

    if (!notes) {
      return NextResponse.json(
        { error: 'Notes are required' },
        { status: 400 }
      )
    }

    const prompt = `Create flashcards from the following notes. Generate 5-8 flashcards in JSON format with the following structure:
{
  "flashcards": [
    {
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}

Focus on key concepts, definitions, and important facts. Make questions clear and answers concise.

Notes: ${notes}`

    const response = await generateResponse(prompt)
    
    try {
      // Try to parse JSON from the response
      const flashcardsData = parseJSONFromResponse(response)
      if (flashcardsData && flashcardsData.flashcards) {
        return NextResponse.json(flashcardsData)
      }
    } catch (parseError) {
      // If JSON parsing fails, return a structured response
      console.log('Could not parse JSON, returning formatted response')
    }

    // Fallback: create a simple structure from the response
    return NextResponse.json({
      flashcards: [
        {
          front: "Generated from your notes",
          back: response || 'No response from model'
        }
      ]
    })
  } catch (error) {
    console.error('Flashcards API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    )
  }
} 