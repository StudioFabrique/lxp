import { FC, useState, ChangeEvent } from "react";

type Item = {
  id: number;
  title: string;
};

type Props = {
  list: Array<Item>;
  title: string;
  defaultItem?: Item;
  size?: "sm" | "md" | "lg";
  onSelectItem: (id: number) => void;
};

const Selecter: FC<Props> = ({
  list,
  title,
  defaultItem = { id: 0, title: "" },
  onSelectItem,
  size,
}) => {
  const [listItem, setListItem] = useState<number>(defaultItem.id);

  const selectSize = size ? "select-" + size : "select-sm";

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const id = parseInt(event.currentTarget.value);
    if (id > 0) {
      setListItem(id);
      onSelectItem(id);
    }
  };

  return (
    <>
      {list ? (
        <select
          className={
            "w-full select select-primary border border-neutral/50 focus:outline-none " +
            selectSize
          }
          name="menu"
          id="menu"
          value={listItem}
          onChange={handleChange}
        >
          <option value={0}>{title}</option>

          {list.map((item: Item) => (
            <option
              className="capitalize text-xs"
              key={item.id}
              value={item.id}
            >
              {item.title}
            </option>
          ))}
        </select>
      ) : null}
    </>
  );
};

export default Selecter;
