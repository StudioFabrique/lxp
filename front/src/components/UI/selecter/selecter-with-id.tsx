import { FC, ChangeEvent } from "react";

type Item = {
  id?: number;
  value: string;
};

type Props = {
  list: Array<Item>;
  title?: string;
  id?: number;
  onSelectItem: (id: number) => void;
  styleGhost?: boolean;
};

const SelecterWithId: FC<Props> = ({
  list,
  title,
  id = 0,
  onSelectItem,
  styleGhost,
}) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const id = parseInt(event.currentTarget.value);
    if (id > 0) {
      onSelectItem(id);
    }
  };

  return (
    <>
      {list ? (
        <select
          className={`select select-sm ${styleGhost && "select-ghost bg-transparent focus:outline-none focus:text-base-300"}`}
          name="menu"
          id="menu"
          value={id}
          onChange={handleChange}
        >
          {title ? <option value={0}>{title}</option> : null}

          {list.map((item: Item) => (
            <option
              className="capitalize text-xs text-base-300"
              key={item.id}
              value={item.id}
            >
              {item.value}
            </option>
          ))}
        </select>
      ) : null}
    </>
  );
};

export default SelecterWithId;
