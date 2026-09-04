import { describe, expect, test } from "@jest/globals";
import jwt from "jsonwebtoken";
import { env } from "../src/config/env.ts";
import { createRootAccount } from "../src/models/auth/setup.ts";

const rootAccountInput = {
  firstname: "Compte",
  lastname: "Root",
  password: "RootPassword@123",
};

describe("Validation de la création du compte root", () => {
  test("refuse une adresse email invalide", async () => {
    const token = jwt.sign(
      { purpose: "root-account", email: "root-valide@test.fr" },
      env.REGISTER_SECRET,
      { expiresIn: "5m" },
    );

    await expect(
      createRootAccount({
        ...rootAccountInput,
        token,
        email: "adresse-invalide",
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "L'adresse email n'est pas valide.",
    });
  });
});
