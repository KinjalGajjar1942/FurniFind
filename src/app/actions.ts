
'use server';

import { ai } from '@/ai/genkit';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from '@/lib/firebase/server-config';
import { headers } from 'next/headers';
import { seedCategories } from '@/lib/seed';
import { createSupabaseAdmin } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

interface FurnitureData {
    name: string;
    category: string;
    imageUrl: string;
}

export async function addFurnitureAction(data: FurnitureData) {
    const app = getFirebaseAdminApp();
    const db = getFirestore(app);

    await db.collection('furniture').add(data);

    return { success: true, message: 'Successfully added furniture!' };
}

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

export async function uploadImageAction(formData: FormData): Promise<string> {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file provided');
  }

  const supabase = createSupabaseAdmin();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(`${uuidv4()}-${cleanFileName}`, file);

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Error uploading image to Supabase storage: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('uploads')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
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

export async function seedDataAction() {
  try {
    await seedCategories();
    return { success: true, message: 'Successfully seeded categories!' };
  } catch (error: any) {
    console.error('Error seeding data:', error);
    return { success: false, message: error.message || 'An unknown error occurred.' };
  }
}


export async function getCategoriesAction(): Promise<{ id: string; name: string }[]> {
  const app = getFirebaseAdminApp();
  const db = getFirestore(app);
  const categoriesSnapshot = await db.collection('categories').get();
  if (categoriesSnapshot.empty) {
    return [];
  }
  return categoriesSnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name as string,
  }));
}
