import dotenv from "dotenv";
import { z } from "zod";
import { ensureDatabaseUrls } from "./database-urls.ts";

// Chargé ici, et nulle part ailleurs : en ESM, un `dotenv.config()` placé dans
// le corps d'un module s'exécute après l'évaluation de tous ses imports, donc
// après la lecture de la configuration par les modules importés.
//
// Sous Jest, les variables viennent de `.env.test`, chargé par la commande
// `dotenv -e .env.test` des scripts npm. Charger aussi `.env` ferait dépendre
// le résultat des tests de la configuration locale du développeur.
if (process.env.NODE_ENV !== "test") {
  dotenv.config();
}

ensureDatabaseUrls(process.env);

const emptyStringToUndefined = (value: unknown) =>
  value === "" ? undefined : value;

const optionalString = z.preprocess(
  emptyStringToUndefined,
  z.string().min(1).optional(),
);

const optionalUrl = z.preprocess(emptyStringToUndefined, z.url().optional());

const optionalPort = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().int().min(1).max(65535).optional(),
);

const booleanString = z.enum(["true", "false"]).default("false");

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    ENVIRONMENT: z.enum(["development", "test", "production"]),
    PORT: z.coerce.number().int().min(0).max(65535).default(5001),

    DATABASE_URL: z.string().min(1),
    MONGO_LOCAL_URL: z.string().min(1),
    SECRET: z.string().min(1),
    REGISTER_SECRET: z.string().min(1),
    ROOT_ACTIVATION_TOKEN_TTL_MINUTES: z.preprocess(
      emptyStringToUndefined,
      z.coerce.number().int().min(1).default(30),
    ),

    FRONT_URL: optionalUrl,
    MAILER_EMAIL: optionalString,
    MAILER_PASSWORD: optionalString,
    MAILER_SMTP: optionalString,
    MAILER_DEV_RECIPIENT: optionalString,
    MAILER_SMTP_PORT: optionalPort,
    MAILER_FROM: optionalString,
    UNSPLASH_ACCESS_KEY: optionalString,

    DOCKER_IA_API_BASE_URL: optionalUrl,
    DOCKER_IA_AUTH_SECRET: optionalString,
    DISABLE_AI_FEATURES: booleanString,

    DEMO_MODE: booleanString,
    DEMO_URL: optionalUrl,
    DEMO_EXIT_URL: optionalUrl,
    ALTCHA_HMAC_KEY: optionalString,
    DEMO_ADMIN_EMAIL: optionalString,
    DEMO_STUDENT_EMAIL: optionalString,
  })
  .superRefine((values, context) => {
    const requireFields = (
      names: Array<keyof typeof values>,
      reason: string,
    ) => {
      for (const name of names) {
        if (!values[name]) {
          context.addIssue({
            code: "custom",
            path: [name],
            message: reason,
          });
        }
      }
    };

    if (values.ENVIRONMENT === "production") {
      requireFields(
        [
          "FRONT_URL",
          "MAILER_EMAIL",
          "MAILER_PASSWORD",
          "MAILER_SMTP",
          "MAILER_SMTP_PORT",
          "MAILER_FROM",
          "UNSPLASH_ACCESS_KEY",
        ],
        "requis en production",
      );
    }

    if (values.DEMO_MODE === "true") {
      requireFields(
        ["DEMO_ADMIN_EMAIL", "DEMO_STUDENT_EMAIL"],
        "requis lorsque DEMO_MODE=true",
      );
    }

    if (
      values.ENVIRONMENT === "production" &&
      values.DEMO_MODE !== "true" &&
      values.DISABLE_AI_FEATURES !== "true"
    ) {
      requireFields(
        ["DOCKER_IA_API_BASE_URL", "DOCKER_IA_AUTH_SECRET"],
        "requis lorsque les fonctions IA sont actives",
      );
    }
  });

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `- ${issue.path.join(".") || "environnement"}: ${issue.message}`)
    .join("\n");

  throw new Error(`Configuration de l'API invalide :\n${details}`);
}

export const env = parsed.data;
