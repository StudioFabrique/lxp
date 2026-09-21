import { hash } from "bcrypt";
import { mailerDisabled } from "./mailer-disabled.ts";

const DEV_ACCOUNT_PASSWORD = "Abcdef@123456";

export async function devAccountPasswordHash() {
  return mailerDisabled ? hash(DEV_ACCOUNT_PASSWORD, 10) : undefined;
}
