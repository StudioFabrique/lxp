/**
 * @fileoverview Data access layer for retrieving aggregated AI token usage statistics.
 * This module queries the PromptStats collection to calculate total token consumption.
 */

import PromptStats from "../../utils/interfaces/db/prompt-stats";

/**
 * Retrieves the total number of tokens consumed across all AI prompt operations.
 *
 * This function queries the PromptStats collection and aggregates the tokensUsed
 * field from all records to provide a cumulative token count. This is useful for
 * monitoring AI usage, cost tracking, and analytics dashboards.
 *
 * @returns A promise that resolves to the total number of tokens used (number)
 *
 * @example
 * const totalTokens = await getTotalTokens();
 * console.log(`Total tokens consumed: ${totalTokens}`);
 */
export default async function getTotalTokens(): Promise<number> {
  // Query all prompt stats, projecting only the tokensUsed field for efficiency
  const stats = await PromptStats.find({}, { tokensUsed: 1 });

  // Sum up all tokens across all prompt statistics records
  const totalTokens = stats.reduce((total, stat) => total + stat.tokensUsed, 0);

  return totalTokens;
}
