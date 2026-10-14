import { describe, expect, it } from "vitest";
import { getConfirmEmailErrorHelp } from "./confirm-email-error";

describe("getConfirmEmailErrorHelp", () => {
  it("oriente vers la connexion quand le lien a déjà servi", () => {
    const help = getConfirmEmailErrorHelp("Ce lien a déjà été utilisé.");
    expect(help.cause).toContain("déjà servi");
    expect(help.solutions.join(" ")).toContain("connecter");
  });

  it("explique l'expiration d'un lien", () => {
    expect(getConfirmEmailErrorHelp("Le lien est invalide ou a expiré.").cause).toContain("24 heures");
  });

  it("propose une aide générique pour une erreur inconnue", () => {
    expect(getConfirmEmailErrorHelp("Erreur").solutions.length).toBeGreaterThan(0);
  });
});
