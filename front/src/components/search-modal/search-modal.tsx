import {
  Dispatch,
  FC,
  Ref,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import MagnifyIcon from "../UI/svg/magnify-icon";
import apiClient from "../../lib/axios";
import Loader from "../loaders/Loader";
import SearchResults from "./search-results";
import { useParams } from "react-router";
import toast from "react-hot-toast";

const SearchModal: FC<{
  isModalOpen: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
}> = ({ isModalOpen, setModalState }) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResultsData, setSearchResultsData] = useState<Record<
    string,
    string
  > | null>(null);

  const inputRef: Ref<HTMLInputElement> = useRef(null);

  const onSubmitSearch = async () => {
    if (searchValue.length > 0) {
      setIsLoading(true);
      apiClient
        .get(`/search/parcours/${id}/${searchValue}`)
        .then((response) => setSearchResultsData(response.data))
        .catch((err) => {
          const errorMessage =
            err?.response?.data?.message ?? "Erreur inconnue";
          toast.error(errorMessage);
        })
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    if (isModalOpen) inputRef.current?.focus();
  }, [isModalOpen]);

  return (
    <div
      id="modal_1"
      className={`modal modal-top ${
        isModalOpen && "modal-open"
      } flex justify-center`}
    >
      <div className="modal-box w-[80%] flex flex-col gap-5">
        <div className="flex flex-col gap-4 justify-between">
          <span className="flex justify-between">
            <h3>Recherche :</h3>
            <button
              onClick={() => setModalState(false)}
              type="button"
              className="btn btn-xs"
            >
              x
            </button>
          </span>
          <span className="flex justify-center gap-4">
            <input
              disabled
              placeholder="Recherche intelligente. Fonctionnalité bientôt disponible."
              autoComplete="off"
              ref={inputRef}
              type="text"
              name="search_input"
              id="input_1"
              className="input input-bordered input-sm w-full placeholder:text-primary"
              value={searchValue}
              // fonctionnalité à rétablir dès que elastic search est mis en place
              // onKeyDown={(e) => e.key === "Enter" && onSubmitSearch()}
              onChange={(e) => setSearchValue(e.currentTarget.value)}
            />
            <button
              type="button"
              onClick={onSubmitSearch}
              className="btn btn-primary btn-sm py-1"
              disabled
            >
              <MagnifyIcon />
            </button>
          </span>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          searchResultsData && <SearchResults data={searchResultsData} />
        )}
      </div>
    </div>
  );
};

export default SearchModal;
