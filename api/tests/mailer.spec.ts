import { beforeEach, describe, expect, jest, test } from "@jest/globals";

const smtpCalls: string[] = [];
const verify = jest.fn(async () => {
  smtpCalls.push("verify");
  return true;
});
const sendMail = jest.fn(async () => {
  smtpCalls.push("send");
  return { accepted: ["root@test.fr"] };
});

jest.unstable_mockModule("nodemailer", () => ({
  default: {
    createTransport: () => ({ verify, sendMail }),
  },
}));

const { sendRootAccountInvitation } = await import("../src/services/mailer.ts");

describe("Invitation SMTP du compte root", () => {
  beforeEach(() => {
    smtpCalls.length = 0;
    verify.mockClear();
    sendMail.mockClear();
  });

  test("vérifie la connexion SMTP avant d'envoyer l'invitation", async () => {
    await sendRootAccountInvitation("root@test.fr", "token", true);

    expect(smtpCalls).toEqual(["verify", "send"]);
  });

  test("n'envoie pas l'invitation lorsque la vérification SMTP échoue", async () => {
    verify.mockRejectedValueOnce(new Error("SMTP indisponible"));

    await expect(
      sendRootAccountInvitation("root@test.fr", "token", true),
    ).rejects.toMatchObject({
      statusCode: 503,
      message: "La connexion au serveur SMTP n'a pas pu être vérifiée.",
    });
    expect(sendMail).not.toHaveBeenCalled();
  });
});
