import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getCourses from "../../models/course/get-courses";

async function httpGetCourses(req: Request, res: Response) {
  try {
    const response = await getCourses();
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: serverIssue });
  }
}

export default httpGetCourses;
