import { FC } from "react";

import Badge from "../../utils/interfaces/badge";
import badgeImg from "../../assets/images/tmp/badge-react.png";

type Props = {
  selectedBadge?: Badge;
  badgeList: Array<Badge>;
  onSubmitBadge: (badge: Badge) => void;
  onCreateBadge: () => void;
};

const BadgeList: FC<Props> = ({
  selectedBadge,
  badgeList,
  onSubmitBadge,
  onCreateBadge,
}) => {
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

  console.log({ badgeList });

  let content = (
    <>
      <ul className="grid grid-cols-5 gap-x-2 gap-y-2">
        {badgeList.map((item: Badge) => (
          <div
            className="tooltip hover:tooltip-open tooltip-bottom"
            data-tip={item.title}
            key={item.id}
          >
            <li onClick={() => handleUpdateBadge(item)}>
              <div className={setBadgeStyle(item.id)}>
                <img className="w-8 h-8" src={badgeImg} alt={item.title} />
              </div>
            </li>
          </div>
        ))}
        <div
          className="tooltip hover:tooltip-open tooltip-bottom"
          data-tip="Ajouter un nouveau badge"
        >
          <li key={badgeList.length}>
            <div className={badgeStyle} onClick={onCreateBadge}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </li>
        </div>
      </ul>
    </>
  );

  return <>{content}</>;
};

export default BadgeList;
