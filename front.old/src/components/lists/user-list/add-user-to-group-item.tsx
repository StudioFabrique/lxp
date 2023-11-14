import { FC } from "react";
import toTitleCase from "../../../utils/toTitleCase";
import Role from "../../../utils/interfaces/role";

const AddUserToGroupItem: FC<{
  groupItem: any;
  onRowCheck: (id: string) => void;
}> = ({ groupItem, onRowCheck }) => {
  return (
    <>
      <td className="bg-transparent">
        <input
          className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
          type="checkbox"
          checked={groupItem.isSelected}
          onChange={() => onRowCheck(groupItem._id)}
        />
      </td>
      <td className="bg-transparent">{toTitleCase(groupItem.name)}</td>
      <td className="bg-transparent">{toTitleCase(groupItem.desc)}</td>
      <td className="bg-transparent text-center">-</td>
      <td className="bg-transparent">
        <ul>
          {groupItem.roles.map((item: Role) => (
            <li key={item._id}>{toTitleCase(item.label)}</li>
          ))}
        </ul>
      </td>
      <td className="bg-transparent">{groupItem.updatedAt}</td>
    </>
  );
};

export default AddUserToGroupItem;
