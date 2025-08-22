import Together from 'together-ai';

// Initialize Together AI client
const together = new Together({
  apiKey: 'c188a8df06d0185c90eaa3880feb4621cb8f1803dd76afccb523b9de482b1227',
});

// Helper function to generate responses using Together AI
export async function generateResponse(prompt: string, model: string = 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo') {
  try {
    const response = await together.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1.1,
    });

    const content = response.choices[0]?.message?.content;
    return content || 'No response generated';
  } catch (error) {
    console.error('Together AI API error:', error);
    throw new Error('Failed to generate response from Together AI');
  }
}

// Helper function to parse JSON from AI response
export function parseJSONFromResponse(response: string) {
  try {
    // Try to find JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('JSON parsing error:', error);
    return null;
  }
}
