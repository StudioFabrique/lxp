import { formatTitle } from "../../../utils/helpers/text-helpers";

export function groupAnalysisNameLines(name: string): string[] {
  return name.split("\u00b7").map((part) => formatTitle(part.trim())).filter(Boolean);
}
