import { FC, ChangeEvent } from "react";

type Item = {
  id: number;
  title: string;
};

type Props = {
  list: Array<Item>;
  title: string;
  id?: number | null;
  onSelectItem: (id: number) => void;
};

const SelecterGroup: FC<Props> = ({ list, title, id = 0, onSelectItem }) => {
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
          className="w-full select select-sm border border-neutral/50 focus:outline-none"
          name="menu"
          id="menu"
          value={id ?? 0}
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

export default SelecterGroup;
