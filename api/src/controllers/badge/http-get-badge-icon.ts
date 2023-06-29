import path from "path";
import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";

async function httpGetBadgeIcon(req: Request, res: Response) {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, "..", "..", "public", filename);
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.sendFile(imagePath);
  } catch (error) {
    return res.status(500).json({ message: serverIssue + error });
  }
}

export default httpGetBadgeIcon;
