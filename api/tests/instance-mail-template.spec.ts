import { describe, expect, test } from "@jest/globals";
import { getTemplate } from "../src/helpers/get-mail-template.ts";

describe("identité de l’instance dans les e-mails", () => {
  test("affiche le logo et sa couleur dans le bandeau", () => {
    const html = getTemplate("activation", "token", "user@test.fr", {
      organizationName: "STEP",
      logoCid: "instance-logo",
      logoBackgroundColor: "#123456",
    });

    expect(html).toContain('src="cid:instance-logo"');
    expect(html).toContain('bgcolor="#123456"');
    expect(html).toContain(
      "Cet e-mail a été envoyé par <strong>STEP</strong>.",
    );
    expect(html).toContain('src="cid:andria-footer-light"');
  });

  test("supprime entièrement le bandeau lorsqu’aucun logo n’existe", () => {
    const html = getTemplate("activation", "token", "user@test.fr", {
      organizationName: "STEP",
    });

    expect(html).not.toContain("cid:instance-logo");
    expect(html).not.toContain("padding:24px 32px 30px");
    expect(html).toContain(
      "Cet e-mail a été envoyé par <strong>STEP</strong>.",
    );
    expect(html).toContain('src="cid:andria-footer-light"');
  });

  test("n'ajoute pas un second logo ANDRIA sous le mail d'initialisation root", () => {
    const html = getTemplate(
      "root-email-verification",
      "token",
      "root@test.fr",
      {
        organizationName: "ANDRIA",
      },
    );

    expect(html).toContain('src="cid:andria-official-logo"');
    expect(html).not.toContain("andria-footer-light");
    expect(html).not.toContain("andria-footer-dark");
  });
});
