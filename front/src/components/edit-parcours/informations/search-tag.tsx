import { Search } from "lucide-react";

import { ChangeEvent, Dispatch, SetStateAction } from "react";

type Props = {
  searchTerm: string;
  onSetSearchTerm: Dispatch<SetStateAction<string>>;
};

export default function SearchTag(props: Props) {
  const handleChangeTerm = (event: ChangeEvent<HTMLInputElement>) => {
    props.onSetSearchTerm(event.currentTarget.value);
  };

  return (
    <div className="w-full flex flex-col items-end place-items-center pb-2">
      <label className="w-full input input-bordered flex items-center gap-2">
        <Search className="w-4 h-4" />
        <input
          type="search"
          className="grow focus:outline-none"
          name="search"
          placeholder="Rechercher un tag"
          value={props.searchTerm}
          onChange={handleChangeTerm}
        />
      </label>
    </div>
  );
}
