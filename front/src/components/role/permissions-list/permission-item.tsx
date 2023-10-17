import { FC } from "react";

const PermissionItem: FC<{ item: any }> = ({ item }) => {
  return (
    <div className="flex flex-col">
      <p className="capitalize">{item.action}</p>
      {item.ressources.map((ressource: any) => (
        <span key={ressource}>
          <input
            type="checkbox"
            name="permCheck"
            id="permCheck"
            className="checkbox"
          />
        </span>
      ))}
    </div>
  );
};

export default PermissionItem;
