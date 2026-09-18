import { activation } from "./mail-template/activation.ts";
import { emailChange } from "./mail-template/email-change.ts";
import { reset } from "./mail-template/reset.ts";
import { rootAccount } from "./mail-template/root-account.ts";
import { rootEmailVerification } from "./mail-template/root-email-verification.ts";
import { updatedUser } from "./mail-template/updated-user.ts";
import type { MailContext } from "./mail-template/shared.ts";

export const getTemplate = (
  template: string,
  token: string,
  email?: string,
  context: MailContext = {},
) => {
  switch (template) {
    case "activation":
      return activation(token, email, context);
    case "reset":
      return reset(token, email, context);
    case "email-change":
      return emailChange(token, email, context);
    case "root-email-verification":
      return rootEmailVerification(token, email, context);
    case "root-account-init":
      return rootAccount(token, email, context, true);
    case "root-account":
      return rootAccount(token, email, context, false);
    case "updated-user":
      return updatedUser(token, email, context);
    default:
      return undefined;
  }
};
