import { beforeEach, describe, expect, jest, test } from "@jest/globals";

const userId = "507f1f77bcf86cd799439011";
const user = { _id: userId, isActive: false, email: "test@example.com" };
const findOne = jest.fn((_filter: unknown) => ({
  populate: async () => user,
}));
const updateOne = jest.fn(async (_filter: unknown, _update: unknown) => ({
  matchedCount: 1,
}));
const sendPasswordEmail = jest.fn(async () => undefined);

jest.unstable_mockModule("../src/config/mailer-disabled.ts", () => ({
  mailerDisabled: true,
}));
jest.unstable_mockModule("../src/config/dev-account-password.ts", () => ({
  devAccountPasswordHash: jest.fn(async () => "dev-password-hash"),
}));
jest.unstable_mockModule("../src/utils/interfaces/db/user.ts", () => ({
  default: { findOne, updateOne },
}));
jest.unstable_mockModule("../src/services/mailer.ts", () => ({
  sendPasswordEmail,
}));

const { default: putInvitation } = await import(
  "../src/models/user/put-invitation.ts"
);

describe("invitation avec mailer désactivé", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    user.isActive = false;
  });

  test("active le compte et prépare sa connexion sans envoyer d'email", async () => {
    await putInvitation(userId);

    expect(updateOne).toHaveBeenCalledWith(
      { _id: userId, isActive: false },
      {
        $set: {
          isActive: true,
          emailVerified: true,
          password: "dev-password-hash",
        },
        $unset: { invitationPendingSince: 1 },
      },
    );
    expect(sendPasswordEmail).not.toHaveBeenCalled();
  });

  test("refuse un compte déjà actif", async () => {
    user.isActive = true;

    await expect(putInvitation(userId)).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(updateOne).not.toHaveBeenCalled();
  });
});
