import { describe, expect, test } from "@jest/globals";
import { getTemplate } from "../src/helpers/get-mail-template.ts";
import {
  escapeHtml,
  instanceHomeUrl,
} from "../src/helpers/mail-template/shared.ts";

describe("identité de l’instance dans les e-mails", () => {
  test("affiche le logo de l’instance dans le pied de page", () => {
    const html = getTemplate("activation", "token", "user@test.fr", {
      organizationName: "STEP",
      logoCid: "instance-logo",
      logoBackgroundColor: "#123456",
    });

    expect(html).toContain('src="cid:instance-logo"');
    expect((html ?? "").indexOf('src="cid:instance-logo"')).toBeGreaterThan(
      (html ?? "").indexOf("border-top:1px solid"),
    );
    expect(html).not.toContain("<strong>STEP</strong></td>");
    expect(html).not.toContain("Cet e-mail a été envoyé par");
    expect(html).toContain('src="cid:andria-footer-light"');
    expect(html).toContain('valign="middle"');
    expect(html).toContain(
      `<a href="${escapeHtml(instanceHomeUrl())}" style="display:inline-block;text-decoration:none"><img src="cid:andria-footer-light"`,
    );
  });

  test("affiche le site sous le logo sans décaler le logo ANDRIA", () => {
    const html = getTemplate("activation", "token", undefined, {
      organizationName: "STEP",
      website: "https://step.eco/?a=1&b=2",
      logoCid: "instance-logo",
    });

    expect(html).toContain('href="https://step.eco/?a=1&amp;b=2"');
    expect(html).toContain('valign="top"');
    expect((html ?? "").indexOf("cid:instance-logo")).toBeLessThan(
      (html ?? "").indexOf("https://step.eco"),
    );
  });

  test("affiche le site tout en bas à gauche du template Bannière", () => {
    const html = getTemplate("activation", "token", undefined, {
      organizationName: "STEP",
      website: "https://step.eco",
      logoCid: "instance-logo",
      emailTemplate: "contrast",
    });

    expect(html).toContain('padding:18px 0 18px 32px');
    expect(html).toContain('href="https://step.eco"');
    expect((html ?? "").indexOf("Bienvenue parmi nous !")).toBeLessThan(
      (html ?? "").indexOf("https://step.eco"),
    );
  });

  test("supprime entièrement le bandeau lorsqu’aucun logo n’existe", () => {
    const html = getTemplate("activation", "token", "user@test.fr", {
      organizationName: "STEP",
    });

    expect(html).not.toContain("cid:instance-logo");
    expect(html).not.toContain("padding:24px 32px 30px");
    expect(html).toContain("border-top:1px solid #e6eaee;border-radius:12px 12px 0 0");
    expect(html).toContain("<strong>STEP</strong></td>");
    expect(html).toContain('src="cid:andria-footer-light"');
  });

  test("utilise un message d’activation simple et cohérent avec l’aperçu", () => {
    const html = getTemplate("activation", "token", "user@test.fr", {
      organizationName: "STEP",
    });

    expect(html).toContain("Bienvenue parmi nous !");
    expect(html).toContain("Votre compte est prêt.");
    expect(html).not.toContain("Bonjour,");
    expect(html).toContain("Adresse e-mail : <strong>user@test.fr</strong>");
  });

  test("conserve une signature visuelle distincte pour chaque template", () => {
    const context = {
      organizationName: "STEP",
      logoCid: "instance-logo",
      logoBackgroundColor: "#123456",
    } as const;
    const compactHeader = getTemplate("activation", "token", undefined, {
      ...context,
      emailTemplate: "gradient",
    });
    const banner = getTemplate("activation", "token", undefined, {
      ...context,
      emailTemplate: "contrast",
    });
    const editorial = getTemplate("activation", "token", undefined, {
      ...context,
      emailTemplate: "editorial",
    });

    expect(compactHeader).toContain('height="7" bgcolor="#123456"');
    expect(banner).toContain('align="center" bgcolor="#123456"');
    expect((banner ?? "").indexOf('src="cid:instance-logo"')).toBeLessThan(
      (banner ?? "").indexOf("Bienvenue parmi nous !"),
    );
    expect(banner?.match(/src="cid:instance-logo"/g)).toHaveLength(1);
    expect(banner).toContain("border-top:none");
    expect(banner).toContain("border-radius:8px 0 0 0");
    expect(banner).toContain('bgcolor="#123456"');
    expect(banner).toContain('src="cid:andria-footer-dark"');
    expect(banner).not.toContain("<strong>STEP</strong>");
    expect(editorial).toContain("border-top:4px solid #123456");
  });

  test("utilise aussi une couleur d’instance claire pour le bouton", () => {
    const html = getTemplate("activation", "token", undefined, {
      organizationName: "STEP",
      logoBackgroundColor: "#92bbea",
      emailTemplate: "contrast",
    });

    expect(html).toContain('bgcolor="#92bbea"');
    expect(html).toContain('background-color:#92bbea');
    expect(html).toContain('color:#17202a');
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
    expect(html).toContain(
      `<a href="${escapeHtml(instanceHomeUrl())}" style="display:inline-block;text-decoration:none"><img src="cid:andria-official-logo"`,
    );
    expect(html).not.toContain("andria-footer-light");
    expect(html).not.toContain("andria-footer-dark");
    expect(html).not.toContain("border-top:1px solid");
    expect(html).not.toContain("<strong>ANDRIA</strong></td>");
  });
});
