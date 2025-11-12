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
      return serviceAccountSchema.parse(JSON.parse(str));
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Invalid service account key' });
      return z.NEVER;
    }
  }),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables.');
}

export const serviceAccount = parsedEnv.data.FIREBASE_SERVICE_ACCOUNT_KEY;
