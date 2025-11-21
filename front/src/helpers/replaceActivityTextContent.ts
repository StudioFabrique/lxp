/**
 * Clean up HTML text content for activity descriptions.
 *
 * This utility removes empty paragraph tags that may appear at the
 * beginning or the end of a rich-text HTML string. It is intentionally
 * conservative and only strips these specific empty paragraph patterns:
 *   - <p></p>
 *   - <p>   </p> (spaces inside)
 *   - <p><br></p>
 *
 * Rationale:
 * - Editors or paste operations often add empty paragraphs at the start/end.
 * - Removing these prevents visual gaps and eases downstream processing
 *   (e.g. previews, indexing, diffing).
 *
 * Note: The function does not alter non-empty paragraphs or whitespace
 * within meaningful content. It operates via two simple regular expressions
 * and preserves the rest of the HTML unchanged.
 *
 * @param content - HTML string to normalize
 * @returns A new string with leading and trailing empty <p> paragraphs removed
 *
 * @example
 * replaceActivityTextContent("<p></p><p>Hello</p><p><br></p>")
 * // returns "<p>Hello</p>"
 */
export const replaceActivityTextContent = (content: string): string => {
  return content
    .replace(
      // Remove consecutive empty paragraphs at the beginning of the string.
      // The pattern matches one or more of:
      //   <p></p> | <p>\s*</p> | <p><br></p>
      // anchored to the start (^) so only leading empties are removed.
      /^(<p><\/p>|<p>\s*<\/p>|<p><br><\/p>)+/,
      ""
    )
    .replace(
      // Remove consecutive empty paragraphs at the end of the string.
      // The pattern mirrors the previous one but is anchored to the end ($).
      /(<p><\/p>|<p>\s*<\/p>|<p><br><\/p>)+$/,
      ""
    );
};
