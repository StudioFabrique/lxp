import { describe, expect, jest, test } from "@jest/globals";
import type { Response } from "express";
import type CustomRequest from "../src/utils/interfaces/express/custom-request.ts";

const defaultInstanceSettings = {
  name: "ANDRIA",
  website: "",
  setupCompleted: true,
  enabledThemes: ["classic", "classic-dark"],
  emailTemplate: "minimal",
};

jest.unstable_mockModule("../src/services/instance-settings.ts", () => ({
  readInstanceSettings: jest.fn(async () => defaultInstanceSettings),
  writeInstanceSettings: jest.fn(),
  hasInstanceLogo: jest.fn(async () => false),
  instanceLogoPath: "/tmp/instance-logo-test.jpeg",
  emailTemplateIds: ["minimal", "gradient", "editorial", "soft", "contrast", "compact"],
}));
jest.unstable_mockModule("../src/services/mailer.ts", () => ({
  sendInstanceTemplateTestEmail: jest.fn(),
}));
jest.unstable_mockModule("../src/utils/interfaces/db/user.ts", () => ({
  default: { findById: jest.fn() },
}));

const { httpPutInstanceSettings } =
  await import("../src/controllers/instance/http-instance-settings.ts");

function response() {
  const result: { status?: number; body?: { message?: string } } = {};
  const res = {
    status(code: number) {
      result.status = code;
      return res;
    },
    json(body: { message?: string }) {
      result.body = body;
      return res;
    },
  };
  return { result, res: res as unknown as Response };
}

function request(name: string) {
  return {
    body: {
      name,
      enabledThemes: JSON.stringify(defaultInstanceSettings.enabledThemes),
    },
  } as CustomRequest;
}

describe("validation des paramètres de l’instance", () => {
  test("nom invalide : n'évoque pas les messages de bienvenue", async () => {
    const { result, res } = response();
    await httpPutInstanceSettings(request("A"), res);

    expect(result.status).toBe(400);
    expect(result.body?.message).toBe(
      "Le nom de l’organisme doit contenir entre 2 et 80 caractères.",
    );
  });
});
