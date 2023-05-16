import { FC, useCallback, useContext, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import usePagination from "../../../hooks/use-pagination";
import Pagination from "../../UI/pagination/pagination";
import UserItem from "./group-item.component";
import RoleSelect from "./roles-select";
import Role from "../../../utils/interfaces/role";
import { sortArray } from "../../../utils/sortArray";
import { hasPermission } from "../../../utils/hasPermission";
import { Context } from "../../../store/context.store";
import Can from "../../UI/can/can.component";
import Modal from "../../UI/modal/modal";

const GroupList: FC<{ role: Role }> = ({ role }) => {
  const [groupList, setGroupList] = useState<any>([]);
  const [stype, setStype] = useState("lastname"); // to correct
  const [sdir, setSdir] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const { sendRequest } = useHttp();
  const { page, perPage, totalPages, setTotalPages, initPagination, setPage } =
    usePagination();
  const { user } = useContext(Context);
  const [showErrorModal, setShowErrorModal] = useState(false);

  console.log(groupList);

  const handleSorting = (column: string) => {
    if (column !== stype) {
      setSdir(false);
    } else {
      setSdir((prevSdir) => {
        return !prevSdir;
      });
    }
    setStype(column);
    initPagination();
  };

  const getGroupList = useCallback(() => {
    console.log("fetching groups list");

    const applyData = (data: any) => {
      let index = (page - 1) * perPage + 1;
      data.users.forEach((item: any) => {
        item.index = index++ + ".";
        item.createdAt =
          item?.createdAt && new Date(item.createdAt).toLocaleDateString();
        item.updatedAt =
          item?.updatedAt && new Date(item.updatedAt).toLocaleDateString();
        item.isSelected = false;
      });
      setTotalPages(data.total);
      setGroupList(data.groups);
      setAllChecked(false);
    };
    if (role) {
      console.log("role", role.role);

      sendRequest(
        {
          path: `/group/${role.role}/${stype}/${
            sdir ? "desc" : "asc"
          }?page=${page}&limit=${perPage}`,
        },
        applyData
      );
    }
  }, [sendRequest, page, perPage, setTotalPages, role, stype, sdir]);

  useEffect(() => {
    getGroupList();
  }, [getGroupList]);

  const handleCheckRow = (id: string) => {
    setGroupList((prevGroupList: any) =>
      prevGroupList.map((item: any) =>
        item._id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const handleAllChecked = () => {
    setAllChecked((prevAllChecked) => {
      return !prevAllChecked;
    });
    setGroupList((prevGroupList: any) =>
      prevGroupList.map((item: any) => ({
        ...item,
        isSelected: !allChecked,
      }))
    );
  };

  const handleRolesChange = (newRoles: Array<Role>, groupId: string) => {
    const updatedGroupList = groupList.map((item: any) =>
      item._id === groupId
        ? {
            ...item,
            roles: sortArray(newRoles, "rank"),
          }
        : item
    );
    setGroupList(updatedGroupList);

    const applyData = (data: any) => {
      console.log(data);
    };
    sendRequest(
      {
        path: `/group/${role.role === "admin" ? "user" : "student"}/${groupId}`,
        method: "put",
        body: newRoles,
      },
      applyData
    );
  };

  useEffect(() => {
    initPagination();
    setAllChecked(false);
  }, [role, initPagination]);

  const setErrorModal = () => {
    setShowErrorModal((prevState) => !prevState);
  };

  const handleGroupRolesChange = async (updatedRoles: Array<Role>) => {
    const selectedGroupList = groupList.filter(
      (group: any) => group.isSelected === true
    );
    const updatedGroupList = Array<string>();

    for (const selectedUser of selectedGroupList) {
      if (
        (await hasPermission("update", updatedRoles[0].role)) &&
        updatedRoles[0].rank >= user!.roles[0].rank &&
        updatedRoles.length > 0
      ) {
        updatedGroupList.push(selectedUser._id);
      }
    }
    console.table(updatedRoles);
    console.table(updatedGroupList);

    if (
      selectedGroupList.length > updatedGroupList.length ||
      updatedRoles.length < 1
    ) {
      setShowErrorModal(true);
      return;
    }

    const updatedRolesIds = updatedRoles.map((role: Role) => role._id);

    const applyData = (data: any) => {
      console.log(data);
      initPagination();
      getGroupList();
    };
    if (updatedGroupList.length > 0) {
      sendRequest(
        {
          path: "/group/",
          method: "put",
          body: {
            studentsToUpdate: updatedGroupList,
            rolesId: updatedRolesIds,
          },
        },
        applyData
      );
    }
  };

  let content = (
    <table className="table w-full">
      <thead>
        <tr>
          <th className="z-0">
            <input
              className="my-auto checkbox"
              type="checkbox"
              checked={allChecked}
              onChange={handleAllChecked}
            />
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              handleSorting("name");
            }}
          >
            Nom du groupe
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              handleSorting("desc");
            }}
          >
            Description
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              handleSorting("formation");
            }}
          >
            Formation
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              handleSorting("isActive");
            }}
          >
            Status
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {groupList.map((item: any) => (
          <tr className="hover:bg-primary/20" key={item._id}>
            {
              <UserItem
                userItem={item}
                onRowCheck={handleCheckRow}
                onRolesChange={handleRolesChange}
              />
            }
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="flex flex-col gap-y-4">
      {showErrorModal ? (
        <Modal
          title="Mettre à jour les rôles des utilisateurs sélectionnés"
          message="Un ou plusieurs utilisateurs ne peuvent pas être mis à jour."
          rightLabel="Fermer"
          onRightClick={setErrorModal}
        />
      ) : null}
      <div>
        {role && groupList.length > 0 ? (
          <Can action={"update"} subject={role.role}>
            <RoleSelect
              roleTab={role}
              onGroupRolesChange={handleGroupRolesChange}
            />
          </Can>
        ) : null}
      </div>
      <>
        {groupList.length > 0 ? (
          <>
            {content}
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </>
        ) : (
          <p>Rien à afficher</p>
        )}
      </>
    </div>
  );
};

export default GroupList;
