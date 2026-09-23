import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { compare } from "bcrypt";

const env: { DEV_TEMPORARY_USER_PASSWORD?: string } = {};
jest.unstable_mockModule("../src/config/env.ts", () => ({ env }));
jest.unstable_mockModule("../src/config/mailer-disabled.ts", () => ({
  mailerDisabled: true,
}));

const {
  devAccountPasswordHash,
  devTemporaryUserPassword,
} = await import("../src/config/dev-account-password.ts");

describe("mot de passe temporaire de développement", () => {
  beforeEach(() => {
    env.DEV_TEMPORARY_USER_PASSWORD = undefined;
  });

  test.each([
    [undefined, "Abcdef@123456"],
    ["false", "Abcdef@123456"],
    ["MotDePasseLocal@123", "MotDePasseLocal@123"],
  ])("utilise la valeur configurée ou le défaut", (configured, expected) => {
    expect(devTemporaryUserPassword(configured)).toBe(expected);
  });

  test("utilise le mot de passe configuré pour les comptes locaux", async () => {
    env.DEV_TEMPORARY_USER_PASSWORD = "MotDePasseLocal@123";

    const result = await devAccountPasswordHash();
    expect(result).toBeDefined();
    expect(await compare("MotDePasseLocal@123", result!)).toBe(true);
    expect(await compare("Abcdef@123456", result!)).toBe(false);
  });
});
