
import 'dotenv/config';
import { z } from 'zod';

const serviceAccountSchema = z.object({
  type: z.string(),
  project_id: z.string(),
  private_key_id: z.string(),
  private_key: z.string(),
  client_email: z.string(),
  client_id: z.string(),
  auth_uri: z.string(),
  token_uri: z.string(),
  auth_provider_x509_cert_url: z.string(),
  client_x509_cert_url: z.string(),
});

const envSchema = z.object({
  FIREBASE_SERVICE_ACCOUNT_KEY: z.string().transform((str, ctx) => {
    try {
      // The service account key is a JSON string, so we need to parse it.
      // It may have single quotes, so we replace them with double quotes.
      const parsed = JSON.parse(str.replace(/'/g, '"'));
      const result = serviceAccountSchema.safeParse(parsed);
      if (!result.success) {
        ctx.addIssue({ code: 'custom', message: 'Invalid service account key structure.' });
        return z.NEVER;
      }
      return result.data;
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e);
      ctx.addIssue({ code: 'custom', message: 'Invalid service account key JSON.' });
      return z.NEVER;
    }
  }),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  GEMINI_API_KEY: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables. Please check your .env file and compare it with the expected schema.');
}

export const env = parsedEnv.data;
export const serviceAccount = parsedEnv.data.FIREBASE_SERVICE_ACCOUNT_KEY;
