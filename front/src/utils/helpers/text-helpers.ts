function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word: string) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function toUpperFirstLetter(value: string | undefined | null) {
  if (!value) return undefined;

  // Certaines valeurs saisies contiennent des espaces (ou de la ponctuation)
  // avant le texte. Transformer `value[0]` ne modifie alors aucune lettre.
  return value.replace(/\p{L}/u, (firstLetter) =>
    firstLetter.toLocaleUpperCase("fr-FR"),
  );
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

export { toTitleCase, toUpperFirstLetter, cleanActivityTextContent };
