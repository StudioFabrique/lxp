import { FC } from "react";

import SortUpIcon from "../svg/sort-up-icon.component";
import SortDownIcon from "../svg/sort-down-icon.component";

type Props = {
  fieldSort: string;
  column: string;
  direction: boolean;
};

const SortColumnIcon: FC<Props> = ({ fieldSort, column, direction }) => {
  return (
    <>
      {fieldSort === column && direction && <SortUpIcon />}
      {fieldSort === column && !direction && <SortDownIcon />}
    </>
  );
};

export default SortColumnIcon;
