import { beforeEach, describe, expect, jest, test } from "@jest/globals";

const sendMail = jest.fn(async (_message: unknown) => {
  return { accepted: ["root@test.fr"] };
});

jest.unstable_mockModule("nodemailer", () => ({
  default: {
    createTransport: () => ({ sendMail }),
  },
}));
jest.unstable_mockModule("../src/utils/logs/logger.ts", () => ({
  logger: { error: jest.fn() },
}));

const { sendRootEmailVerification } = await import(
  "../src/services/mailer.ts"
);

describe("Activation SMTP du compte root", () => {
  beforeEach(() => {
    sendMail.mockClear();
  });

  test("envoie le lien d'activation à l'adresse du root", async () => {
    await sendRootEmailVerification("root@test.fr", "token");

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "root@test.fr",
        subject: "Activation de votre compte root ANDRIA",
        html: expect.stringContaining("confirm-email?token=token"),
      }),
    );
  });

  test("fait échouer le flux lorsque l'envoi SMTP échoue", async () => {
    sendMail.mockRejectedValueOnce(new Error("SMTP indisponible"));

    await expect(
      sendRootEmailVerification("root@test.fr", "token"),
    ).rejects.toMatchObject({
      statusCode: 500,
      message: "Le mail n'a pas pu être envoyé au destinataire",
    });
  });
});
