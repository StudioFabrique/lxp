import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import Wrapper from "./wrapper/wrapper.component";
import { getRandomLightColor } from "../../utils/random-tailwind-color";
import { Trash2 } from "lucide-react";

type Props<Item extends { id?: number; _id?: string }> = {
  items: Item[];
  styleOptions: {
    label: string;
    placeholder?: string;
    itemsHasColor?: boolean;
  };
  disabled?: boolean;
  getValue: (item: Item) => string;
  onValidate: (value: string) => void;
  onAddItem: (value: string) => Promise<boolean>;
  onDelete: (item: Item) => Promise<boolean>;
};

const ItemsAdder = <Item extends { id?: number; _id?: string }>({
  items,
  styleOptions,
  disabled,
  getValue,
  onValidate,
  onAddItem,
  onDelete,
}: Props<Item>) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Store colors persistently per item
  const colorMap = useRef<Record<string, string>>({});

  const getColor = (key: string) => {
    if (!colorMap.current[key]) {
      colorMap.current[key] = getRandomLightColor();
    }
    return colorMap.current[key];
  };

  const handleClickAdd = (e?: KeyboardEvent<HTMLInputElement>) => {
    if (e && !(e.code === "Enter" || e.code == "NumpadEnter")) return;
    setIsLoading(true);

    try {
      onValidate(value);
      onAddItem(value);
      setValue("");
      setError("");
      setIsLoading(false);
    } catch (error) {
      setError((error as Error).message);
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    setError("");
  };

  const handleClickDelete = (item: Item) => {
    onDelete(item);
  };

  return (
    <Wrapper>
      <div className="flex flex-col gap-y-2">
        <label
          htmlFor="hobby"
          className="text-xl font-bold flex flex-col gap-y-2"
        >
          {styleOptions.label}
        </label>
        <input
          onKeyDown={handleClickAdd}
          onChange={handleChange}
          type="text"
          className={`input input-sm ${error && "input-error"}`}
          value={value}
          disabled={disabled || isLoading}
          name="hobby"
          placeholder={styleOptions.placeholder}
        />
        <p className="text-error text-sm">{error}</p>
      </div>
      <div className="flex gap-x-5 gap-y-2 flex-wrap overflow-y-auto">
        {items.map((item) => (
          <button
            key={getValue(item)}
            type="button"
            className={`btn group text-base-content pl-6 pr-1 rounded-xl cursor-pointer ${
              styleOptions.itemsHasColor && getColor(getValue(item))
            }`}
            onClick={() => handleClickDelete(item)}
            disabled={disabled || isLoading}
          >
            <p className="truncate max-w-56">{getValue(item)}</p>
            <Trash2 className="transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 w-5" />
          </button>
        ))}
      </div>
    </Wrapper>
  );
};

export default ItemsAdder;
