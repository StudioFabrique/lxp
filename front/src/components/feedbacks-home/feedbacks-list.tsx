import { useMemo } from "react";
import StudentFeedback from "../../utils/interfaces/student-feedback";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";

interface FeedbacksListProps {
  list: StudentFeedback[];
  allChecked: boolean;
  fieldSort: string;
  direction: boolean;
  sortData: (property: string) => void;
  setAllChecked: (value: boolean) => void;
  handleRowCheck: (id: string) => void;
}

export default function FeedbacksList({
  list,
  allChecked,
  fieldSort,
  direction,
  setAllChecked,
  sortData,
  handleRowCheck,
}: FeedbacksListProps) {
  /**
   * gère le coche / décochage de toutes les checkboxes
   */
  const handleAllChecked = useCallback(() => {
    setAllChecked((prevState) => !prevState);
  }, [setAllChecked]);

  const content = useMemo(() => {
    <table className="table w-full border-separate border-spacing-y-2">
      <thead>
        <tr>
          <th>
            <input
              className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
              type="checkbox"
              checked={allChecked}
              onChange={(event) => setAllChecked}
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
              sortData("comment");
            }}
          >
            <div className="flex items-center gap-x-2">
              <p>Role</p>
              <SortColumnIcon
                fieldSort={fieldSort}
                column="comment"
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
              key={item._id}
            >
              <td>
                <input
                  className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
                  type="checkbox"
                  checked={
                    item.isSelected !== undefined ? item.isSelected : false
                  }
                  onChange={() => handleRowCheck(item._id)}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.comment}</td>
            </tr>
          ))}
      </tbody>
    </table>;
  }, [
    allChecked,
    list,
    fieldSort,
    direction,
    handleAllChecked,
    handleRowCheck,
    sortData,
  ]);

  return <>{content}</>;
}
