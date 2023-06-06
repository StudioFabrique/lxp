import { useEffect, useState } from "react";
import Tag from "../../../utils/interfaces/tag";
//import useHttp from "../../../hooks/use-http";
import TagItem from "../tag-item/tag-item";
import createTag from "../../../utils/tags";
import useTags from "../../../hooks/use-tags";
import { sortArray } from "../../../utils/sortArray";

const tags = createTag();

const Tags = () => {
  //const { sendRequest } = useHttp();
  const {
    selectedTags,
    filteredTags,
    addTag,
    filterTags,
    resetFilterTags,
    removeTag,
    initTags,
  } = useTags();
  const [enteredTagValue, setEnteredTagValue] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const applyData = (data: any) => {
      initTags(sortArray(data, "name"));
    };
    //  todo : ajouter la requête pour récupérer les tags de la bdd
    applyData(tags);
  }, [initTags]);

  useEffect(() => {
    if (filteredTags.length > 0) {
      setIsOpen(true);
    }
  }, [filteredTags]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    filterTags(enteredTagValue);
  };

  const handleSelectTag = (value: string) => {
    addTag(value);
    resetFilterTags();
    setIsOpen(false);
  };

  const handleEnteredTagValue = (event: React.FormEvent<HTMLInputElement>) => {
    setEnteredTagValue(event.currentTarget.value);
  };

  const handleRemoveTag = (tag: Tag) => {
    removeTag(tag);
  };

  return (
    <div className="flex flex-col p-4 rounded-lg bg-secondary/10 gap-y-4">
      <h2 className="text-xl font-bold">Tags</h2>
      <form className="flex items-center gap-x-2" onSubmit={submitSearch}>
        <input
          type="text"
          name="enteredTagValue"
          placeholder="Ajouter un nouveau tag"
          className="input input-bordered input-sm w-full"
          onChange={handleEnteredTagValue}
          defaultValue={enteredTagValue}
        />
        <div className="dropdown dropdown-bottom">
          <button
            className="btn btn-square btn-sm bg-primary text-base-100"
            type="submit"
          >
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
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6h.008v.008H6V6z"
              />
            </svg>
          </button>
          {isOpen ? (
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 w-32 shadow bg-base-100"
            >
              {filteredTags.map((tag: Tag) => (
                <li
                  className="text-xs py-1"
                  key={tag.id}
                  onClick={() => handleSelectTag(tag.name)}
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </form>
      <ul className="flex flex-wrap gap-2">
        {selectedTags && selectedTags.length > 0
          ? selectedTags?.map((tag: Tag) => (
              <li key={tag.id} onClick={() => handleRemoveTag(tag)}>
                <TagItem tag={tag} />
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default Tags;
