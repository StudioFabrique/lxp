import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { noAccess, serverIssue } from "../../utils/constantes.ts";
import getUser from "../../models/user/get-user.ts";
import { imageToDataUrl } from "../../utils/images/image-source.ts";

async function httpHandshake(req: CustomRequest, res: Response) {
  if (req.auth && req.auth.userId !== null) {
    try {
      const user = await getUser(new Object(req.auth.userId));
      if (user && user.isActive) {
        return res.status(200).json({
          _id: user._id.toString(),
          email: user.email,
          roles: user.roles,
          avatar: imageToDataUrl(user.avatar),
          createdAt: user.createdAt,
          firstname: user.firstname,
          lastname: user.lastname,
          onboarding: user.onboarding ?? {
            status: "pending",
            step: "",
            version: 1,
          },
          abilityRules: req.auth.abilityRules,
        });
      }
      return res.status(401).json({ message: noAccess });
    } catch (err) {
      return res.status(500).json({ message: serverIssue });
    }
  }
}

export default httpHandshake;
