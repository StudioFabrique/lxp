import { ArrowRight, Component, Rocket } from "lucide-react";
import Parcours from "../../../utils/interfaces/parcours";
import CourseIcon from "../../UI/svg/course-icon";

type ParcoursAccomplishmentProps = {
  parcours: Parcours;
};

const ParcoursAccomplishmentItem = ({
  parcours,
}: ParcoursAccomplishmentProps) => {
  return (
    <>
      <div className="flex gap-5 items-center p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
        <Rocket size={16} />
        <span className="text-primary font-bold text-lg">
          Parcours : {parcours.title}
        </span>
      </div>
      <div className="ml-8 flex flex-col gap-5">
        {parcours.modules?.map((moduleItem) => (
          <div key={moduleItem.id}>
            <div className="flex gap-5 items-center p-3 bg-base-200/70 rounded-lg hover:bg-base-300 transition-colors">
              <Component size={14} />
              <span className="text-secondary font-semibold">
                Module : {moduleItem.title}
              </span>
            </div>
            <div className="ml-8">
              {moduleItem.courses?.map((courseItem) => (
                <div key={courseItem.id}>
                  <div className="flex gap-5 items-center p-2 bg-base-200/50 rounded-lg hover:bg-base-300 transition-colors mt-2">
                    <span className="w-5">
                      <CourseIcon />
                    </span>
                    <span className="text-base-content">
                      Cours : {courseItem.title}
                    </span>
                  </div>
                  <div className="ml-8">
                    {courseItem.accomplishments?.map((accItem) => (
                      <div
                        key={accItem.id}
                        className="flex gap-3 items-center p-2 mt-1"
                      >
                        <ArrowRight size={10} />
                        <span className="text-sm text-base-content/70">
                          {accItem.accomplishedAt &&
                            new Date(accItem.accomplishedAt).toLocaleString(
                              "fr",
                            )}
                        </span>
                        <span className="text-base-content text-sm">
                          {accItem.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ParcoursAccomplishmentItem;
