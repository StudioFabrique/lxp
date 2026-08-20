import { validationResult } from "express-validator";
import { type NextFunction, type Response } from "express";

import type { OnboardingStatus } from "../../utils/interfaces/db/user.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import patchOnboarding from "../../models/auth/patch-onboarding.ts";

async function httpPatchOnboarding(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({ errors: validation.array() });
  }

  try {
    const status = req.body.status as OnboardingStatus;
    const step = req.body.step as string;
    const version = req.body.version as number;

    const onboarding = await patchOnboarding(req.auth?.userId, {
      status,
      step,
      version,
    });

    if (!onboarding) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    return res.status(200).json(onboarding);
  } catch (error) {
    next(error);
  }
}

export default httpPatchOnboarding;
