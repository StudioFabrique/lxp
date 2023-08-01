import { FC, useState, ChangeEvent } from "react";

type Item = {
  id: number;
  title: string;
};

type Props = {
  list: Array<Item>;
  title: string;
  formation?: Item;
  onSelectItem: (id: number) => void;
};

const Selecter: FC<Props> = ({
  list,
  title,
  formation = { id: 0, title: "" },
  onSelectItem,
}) => {
  const [listItem, setListItem] = useState<number>(formation.id);

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
          className="w-full select select-sm border border-neutral/50 focus:outline-none"
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
