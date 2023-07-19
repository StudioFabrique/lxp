import { FC } from "react";

import SortUpIcon from "../svg-icons/sort-up-icon.component";
import SortDownIcon from "../svg-icons/sort-down-icon.component";

type Props = {
  fieldSort: string;
  column: string;
  direction: boolean;
};

const SortColumnIcon: FC<Props> = ({ fieldSort, column, direction }) => {
  return (
    <>
      {fieldSort === column ? (
        direction ? (
          <SortUpIcon />
        ) : (
          <SortDownIcon />
        )
      ) : null}
    </>
  );
};

export default SortColumnIcon;
