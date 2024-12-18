import { Search, X } from "lucide-react";
import {
  Dispatch,
  FormEvent,
  PropsWithChildren,
  SetStateAction,
  useRef,
  useState,
} from "react";

export type SearchBarProps = {
  title?: string;
  placeholder?: string;
  onSubmitSearchValue?: (value: string) => void;
  onSetFilter?: Dispatch<SetStateAction<string | undefined>>;
};

/**
 * Composant SearchBar permettant d'effectuer des recherches avec une barre de recherche.
 *
 * @param props.title - Titre optionnel à afficher au-dessus de la barre de recherche
 * @param props.placeholder - Texte placeholder à afficher dans la barre de recherche
 * @param props.onSubmitSearchValue - Fonction callback appelée lors de la soumission du formulaire
 * @param props.onSetFilter - Fonction callback appelée à chaque changement de valeur
 * @param children - Éléments enfants optionnels à afficher à droite de la barre de recherche
 *
 * @component
 */
const SearchBar = ({
  title,
  placeholder,
  onSetFilter,
  onSubmitSearchValue,
  children,
}: PropsWithChildren<SearchBarProps>) => {
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchValue(event.currentTarget.value);
    onSetFilter && onSetFilter(event.currentTarget.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onSubmitSearchValue) return;
    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem("search") as HTMLInputElement;
    onSubmitSearchValue(input.value);
  };

  const handleClear = () => {
    setSearchValue("");
    onSetFilter && onSetFilter("");
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    onSubmitSearchValue && onSubmitSearchValue("");
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-5 items-center w-full">
      {title ? (
        <h2 className="text-lg font-bold text-base-content w-full">{title}</h2>
      ) : null}

      <div className="flex items-center justify-end gap-5 w-full">
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-secondary/10 w-[400px] gap-x-2 p-2 rounded-md"
        >
          <Search />
          <input
            ref={inputRef}
            id="search"
            name="search"
            type="text"
            onInputCapture={handleChange}
            className="bg-transparent focus:outline-none w-full text-sm"
            placeholder={placeholder}
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-secondary/20 rounded-full"
            >
              <X size={16} />
            </button>
          )}
        </form>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </div>
  );
};

export default SearchBar;
