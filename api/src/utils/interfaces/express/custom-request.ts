import { Request } from "express";

export default interface CustomRequest extends Request {
  auth?: {
    userId: string;
    userRole: string;
  };
}
