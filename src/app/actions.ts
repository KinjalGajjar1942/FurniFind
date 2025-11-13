'use server';

import { ai } from '@/ai/genkit';

export async function generateImageHintAction(photoDataUri: string): Promise<string> {
  const hintPrompt = ai.definePrompt({
    name: 'serverImageHintPrompt',
    prompt: `Describe the main object in this image in one or two words. {{media url=photoDataUri}}`,
  });

  try {
    const hintResponse = await hintPrompt({ photoDataUri });
    return hintResponse.text.trim().toLowerCase().replace(/\s+/g, ' ') || 'uploaded image';
  } catch (error) {
    console.error("Error generating image hint:", error);
    return 'furniture'; // Fallback hint
  }
}
