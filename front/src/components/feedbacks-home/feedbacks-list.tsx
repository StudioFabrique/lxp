/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useMemo } from "react";
import StudentFeedback from "../../utils/interfaces/student-feedback";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import { localeDate, localeTime } from "../../helpers/locale-date";
import FeelingLevel from "../UI/feeling-level";

interface FeedbacksListProps {
  feedbacks: StudentFeedback[];
}

export default function FeedbacksList({ feedbacks }: FeedbacksListProps) {
  const {
    allChecked,
    list,
    fieldSort,
    direction,
    setAllChecked,
    handleRowCheck,
    sortData,
  } = useEagerLoadingList(feedbacks, "name", 15, "_id");
  /**
   * gère le coche / décochage de toutes les checkboxes
   */
  const handleAllChecked = useCallback(() => {
    setAllChecked((prevState) => !prevState);
  }, [setAllChecked]);

  const content = useMemo(() => {
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
                sortData("comment");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Commentaire</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="comment"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("feelingLevel");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Humeur</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="feelingLevel"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("feedbackAt");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Date</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="feedbackAt"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("teacher");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Vu par</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="teacher"
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
                <td>
                  <FeelingLevel value={item.feelingLevel} size={6} />
                </td>
                <td>
                  {localeDate(item.feedbackAt)} à {localeTime(item.feedbackAt)}
                </td>
                <td className="capitalize">{item.teacher}</td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  }, [
    allChecked,
    list,
    fieldSort,
    direction,
    handleRowCheck,
    sortData,
    handleAllChecked,
  ]);

  console.log({ list });

  return <>{content}</>;
}
