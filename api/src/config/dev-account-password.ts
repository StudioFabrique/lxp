import { hash } from "bcrypt";
import { mailerDisabled } from "./mailer-disabled.ts";
import { env } from "./env.ts";

const DEV_ACCOUNT_PASSWORD = "Abcdef@123456";

export function devTemporaryUserPassword(value?: string) {
  return value && value !== "false" ? value : DEV_ACCOUNT_PASSWORD;
}

export async function devAccountPasswordHash() {
  return mailerDisabled
    ? hash(devTemporaryUserPassword(env.DEV_TEMPORARY_USER_PASSWORD), 10)
    : undefined;
}
