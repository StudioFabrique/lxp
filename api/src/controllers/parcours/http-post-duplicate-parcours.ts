import { Response, NextFunction } from 'express';
import CustomRequest from '../../utils/interfaces/express/custom-request';
import postDuplicateParcours from '../../models/parcours/post-duplicate-parcours';

/**
 * Handles the HTTP POST request to duplicate a parcours.
 * 
 * @param req - The custom request object containing the parameters and authentication details.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 * 
 * @returns A promise that resolves to the duplicated parcours ID and a success status code.
 * 
 * @throws Will throw an error if the duplication process fails, with the appropriate status code and message.
 */
export default async function httpPostDuplicateParcours(req: CustomRequest, res: Response, next: NextFunction) { 
    try {
        const { parcoursId } = req.params;
        const userId = req.auth?.userId;
        const response = await postDuplicateParcours(+parcoursId, userId!);
        console.log({response});
        
        next({
            statusCode: 201,
            data: {
                success: true,
                parcoursId: response.id
            }
        })
    } catch(error: any) {
        next({
            statusCode: error.statusCode ?? 500,
            message: error.message
        });
    }
}