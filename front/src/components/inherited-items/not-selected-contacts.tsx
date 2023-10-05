import { useCallback, useMemo } from "react";

import Contact from "../../utils/interfaces/contact";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";

interface NotSelectedContactsProps {
  list?: Contact[];
  onAddItem?: (contactsIds: number[]) => void;
  onCloseDrawer?: (id: string) => void;
}

const NotSelectedContacts = (props: NotSelectedContactsProps) => {
  const {
    allChecked,
    list,
    fieldSort,
    direction,
    setAllChecked,
    handleRowCheck,
    sortData,
  } = useEagerLoadingList(props.list!, "name");

  /**
   * gère le coche / décochage de toutes les checkboxes
   */
  const handleAllChecked = useCallback(() => {
    setAllChecked((prevState) => !prevState);
  }, [setAllChecked]);

  const table = useMemo(() => {
    return (
      <table className="table w-full border-separate border-spacing-y-2">
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
              <div className="flex items-center gap-x-2">
                <p>Nom</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="name"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("role");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Role</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="role"
                  direction={direction}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {list &&
            list.map((item) => (
              <tr
                className="bg-secondary/10 hover:bg-secondary/20 hover:text-base-content"
                key={item.id}
              >
                <td>
                  <input
                    className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
                    type="checkbox"
                    checked={
                      item.isSelected !== undefined ? item.isSelected : false
                    }
                    onChange={() => handleRowCheck(item.id)}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.role}</td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  }, [
    allChecked,
    direction,
    fieldSort,
    handleAllChecked,
    handleRowCheck,
    list,
    sortData,
  ]);

  const handleAddContacts = () => {
    if (list) {
      const contacts = list
        .filter((item) => item.isSelected)
        .map((item) => item.id);
      props.onAddItem!(contacts);
      props.onCloseDrawer!("add-contacts");
    }
  };

  return (
    <>
      {list && list.length > 0 ? (
        <>
          {table}
          <div className="w-full flex justify-end mt-4">
            <button className="btn btn-primary" onClick={handleAddContacts}>
              Ajouter
            </button>
          </div>
        </>
      ) : (
        <p>Tous les contacts ont déja été ajoutés</p>
      )}
    </>
  );
};

export default NotSelectedContacts;
