import { Search } from "lucide-react";
import {
  Dispatch,
  FormEvent,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";

export type SearchBarProps = {
  title?: string;
  placeholder?: string;
  onSubmit?: () => Promise<void>;
  onSetFilter?: Dispatch<SetStateAction<string | undefined>>;
};

const SearchBar = ({
  title,
  placeholder,
  onSetFilter,
  onSubmit,
  children,
}: PropsWithChildren<SearchBarProps>) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    onSetFilter && onSetFilter(event.currentTarget.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    if (!onSubmit) return;
    event.preventDefault();
    setLoading(true);
    await onSubmit();
    setLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-5 items-center w-full">
      {title ? (
        <h2 className="text-lg font-bold text-base-content">{title}</h2>
      ) : null}

      <div className="flex items-center justify-end gap-5 w-full">
        <form
          className="flex items-center bg-secondary/10 w-[45vh] gap-x-2 p-2 rounded-md"
          onSubmit={handleSubmit}
        >
          <Search />
          <input
            type="text"
            onInputCapture={handleChange}
            className="bg-transparent focus:outline-none w-full text-sm"
            placeholder={placeholder}
            disabled={isLoading}
          />
        </form>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </div>
  );
};

export default SearchBar;
