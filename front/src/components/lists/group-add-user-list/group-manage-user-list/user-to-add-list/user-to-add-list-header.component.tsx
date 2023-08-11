import { Dispatch, FC, SetStateAction } from "react";
import SortUpIcon from "../../../../UI/svg-icons/sort-up-icon.component";
import SortDownIcon from "../../../../UI/svg-icons/sort-down-icon.component";

const UserToAddListHeader: FC<{
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  order: string;
  setOrder: Dispatch<SetStateAction<string>>;
}> = ({ filter, setFilter, value, setValue, order, setOrder }) => {
  const handleClickOrder = () => {
    setOrder((order) => (order === "DESC" ? "ASC" : "DESC"));
  };

  return (
    <div className="flex justify-between px-5">
      <span className="flex gap-x-5 items-center">
        <input type="checkbox" className="checkbox checkbox-sm" />
        <p>Sélection multiple</p>
      </span>
      <span className="flex ">
        <p>Trier par :</p>
        <button className="btn btn-ghost btn-xs flex gap-x-5 items-center capitalize">
          {filter}
        </button>
        <button
          className="btn btn-ghost btn-xs flex gap-x-5 items-center capitalize"
          onClick={handleClickOrder}
        >
          {order === "DESC" ? <SortDownIcon /> : <SortUpIcon />}
        </button>
      </span>
    </div>
  );
};

export default UserToAddListHeader;
