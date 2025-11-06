import { useCallback, useMemo } from "react";

import useEagerLoadingList from "../../../hooks/use-eager-loading-list";
import SortColumnIcon from "../../UI/sort-column-icon.component/sort-column-icon.component";
import { LessonWithActivitiesCount } from "../../../utils/interfaces/lesson";

interface LessonsTableProps {
  list?: LessonWithActivitiesCount[];
  onAddItems?: (ids: number[]) => void;
  onCloseDrawer?: (id: string) => void;
}

const LessonsTable = (props: LessonsTableProps) => {
  const {
    allChecked,
    list,
    fieldSort,
    direction,
    setAllChecked,
    handleRowCheck,
    sortData,
  } = useEagerLoadingList(props.list!, "activitiesCount");

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
                sortData("title");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Titre</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="title"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("activitiesCount");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Nombre d'activités</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="activitiesCount"
                  direction={direction}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {list &&
            list.map((item: LessonWithActivitiesCount) => (
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
                <td>{item.title}</td>
                <td className="text-center">{item.activitiesCount}</td>
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

  const handleAddItems = () => {
    if (list) {
      const items = list
        .filter((item) => item.isSelected)
        .map((item) => item.id);
      props.onAddItems!(items);
      props.onCloseDrawer!("add-skills");
    }
  };

  return (
    <>
      {list && list.length > 0 ? (
        <>
          {table}
          <div className="w-full flex justify-end mt-4">
            <button className="btn btn-primary" onClick={handleAddItems}>
              Ajouter
            </button>
          </div>
        </>
      ) : (
        <p>Tous les contenus ont déja été ajoutés</p>
      )}
    </>
  );
};

export default LessonsTable;
