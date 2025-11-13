'use server';

import { ai } from '@/ai/genkit';
import { getStorage } from 'firebase-admin/storage';
import { getFirebaseAdminApp } from '@/lib/firebase/server-config';
import { headers } from 'next/headers';

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

export async function fixCorsAction() {
  'use server';
  try {
    const app = getFirebaseAdminApp();
    const bucket = getStorage(app).bucket();
    
    const headersList = headers();
    const origin = headersList.get('origin');
    
    if (!origin) {
        throw new Error("Could not determine origin from request headers.");
    }

    const corsConfiguration = [{
      "origin": [origin],
      "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
      "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
      "maxAgeSeconds": 3600
    }];

    await bucket.setCorsConfiguration(corsConfiguration);

    console.log(`Bucket ${bucket.name} was updated with a new CORS policy to allow uploads from ${origin}.`);
    return { success: true, message: `Successfully updated CORS policy for bucket ${bucket.name}.` };
  } catch (error: any) {
    console.error('Error setting CORS configuration:', error);
    return { success: false, message: error.message || 'An unknown error occurred.' };
  }
}
