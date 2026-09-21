import { describe, expect, test } from "@jest/globals";
import { isMailerDisabled } from "../src/config/mailer-disabled.ts";

describe("MAILER_DISABLED", () => {
  test.each([
    ["development", "true", true],
    ["development", "false", false],
    ["test", "true", false],
    ["production", "true", false],
  ])("%s avec MAILER_DISABLED=%s donne %s", (environment, disabled, expected) => {
    expect(isMailerDisabled(environment, disabled)).toBe(expected);
  });
});
