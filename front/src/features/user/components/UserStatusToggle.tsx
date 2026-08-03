import { cn } from "../../../utils/cn";

const UserStatusToggle = ({ isActive }: { isActive: boolean }) => {
  return (
    <label className="label cursor-pointer flex justify-between items-center gap-x-4">
      <span
        className={cn("label-text", {
          "text-success": isActive,
          "text-warning": !isActive,
        })}
      >
        {isActive ? "Actif" : "Inactif"}
      </span>
    </label>
  );
};

export default UserStatusToggle;
