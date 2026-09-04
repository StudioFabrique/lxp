import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import jwt from "jsonwebtoken";
import { env } from "../src/config/env.ts";

const tokenExists = jest.fn(async (_filter: unknown) => null);
const blacklistToken = jest.fn(async (_data: unknown) => ({}));
const selectRole = jest.fn(async () => ({ _id: "root-role-id" }));
const findRole = jest.fn((_filter: unknown) => ({ select: selectRole }));
const updateUser = jest.fn(async (_filter: unknown, _update: unknown) => ({
  matchedCount: 1,
}));

jest.unstable_mockModule(
  "../src/utils/interfaces/db/blacklisted-token.ts",
  () => ({
    default: { exists: tokenExists, create: blacklistToken },
  }),
);
jest.unstable_mockModule("../src/utils/interfaces/db/role.ts", () => ({
  default: { findOne: findRole },
}));
jest.unstable_mockModule("../src/utils/interfaces/db/user.ts", () => ({
  default: { updateOne: updateUser },
}));

const { confirmRootEmail } = await import(
  "../src/models/auth/confirm-root-email.ts"
);

describe("Confirmation de l'email du premier root", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("active le compte uniquement avec un lien signé", async () => {
    const token = jwt.sign(
      {
        purpose: "root-email-verification",
        userId: "507f1f77bcf86cd799439011",
        email: "root@test.fr",
      },
      env.REGISTER_SECRET,
      { expiresIn: "24h" },
    );

    await expect(confirmRootEmail(token)).resolves.toBe("root@test.fr");
    expect(updateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "507f1f77bcf86cd799439011",
        email: "root@test.fr",
        roles: "root-role-id",
        isActive: false,
        emailVerified: false,
      }),
      { $set: { isActive: true, emailVerified: true } },
    );
    expect(blacklistToken).toHaveBeenCalledWith({ token });
  });

  test("refuse un lien non signé", async () => {
    await expect(confirmRootEmail("token-invalide")).rejects.toMatchObject({
      statusCode: 401,
    });
    expect(updateUser).not.toHaveBeenCalled();
  });
});
