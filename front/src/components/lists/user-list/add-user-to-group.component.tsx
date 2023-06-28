import { FC, useContext, useEffect } from "react";
import { DrawerContext } from "../../../store/drawer.store";
import usePagination from "../../../hooks/use-pagination";
import AddUserToGroupItem from "./add-user-to-group-item";

const AddUserToGroup: FC<{ selectedUsers: Array<any> }> = ({
  selectedUsers,
}) => {
  const { isDrawerOpen } = useContext(DrawerContext);
  const handleAllChecked = () => {
    setAllChecked((prevAllChecked) => !prevAllChecked);
  };

  const {
    dataList,
    allChecked,
    getList,
    sortData,
    setAllChecked,
    handleRowCheck,
  } = usePagination("name", "/group/everything");

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    if (isDrawerOpen === true) {
      setAllChecked(false);
    }
  }, [isDrawerOpen, setAllChecked]);

  return (
    <>
      <table className="table w-full">
        <thead>
          <tr>
            <th>
              <input
                className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
                type="checkbox"
                checked={allChecked}
                onChange={handleAllChecked}
              />
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("name");
              }}
            >
              Groupe
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("desc");
              }}
            >
              Description
            </th>
            <th>Nbre d'étudiants</th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("roles");
              }}
            >
              Rôle(s)
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("updatedAt");
              }}
            >
              Mis à jour le
            </th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item: any) => (
            <tr className="hover:bg-primary/20" key={item._id}>
              {
                <AddUserToGroupItem
                  groupItem={item}
                  onRowCheck={handleRowCheck}
                />
              }
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary btn-sm mt-4">Valider</button>
    </>
  );
};

export default AddUserToGroup;
