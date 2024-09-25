/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import Role from "../../../utils/interfaces/role";
import GroupItem from "./group-item.component";
import { GroupModalContent } from "../../../views/group/group-home";

const GroupList: FC<{
  role: Role;
  allChecked: boolean;
  groupList: Array<any>;
  showActions?: boolean;
  onRowCheck: (id: string) => void;
  onAllChecked: () => void;
  onSorting: (column: string) => void;
  onUncheckAll: () => void;
  onSetUsersModalContent: Dispatch<
    SetStateAction<GroupModalContent | undefined>
  >;
  onSetFormModalContent: Dispatch<
    SetStateAction<GroupModalContent | undefined>
  >;
}> = ({
  allChecked,
  role,
  groupList,
  showActions = true,
  onRowCheck,
  onAllChecked,
  onUncheckAll,
  onSorting,
  onSetUsersModalContent,
  onSetFormModalContent,
}) => {
  const handleAllChecked = () => {
    onAllChecked();
  };

  useEffect(() => {
    onUncheckAll();
  }, [role, onUncheckAll]);

  const content = (
    <table className="table w-full">
      <thead className="bg-none">
        <tr>
          <th className="z-0">
            <input
              className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
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
          {showActions ? <th>Actions</th> : null}
        </tr>
      </thead>
      <tbody>
        {groupList.map((item: any) => (
          <tr className="hover:bg-primary/20" key={item._id}>
            {
              <GroupItem
                groupItem={item}
                onRowCheck={onRowCheck}
                showActions={showActions}
                onSetUsersModalContent={onSetUsersModalContent}
                onSetFormModalContent={onSetFormModalContent}
              />
            }
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
