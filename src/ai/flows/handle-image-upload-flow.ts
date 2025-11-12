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
import { getStorage } from 'firebase-admin/storage';
import { getFirebaseAdminApp } from '@/lib/firebase/server-config';
import { v4 as uuidv4 } from 'uuid';

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
    const hintPrompt = ai.definePrompt({
        name: 'imageHintPrompt',
        prompt: `Describe the main object in this image in one or two words. {{media url=photoDataUri}}`,
    });
    
    const hintResponse = await hintPrompt({ photoDataUri: input.photoDataUri });
    const imageHint = hintResponse.text.trim().toLowerCase().replace(/\s+/g, ' ');

    // Upload image to Firebase Storage
    const adminApp = getFirebaseAdminApp();
    const storage = getStorage(adminApp);
    const bucket = storage.bucket();

    const mimeType = input.photoDataUri.match(/data:(.*);base64,/)?.[1] ?? 'image/jpeg';
    const fileExtension = mimeType.split('/')[1];
    const buffer = Buffer.from(input.photoDataUri.split('base64,')[1], 'base64');
    const fileName = `furniture-images/${uuidv4()}.${fileExtension}`;
    const file = bucket.file(fileName);

    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
      },
    });

    const [imageUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // Far-future expiration date
    });

    return {
      imageUrl,
      imageHint: imageHint || 'uploaded image',
    };
  }
);
