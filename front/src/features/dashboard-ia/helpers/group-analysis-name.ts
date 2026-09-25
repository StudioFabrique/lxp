import { formatTitle } from "../../../utils/helpers/text-helpers";

export function groupAnalysisNameLines(name: string): string[] {
  return name.split("·").map((part) => formatTitle(part.trim())).filter(Boolean);
}
