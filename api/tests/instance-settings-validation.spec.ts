import { describe, expect, jest, test } from "@jest/globals";
import type { Response } from "express";
import type CustomRequest from "../src/utils/interfaces/express/custom-request.ts";

const defaultInstanceSettings = {
  name: "ANDRIA",
  setupCompleted: true,
  defaultTheme: "classic",
  welcomeTitles: { admin: "Bonjour", teacher: "Bonjour", student: "Bonjour" },
  welcomeMessages: {
    admin: "Bienvenue",
    teacher: "Bienvenue",
    student: "Bienvenue",
  },
};

jest.unstable_mockModule("../src/services/instance-settings.ts", () => ({
  readInstanceSettings: jest.fn(async () => defaultInstanceSettings),
  writeInstanceSettings: jest.fn(),
  hasCompanyLogo: jest.fn(async () => false),
}));

const { httpPutInstanceSettings } =
  await import("../src/controllers/http-instance-settings.ts");

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
      defaultTheme: defaultInstanceSettings.defaultTheme,
      welcomeTitles: JSON.stringify(defaultInstanceSettings.welcomeTitles),
      welcomeMessages: JSON.stringify(defaultInstanceSettings.welcomeMessages),
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
