import { useCallback, useMemo } from "react";
import useEagerLoadingList from "../../../hooks/use-eager-loading-list";
import SortColumnIcon from "../../UI/sort-column-icon.component/sort-column-icon.component";
import Skill from "../../../utils/interfaces/skill";
import TrophyIcon from "../../UI/svg/trophy-icon.component";

interface NotSelectedSkillsProps {
  list?: Skill[];
  onAddItems?: (ids: number[]) => void;
  onCloseDrawer?: (id: string) => void;
}

const NotSelectedSkills = (props: NotSelectedSkillsProps) => {
  const {
    allChecked,
    list,
    fieldSort,
    direction,
    setAllChecked,
    handleRowCheck,
    sortData,
  } = useEagerLoadingList(props.list!, "description");

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
            <th>Badge</th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("description");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Description</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="description"
                  direction={direction}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {list &&
            list.map((item: Skill) => (
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
                <td>
                  <div className="avatar">
                    {item.badge ? (
                      <div className="w-8 h-8">
                        <img src={item.badge} alt={item.description} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 text-primary">
                        <TrophyIcon />
                      </div>
                    )}
                  </div>
                </td>
                <td>{item.description}</td>
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
        <p>Toutes les compétences ont déja été ajoutées</p>
      )}
    </>
  );
};

export default NotSelectedSkills;
