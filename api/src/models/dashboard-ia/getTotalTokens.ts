/**
 * @fileoverview Data access layer for retrieving aggregated AI token usage statistics.
 * This module queries the PromptStats collection to calculate total token consumption.
 */

import getStartAndEndOfMonth from "../../helpers/getStartAndEndOfMonth";
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
 * console.log(`Total tokens consumed in current month: ${totalCurrentMonthTokens}`);
 */
export default async function getTotalTokens(): Promise<{
  totalTokens: number;
  totalCurrentMonthTokens: number;
}> {
  // Query all prompt stats, projecting only the tokensUsed field for efficiency
  const stats = await PromptStats.find({}, { tokensUsed: 1 });

  // Sum up all tokens across all prompt statistics records
  const totalTokens = stats.reduce((total, stat) => total + stat.tokensUsed, 0);

  const { startOfMonth, endOfMonth } = getStartAndEndOfMonth();

  // Sum up all tokens for the current month
  const currentMonthTokens = await PromptStats.find({
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  });

  const totalCurrentMonthTokens = currentMonthTokens.reduce(
    (total, stat) => total + stat.tokensUsed,
    0,
  );

  return { totalTokens, totalCurrentMonthTokens };
}
