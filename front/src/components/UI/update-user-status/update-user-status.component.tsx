import { FC } from "react";

const UpdateUserStatus: FC<{
  isActive: boolean;
  onToggleStatus: () => void;
}> = ({ isActive, onToggleStatus }) => {
  return (
    <label className="label cursor-pointer flex gap-x-4">
      <span className="label-text">{isActive ? "Actif" : "Inactif"}</span>
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={isActive}
        onChange={onToggleStatus}
      />
    </label>
  );
};

export default UpdateUserStatus;
