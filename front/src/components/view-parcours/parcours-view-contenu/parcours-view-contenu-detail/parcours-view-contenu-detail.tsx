import SubWrapper from "../../../UI/sub-wrapper/sub-wrapper.component";
import BookIcon from "../../../UI/svg/book-icon";
import { colorStyle, colorStyleHover } from "../../../../config/colors";
import Can from "../../../UI/can/can.component";
import { FC, useEffect, useState } from "react";
import useHttp from "../../../../hooks/use-http";
import { sortArray } from "../../../../utils/sortArray";
import Course from "../../../../utils/interfaces/course";

const ParcoursViewContenuDetail: FC<{ moduleId: number }> = ({ moduleId }) => {
  const { sendRequest, isLoading } = useHttp(true);
  const [courses, setCourses] = useState<Course[]>([]);

  /**
   * récupère la liste des cours depuis la bdd
   */
  useEffect(() => {
    const applyData = (data: any) => {
      setCourses(
        sortArray(
          data.filter((item: any) =>
            item.module.id === moduleId
              ? {
                  ...item,
                  module: {
                    ...item.module,
                    parcours: item.module.parcours[0].parcours,
                  },
                }
              : null
          ),
          "createdAt"
        )
      );
    };
    sendRequest(
      {
        path: "/course",
      },
      applyData
    );
  }, [sendRequest, moduleId]);

  const contentsList =
    !isLoading && courses!.length > 0 ? (
      courses.map((course, i) => (
        <div
          key={course?.id}
          className={`flex items-center bg-secondary p-4 rounded-lg ${colorStyle} ${colorStyleHover}`}
        >
          <span className="w-14 h-14 mx-4">
            <BookIcon />
          </span>
          <div className="flex flex-col items-center">
            <p className="self-start">{`Cours ${i + 1}`}</p>
            <div className="flex justify-between w-full">
              <p className="self-start text-xl font-bold">{course.title}</p>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>Aucun cours</p>
    );

  return (
    <SubWrapper>
      <span className="flex justify-between">
        <h2 className="text-xl font-bold text-primary">Contenu du module</h2>
        <Can action="write" object="cours">
          <button type="button" className="btn btn-primary btn-sm">
            Ajouter un cours
          </button>
        </Can>
      </span>
      <div className="flex flex-col gap-y-5">{contentsList}</div>
    </SubWrapper>
  );
};

export default ParcoursViewContenuDetail;
