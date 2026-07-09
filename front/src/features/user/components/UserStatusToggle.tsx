const UserStatusToggle = ({
  isActive,
  onToggle,
}: {
  isActive: boolean;
  onToggle: () => void;
}) => {
  return (
    <label className="label cursor-pointer flex justify-between items-center gap-x-4">
      <span className="label-text">{isActive ? "Actif" : "Inactif"}</span>
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={isActive}
        onChange={onToggle}
      />
    </label>
  );
};

export default UserStatusToggle;
