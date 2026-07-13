import { Request, Response } from "express";
import User from "../../utils/interfaces/db/user";
import Role from "../../utils/interfaces/db/role";

export default async function httpGetSetupStatus(
  _req: Request,
  res: Response,
) {
  try {
    const adminRole = await Role.findOne({ role: "admin" });
    if (!adminRole) {
      return res.status(200).json({ hasAdmins: false });
    }

    const adminCount = await User.countDocuments({
      roles: adminRole._id,
      isActive: true,
    });

    return res.status(200).json({ hasAdmins: adminCount > 0 });
  } catch {
    return res.status(200).json({ hasAdmins: true });
  }
}
