/**
 * @fileoverview HTTP controller for retrieving total AI token usage statistics.
 * This controller handles GET requests to fetch the cumulative token count
 * used across all AI operations in the dashboard.
 */

import { type Request, type Response, type NextFunction } from "express";
import getTotalTokens from "../../models/dashboard-ia/getTotalTokens.ts";
import { serverIssue } from "../../utils/constantes.ts";

/**
 * HTTP handler to retrieve the total number of tokens consumed by AI services.
 *
 * This endpoint provides aggregated token usage data for monitoring and billing purposes.
 * It queries the database for cumulative token statistics and returns them to the client.
 *
 * @param _req - Express Request object (unused as no input parameters are required)
 * @param _res - Express Response object (unused, response is handled via next middleware)
 * @param next - Express NextFunction to pass the response or error to the next middleware
 *
 * @returns Passes an object to next() containing:
 *   - On success: { statusCode: 200, data: TotalTokensResponse }
 *   - On error: { statusCode: number, message: string }
 *
 * @example
 * // Route registration
 * router.get("/dashboard/tokens/total", httpGetTotalTokens);
 *
 * // Successful response format
 * // { statusCode: 200, data: { totalTokens: 150000, ... } }
 */
export default async function httpGetTotalTokens(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    // Fetch aggregated token usage from the data layer
    const response = await getTotalTokens();

    // Pass successful response to the response handler middleware
    next({
      statusCode: 200,
      data: {
        totalTokens: response.totalTokens,
        totalCurrentMonthTokens: response.totalCurrentMonthTokens,
      },
    });
  } catch (error: any) {
    // Forward error to error handling middleware with appropriate status code
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
