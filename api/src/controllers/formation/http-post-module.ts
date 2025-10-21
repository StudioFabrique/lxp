import { Response } from "express";
import postModule from "../../models/formation/post-module";
import fs from "fs";
import { deleteTempUploadedFile } from "../../middleware/fileUpload";
import sharp from "sharp";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { validationResult } from "express-validator";
import { serverIssue } from "../../utils/constantes";

/**
 * HTTP Controller for creating a new module with image upload
 *
 * This endpoint handles the creation of a new module within a formation/parcours.
 * It processes both the module metadata (title, description, duration, contacts, skills)
 * and an optional image file that gets processed into two formats:
 * - Full-size image (base64 encoded)
 * - Thumbnail (400x400px, base64 encoded)
 *
 * The controller validates input data, processes uploaded images using Sharp,
 * creates the module with associated metadata, and handles cleanup of temporary files.
 *
 * @param req - Custom request object containing auth info, form data, and uploaded file
 * @param res - Express response object
 * @returns JSON response with created module data or error information
 */
async function httpPostModule(req: CustomRequest, res: Response) {
  // Extract module data from request body (JSON string parsed by middleware)
  const module = req.body.module;

  // Get uploaded file information from multer middleware
  const uploadedFile = req.file;

  // Check for validation errors from express-validator middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Clean up uploaded file if validation failed
    await deleteTempUploadedFile(req);
    console.log("Validation errors:", errors.array());

    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extract authenticated user ID from JWT token
    const userId = req.auth?.userId;

    // Handle module creation with image processing
    if (uploadedFile && userId) {
      // Read the uploaded file as binary data
      const data = await fs.promises.readFile(uploadedFile.path);

      // Convert full image to base64 for storage
      const image = data.toString("base64");

      // Create thumbnail using Sharp: resize to 400x400px
      const resizedPic = sharp(uploadedFile.path).resize(400, 400);
      const thumb = resizedPic.toBuffer();

      // Convert thumbnail to base64 for storage
      const thumb64 = (await thumb).toString("base64");

      // Create module with both full image and thumbnail
      const response = await postModule(module, thumb64, image, userId);

      // Clean up temporary uploaded file after processing
      await deleteTempUploadedFile(req);
      return res
        .status(201)
        .json({ message: "Mise à jour réussie", data: response });
    } else {
      // Handle module creation without image upload
      const response = await postModule(module, null, null, userId!);
      console.log({ response });

      return res
        .status(201)
        .json({ message: "Mise à jour réussie", data: response });
    }
  } catch (error: any) {
    // Ensure cleanup of uploaded file even if an error occurs
    if (uploadedFile) await deleteTempUploadedFile(req);

    // Return appropriate error response with status code and message
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpPostModule;
