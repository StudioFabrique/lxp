import { Shield, UserRound } from "lucide-react";

export const PermissionIcon = ({ isRole }: { isRole?: boolean }) =>
  isRole ? (
    <UserRound className="size-4 text-info" />
  ) : (
    <Shield className="size-4 text-warning" />
  );
