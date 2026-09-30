import { describe, expect, it } from "vitest";
import { calculateActivityReadTime } from "./activity-read-time-helper";

describe("Estimation commune du temps de lecture", () => {
  it("compte les mots des blocs et conserve les mots avec mise en forme inline", () => {
    const html = "<h2>Le titre</h2><p>Bon<strong>jour</strong> à tous</p><p>La suite</p>";
    expect(calculateActivityReadTime(html)).toEqual(calculateActivityReadTime("Le titre Bonjour à tous La suite"));
  });
  it("ignore les balises, scripts et styles et décode les entités", () => {
    expect(calculateActivityReadTime("<p>Un&nbsp;texte &amp; une image<img src='test.png'></p><script>un script ignoré</script><style>un style ignoré</style>"))
      .toEqual(calculateActivityReadTime("Un texte & une image"));
  });
  it("conserve l'estimation précise même quand l'affichage arrondit à zéro minute", () => {
    const estimate = calculateActivityReadTime("<p>Bonjour</p>");
    expect(estimate.readTimeMinutes).toBe(0);
    expect(estimate.readTimeMs).toBeGreaterThan(0);
  });
  it("ne produit pas de durée pour un contenu vide", () => {
    expect(calculateActivityReadTime()).toEqual({ readTimeMs: 0, readTimeMinutes: 0 });
    expect(calculateActivityReadTime("<p><br></p>").readTimeMs).toBe(0);
  });
});
