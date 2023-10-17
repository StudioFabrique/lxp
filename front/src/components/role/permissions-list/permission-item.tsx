import { FC } from "react";

const PermissionItem: FC<{ item: any; isDefaultChecked: boolean }> = ({
  item,
  isDefaultChecked,
}) => {
  return (
    <span>
      <input
        type="checkbox"
        name="permCheck"
        id="permCheck"
        className="checkbox"
        defaultChecked={isDefaultChecked}
      />
    </span>
  );
};

export default PermissionItem;
