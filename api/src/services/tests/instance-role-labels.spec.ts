import {
  defaultRoleLabels,
  parseRoleLabels,
} from "../instance-settings.ts";

const current = { ...defaultRoleLabels };
const valid = {
  "1": "Direction",
  "2": "Ressources pédagogiques",
  "3": "Stagiaire",
  "4": "Invité",
};

describe("libellés des rôles de l'instance", () => {
  it("conserve les libellés actuels quand le champ est absent", () => {
    expect(parseRoleLabels(undefined, current)).toEqual({ labels: current });
  });

  it("accepte et normalise un jeu complet de libellés", () => {
    const raw = JSON.stringify({ ...valid, "2": "  Ressources   pédagogiques " });
    expect(parseRoleLabels(raw, current)).toEqual({ labels: valid });
  });

  it.each([
    ["un JSON invalide", "{"],
    ["un tableau", "[]"],
    ["un type non texte", JSON.stringify({ ...valid, "3": 4 })],
    ["un rang manquant", JSON.stringify({ "1": "A1", "2": "B2", "3": "C3" })],
    ["un rang inconnu", JSON.stringify({ ...valid, "0": "Root" })],
    ["un libellé trop court", JSON.stringify({ ...valid, "1": "A" })],
    ["un libellé trop long", JSON.stringify({ ...valid, "1": "a".repeat(41) })],
    ["un libellé d'espaces", JSON.stringify({ ...valid, "1": "   " })],
    ["des chevrons", JSON.stringify({ ...valid, "1": "<b>Admin</b>" })],
    ["un doublon", JSON.stringify({ ...valid, "3": "stagiaire ".replace("s", "S"), "4": "Stagiaire" })],
  ])("refuse %s", (_name, raw) => {
    expect(parseRoleLabels(raw, current)).toHaveProperty("error");
  });
});
