/**
 * Clean up HTML text content for activity descriptions.
 * Handles Tiptap hardbreaks (<br>) inside paragraphs and distinct empty paragraphs.
 */
export const replaceActivityTextContent = (content: string): string => {
  if (!content) return "";

  // Regex pour identifier un paragraphe considéré comme "vide"
  const emptyParagraphPattern =
    "(?:<p[^>]*>(?:\\s*<br\\s*\\/?>\\s*|\\s)*<\\/p>)";

  let cleaned = content;

  // Supprimer les paragraphes entièrement vides au début et à la fin
  // On utilise 'gi' pour case-insensitive et global
  cleaned = cleaned
    .replace(new RegExp(`^${emptyParagraphPattern}+`, "gi"), "")
    .replace(new RegExp(`${emptyParagraphPattern}+$`, "gi"), "");

  // Supprimer les <br> traînants à l'INTÉRIEUR du dernier paragraphe restant
  // Cas typique Tiptap : "...texte<br><br></p>" doit devenir "...texte</p>"
  cleaned = cleaned.replace(/(?:<br\s*\/?>\s*)+<\/p>$/i, "</p>");

  // Supprimer les <br> au tout début du premier paragraphe restant
  // Cas : "<p><br>Texte..." devient "<p>Texte..."
  cleaned = cleaned.replace(/^<p[^>]*>(?:<br\s*\/?>\s*)+/i, (match) => {
    return match.replace(/(?:<br\s*\/?>\s*)+/i, "");
  });

  return cleaned;
};
