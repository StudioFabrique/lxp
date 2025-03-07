import Parcours from "../../../utils/interfaces/parcours";

type ParcoursAccomplishmentProps = {
  parcours: Parcours;
};

const ParcoursAccomplishmentItem = ({
  parcours,
}: ParcoursAccomplishmentProps) => {
  return (
    <>
      <div className="flex gap-5 items-center p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
        <span className="text-base-content">{parcours.title}</span>
      </div>
      {parcours.modules?.map((moduleItem) => (
        <div>
          <div className="flex gap-5 items-center p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
            <span className="text-base-content">{moduleItem.title}</span>
          </div>
          <div>
            {moduleItem.courses?.map((courseItem) => (
              <div>
                <div className="flex gap-5 items-center p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                  <span className="text-base-content">{courseItem.title}</span>
                </div>
                <div>
                  {courseItem.accomplishments?.map((accItem) => (
                    <div>
                      <span className="text-sm text-base-content/70">
                        {accItem.accomplishedAt &&
                          new Date(accItem.accomplishedAt).toLocaleString("fr")}
                      </span>
                      <span className="text-base-content">
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
    </>
  );
};

export default ParcoursAccomplishmentItem;
