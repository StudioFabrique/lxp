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

const { sendRootEmailVerification, sendEmailChangeConfirmation } =
  await import("../src/services/mailer.ts");

describe("Activation SMTP du compte root", () => {
  beforeEach(() => {
    sendMail.mockClear();
  });

  test("envoie le lien d'activation à l'adresse du root", async () => {
    await sendRootEmailVerification("root@test.fr", "token");

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "root@test.fr",
        subject: "Activation de votre compte administrateur",
        html: expect.stringContaining("confirm-email?token=token"),
        attachments: [
          expect.objectContaining({
            filename: "andria-logo.png",
            cid: "andria-official-logo",
            contentType: "image/png",
          }),
        ],
      }),
    );

    const message = sendMail.mock.calls[0]?.[0] as {
      html?: string;
    };
    expect(message.html).toContain('src="cid:andria-official-logo"');
    expect(message.html).toContain('role="presentation"');
    expect(message.html).toContain('align="center"');
    expect(message.html).toContain("margin:28px auto");
    expect(message.html).toContain('bgcolor="#17202a"');
    expect(message.html).toContain('bgcolor="#1769aa"');
    expect(message.html).not.toContain("andria-footer-light");
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

  test("applique au mail le mode sombre sélectionné dans l'application", async () => {
    await sendRootEmailVerification("root@test.fr", "token", "dark");

    const message = sendMail.mock.calls[0]?.[0] as { html?: string };
    expect(message.html).toContain('bgcolor="#0f172a"');
    expect(message.html).toContain('bgcolor="#1e293b"');
    expect(message.html).toContain("border-radius:18px 18px 0 0");
  });

  test("joint le logo ANDRIA adapté au pied des autres mails", async () => {
    await sendEmailChangeConfirmation("root@test.fr", "token");

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('src="cid:andria-footer-light"'),
        attachments: expect.arrayContaining([
          expect.objectContaining({ cid: "andria-footer-light" }),
        ]),
      }),
    );
  });
});
