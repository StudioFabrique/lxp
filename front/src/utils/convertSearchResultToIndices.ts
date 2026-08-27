import type { SearchResultHit } from "../components/search-modal/search-result.types";

export default function convertSearchResultToIndices(
  hits: SearchResultHit[],
): string[] {
  return [...new Set(hits.map(({ _index }) => _index))];
}
