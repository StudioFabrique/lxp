/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import useHttp from "../../hooks/use-http";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";
import { useCallback } from "react";
import Can from "../UI/can/can.component";
import EditIcon from "../UI/svg/edit-icon";
import { useNavigate } from "react-router-dom";

interface CoursesListProps {
  coursesList: {
    id: number;
    title: string;
  }[];
  moduleId: number;
}

const CoursesList = ({ coursesList, moduleId }: CoursesListProps) => {
  const { sendRequest } = useHttp();
  const {
    allChecked,
    list,
    fieldSort,
    direction,
    setAllChecked,
    handleRowCheck,
    sortData,
  } = useEagerLoadingList(coursesList, "title");
  const nav = useNavigate();

  const content = (
    <>
      {list && list.length > 0 ? (
        <>
          {list.map((item: any) => (
            <tr
              className="text-xs lg:text-sm cursor-pointer hover:bg-secondary/20 hover:text-base-content"
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
              <td className="bg-transparent rounded-l-lg truncate">
                {item.title}
              </td>
              <td className="bg-transparent rounded-r-lg">
                <div
                  className="w-6 h-6 text-secondary"
                  aria-label="afficher la liste des cours"
                >
                  <Can action="update" object="module">
                    <div
                      className="tooltip tooltip-bottom flex-items-center"
                      data-tip="Editer le cours"
                    >
                      <div onClick={() => handleEditCourse(item.id)}>
                        <EditIcon />
                      </div>
                    </div>
                  </Can>
                </div>
              </td>
            </tr>
          ))}
        </>
      ) : null}
    </>
  );

  const handleReleaseCourse = () => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
      }
    };
    sendRequest(
      {
        path: `/modules/release-courses`,
        method: "put",
        body: {
          coursesIds: list
            ?.filter((item) => item.isSelected)
            .map((item) => item.id),
          moduleId,
        },
      },
      applyData
    );
  };

  const handleEditCourse = (id: number) => {
    nav(`/admin/course/edit/${id}`);
  };

  /**
   * gère le coche / décochage de toutes les checkboxes
   */
  const handleAllChecked = useCallback(() => {
    setAllChecked((prevState) => !prevState);
  }, [setAllChecked]);

  return (
    <>
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
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>
      <div className="divider" />
      <div className="w-full flex justify-end">
        <button className="btn btn-primary" onClick={handleReleaseCourse}>
          Détacher les cours du module
        </button>
      </div>
    </>
  );
};

export default CoursesList;
