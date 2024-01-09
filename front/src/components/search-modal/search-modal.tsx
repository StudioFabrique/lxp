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
import useHttp from "../../hooks/use-http";
import Loader from "../UI/loader";
import SearchResults from "./search-results";
import { useParams } from "react-router-dom";

const SearchModal: FC<{
  isModalOpen: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
}> = ({ isModalOpen, setModalState }) => {
  const { id } = useParams();
  const { sendRequest, isLoading } = useHttp(true);

  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResultsData, setSearchResultsData] = useState<any>(null);

  const inputRef: Ref<HTMLInputElement> = useRef(null);

  const onSubmitSearch = async () => {
    const applyData = (data: any) => {
      console.log({ SearchDataObject: data });
      setSearchResultsData(data);
    };

    if (searchValue.length > 0)
      sendRequest({ path: `/search/parcours/${id}/${searchValue}` }, applyData);
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
              autoComplete="off"
              ref={inputRef}
              type="text"
              name="search_input"
              id="input_1"
              className="input input-bordered input-sm w-full"
              value={searchValue}
              onKeyDown={(e) => e.key === "Enter" && onSubmitSearch()}
              onChange={(e) => setSearchValue(e.currentTarget.value)}
            />
            <button
              type="button"
              onClick={onSubmitSearch}
              className="btn btn-primary btn-sm py-1"
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
