import { Dispatch, FC, FormEvent, SetStateAction } from "react";

const SearchSimple: FC<{
  placeholder: string;
  setFilter: Dispatch<SetStateAction<string | undefined>>;
}> = ({ placeholder, setFilter }) => {
  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    setFilter(event.currentTarget.value);
  };

  return (
    <form className="flex items-center bg-secondary/10 w-[40%] gap-x-2 p-2 rounded-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <input
        type="text"
        onInputCapture={handleChange}
        className="bg-transparent focus:outline-none w-full text-sm"
        placeholder={placeholder}
      />
    </form>
  );
};

export default SearchSimple;
