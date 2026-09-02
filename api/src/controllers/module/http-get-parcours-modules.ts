import { type Response, type NextFunction } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import getParcoursModules from "../../models/module/get-parcours-modules.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

/**
 * HTTP Controller: Get all modules from a specific parcours
 *
 * This endpoint retrieves all modules associated with a parcours (learning path)
 * along with available resources (contacts, skills) for creating/editing modules.
 *
 * Route: GET /modules/:parcoursId
 *
 * @param req - Express request object containing parcoursId in URL params
 * @param _res - Express response object (unused, response handled by middleware)
 * @param next - Express next function to pass data/errors to response middleware
 *
 * Success Response (200):
 * - modules: Array of module metadata with contacts and skills
 * - parcoursData: Object containing formationId and available resources
 *
 * Error Responses:
 * - 404: Parcours not found
 * - 500: Server error
 *
 * @example
 * GET /modules/123
 * Response: {
 *   modules: [...],
 *   parcoursData: { formationId: 1, contacts: [...], bonusSkills: [...] }
 * }
 */
export default async function httpGetParcoursModules(
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    // Extract parcours ID from URL parameters and convert to number
    const parcoursId = +req.params.parcoursId;

    // Fetch modules and available resources from database
    const response = await getParcoursModules(
      parcoursId,
      await resolveAccessScope(req.auth!),
    );

    // Pass successful response to middleware (status 200)
    next({ statusCode: 200, data: response });
  } catch (error: any) {
    // Pass error to error-handling middleware
    // Uses custom error code if provided, otherwise defaults to 500
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
