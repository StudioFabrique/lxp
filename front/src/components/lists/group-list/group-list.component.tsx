import { FC, useEffect, useState } from "react";
import Role from "../../../utils/interfaces/role";
import GroupItem from "./group-item.component";

const GroupList: FC<{
  role: Role;
  groupList: Array<any>;
  onRowCheck: (id: string) => void;
  onAllChecked: (value: boolean) => void;
  onSorting: (column: string) => void;
}> = ({ role, groupList, onRowCheck, onAllChecked, onSorting }) => {
  const [allChecked, setAllChecked] = useState(false);

  const handleAllChecked = () => {
    setAllChecked((prevAllChecked) => {
      return !prevAllChecked;
    });
    onAllChecked(allChecked);
  };

  useEffect(() => {
    setAllChecked(false);
    onAllChecked(false);
  }, [role, onAllChecked]);

  let content = (
    <table className="table w-full">
      <thead className="bg-none">
        <tr>
          <th className="z-0">
            <input
              className="my-auto checkbox"
              type="checkbox"
              checked={allChecked}
              onChange={handleAllChecked}
            />
          </th>
          <th></th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("name");
            }}
          >
            Nom
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              onSorting("desc");
            }}
          >
            Description
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {groupList.map((item: any) => (
          <tr className="hover:bg-primary/20" key={item._id}>
            {<GroupItem groupItem={item} onRowCheck={onRowCheck} />}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="flex flex-col gap-y-4">
      <>{groupList.length > 0 ? <>{content}</> : <p>Rien à afficher</p>}</>
    </div>
  );
};

export default GroupList;
