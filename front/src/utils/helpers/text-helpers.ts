/** Names: preserve accents and capitalize compound names and apostrophes. */
function toTitleCase(str: string) {
  return str.toLowerCase().replace(/(^|[\s’'‐‑-])(\p{L})/gu,
    (_, separator: string, letter: string) => separator + letter.toUpperCase());
}

/** French headings use an initial capital. Preserve existing acronyms. */
export function formatTitle(value: string | null | undefined): string {
  return (value ?? "").replace(/^(\s*)(\p{L})/u,
    (_, spaces: string, letter: string) => spaces + letter.toUpperCase());
}

const cleanActivityTextContent = (content: string): string => {
  if (!content) return "";

  // 1. Nettoyage préliminaire (espaces début/fin)
  let cleaned = content.trim();

  // Définitions des patterns
  const brTag = "<br[^>]*>"; // Capture <br>, <br/>, <br class="...">
  const emptyParagraphPattern = `(?:<p[^>]*>(?:\\s*${brTag}\\s*|\\s)*<\\/p>)`;
  const orphanCloseTag = `(?:\\s*<\\/p>)`;

  // ÉTAPE A : Nettoyer les paragraphes vides/orphelins à la FIN
  // Ex: "...texte</p><p></p></p>" -> "...texte</p>"
  cleaned = cleaned.replace(
    new RegExp(`(?:${emptyParagraphPattern}|${orphanCloseTag})+$`, "gi"),
    "",
  );

  // ÉTAPE B : Nettoyer les paragraphes vides au DÉBUT
  // Ex: "<p></p><p>Texte..." -> "<p>Texte..."
  cleaned = cleaned.replace(
    new RegExp(`^\\s*(?:${emptyParagraphPattern}\\s*)+`, "gi"),
    "",
  );

  // ÉTAPE C : Nettoyer les <br> traînants (Le correctif pour votre cas actuel)
  // On cible les <br> qui sont suivis par :
  // - SOIT une balise fermante </p>
  // - SOIT la fin de la chaîne ($)
  cleaned = cleaned.replace(
    new RegExp(`(?:${brTag}\\s*)+(?=<\\/p>|$)`, "gi"),
    "",
  );

  return cleaned;
};

export { toTitleCase, cleanActivityTextContent };
