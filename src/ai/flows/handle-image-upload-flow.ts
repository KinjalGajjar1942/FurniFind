'use server';
/**
 * @fileOverview A flow to handle image uploads.
 *
 * - handleImageUpload - A function that takes an image data URI and returns a public URL.
 * - HandleImageUploadInput - The input type for the handleImageUpload function.
 * - HandleImageUploadOutput - The return type for the handleImageUpload function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const HandleImageUploadInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the furniture, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type HandleImageUploadInput = z.infer<typeof HandleImageUploadInputSchema>;

const HandleImageUploadOutputSchema = z.object({
  imageUrl: z.string().url().describe('The public URL of the uploaded image.'),
  imageHint: z.string().describe('A two-word hint for the image content.'),
});
export type HandleImageUploadOutput = z.infer<typeof HandleImageUploadOutputSchema>;

export async function handleImageUpload(input: HandleImageUploadInput): Promise<HandleImageUploadOutput> {
  return handleImageUploadFlow(input);
}

const handleImageUploadFlow = ai.defineFlow(
  {
    name: 'handleImageUploadFlow',
    inputSchema: HandleImageUploadInputSchema,
    outputSchema: HandleImageUploadOutputSchema,
  },
  async (input) => {
    // In a real app, you would upload the image to a service like Cloud Storage
    // and get a public URL. For this demo, we'll use a placeholder service.
    // We'll also use another AI model to get a hint for the image.

    const hintPrompt = ai.definePrompt({
        name: 'imageHintPrompt',
        prompt: `Describe the main object in this image in one or two words. {{media url=photoDataUri}}`,
    });
    
    const hintResponse = await hintPrompt({ photoDataUri: input.photoDataUri });
    const imageHint = hintResponse.text.trim().toLowerCase().replace(/\s+/g, ' ');

    // For demonstration, we'll just return a placeholder image URL.
    // In a real scenario, you would upload the input.photoDataUri to a storage bucket.
    const seed = new Date().getTime();
    const imageUrl = `https://picsum.photos/seed/${seed}/600/400`;

    return {
      imageUrl,
      imageHint: imageHint || 'uploaded image',
    };
  }
);
