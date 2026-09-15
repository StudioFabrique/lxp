export function assignmentLinks(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s<>"'`]+/gi) ?? [];
  return [...new Set(matches.map(match => match.replace(/[.,;:!?)}\]]+$/g, "")).filter(match => {
    try {
      const url = new URL(match);
      return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
    } catch {
      return false;
    }
  }))].slice(0, 10);
}
