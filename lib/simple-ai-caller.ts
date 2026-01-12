/**
 * ðŸŽ¯ SIMPLE AI CALLER - BACK TO BASICS ARCHITECTURE 17.0
 * Gá»i API Gemini má»™t cÃ¡ch Ä‘Æ¡n giáº£n vÃ  trá»±c tiáº¿p
 */

export async function callSimpleAI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No content received from Gemini API');
    }
  } catch (error) {
    console.error('AI call error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to call AI: ${errorMessage}`);
  }
}

export async function callAIWithRetry(prompt: string, maxRetries: number = 3): Promise<string> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callSimpleAI(prompt);
    } catch (error) {
      lastError = error as Error;
      console.warn(`AI call attempt ${attempt} failed:`, lastError.message);
      
      // Don't retry on authentication errors
      if (lastError.message.includes('API_KEY') || lastError.message.includes('401')) {
        throw lastError;
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Unknown error occurred');
}
