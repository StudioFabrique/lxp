import { expect, it } from "vitest";
import { assignmentLinks } from "./assignment-links";

it("détecte les liens du devoir sans ponctuation finale ni doublons", () => {
  expect(assignmentLinks("Voir https://example.com/article?x=1, puis https://example.com/article?x=1 et (http://site.fr/page)."))
    .toEqual(["https://example.com/article?x=1", "http://site.fr/page"]);
});
