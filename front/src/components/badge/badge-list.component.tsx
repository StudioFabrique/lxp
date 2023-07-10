import React, { FC } from "react";

import Badge from "../../utils/interfaces/badge";
import badgeImg from "../../assets/images/tmp/badge-react.png";
import { useSelector } from "react-redux";
import ImportBadges from "../skills/import-badges.component";

type Props = {
  selectedBadge?: any;
  onSubmitBadge: (badge: any) => void;
};

const BadgeList: FC<Props> = ({ selectedBadge, onSubmitBadge }) => {
  const badgeList = useSelector((state: any) => state.parcours.badges);

  console.log({ badgeList });

  const handleUpdateBadge = (newBadge: Badge) => {
    onSubmitBadge(newBadge);
  };

  let badgeStyle =
    "w-[75px] h-[75px] bg-secondary/20 p-4 rounded-xl flex justify-center items-center hover:scale-105 hover:bg-secondary/50";

  const setBadgeStyle = (badgeId: number) => {
    if (selectedBadge) {
      return badgeId === selectedBadge.id
        ? badgeStyle + " border border-primary"
        : badgeStyle;
    } else {
      return badgeStyle;
    }
  };

  let content = (
    <>
      {badgeList.length > 0 ? (
        <ul className="grid grid-cols-5 px-4 gap-x-2 gap-y-2 mt-2">
          {badgeList.map((item: Badge) => (
            <>
              {item.title ? (
                <div
                  className="tooltip hover:tooltip-open tooltip-bottom"
                  data-tip={item.title}
                  key={item.id}
                >
                  <li onClick={() => handleUpdateBadge(item)}>
                    <div className={setBadgeStyle(item.id)}>
                      <img
                        className="w-8 h-8"
                        src={item.image}
                        alt={item.title}
                      />
                    </div>
                  </li>
                </div>
              ) : (
                <div className="indicator">
                  <span className="indicator-item badge badge-warning">
                    ...
                  </span>
                  <div
                    className="tooltip hover:tooltip-open tooltip-bottom"
                    data-tip="Nouveau"
                    key={item.id}
                  >
                    <li onClick={() => handleUpdateBadge(item)}>
                      <div className={setBadgeStyle(item.id)}>
                        <img
                          className="w-8 h-8"
                          src={item.image}
                          alt="Nouveau Badge"
                        />
                      </div>
                    </li>
                  </div>
                </div>
              )}
            </>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-y-4 my-8">
          <p>Aucun badge dans la liste</p>
          <ImportBadges label="Importer des badges" outline={false} />
        </div>
      )}
    </>
  );

  return <>{content}</>;
};

const MemoizedBadgeList = React.memo(BadgeList);

export default MemoizedBadgeList;
