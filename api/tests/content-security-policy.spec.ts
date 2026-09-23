import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../src/app.ts";

describe("politique de sécurité des images", () => {
  test("autorise les aperçus locaux créés avec URL.createObjectURL", async () => {
    const response = await request(app).get("/v1/__csp_check__");

    expect(response.headers["content-security-policy"]).toMatch(
      /img-src[^;]*\bblob:/,
    );
    expect(response.headers["content-security-policy"]).toMatch(
      /img-src[^;]*https:/,
    );
  });
});
