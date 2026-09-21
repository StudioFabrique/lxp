import { env } from "./env.ts";

export function isMailerDisabled(environment: string, disabled: string) {
  return environment === "development" && disabled === "true";
}

export const mailerDisabled = isMailerDisabled(env.ENVIRONMENT, env.MAILER_DISABLED);
