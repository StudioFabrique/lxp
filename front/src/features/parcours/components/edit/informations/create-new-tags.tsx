/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import useTags from "../../../../../hooks/useTags";
import TagsList from "../../../../../components/tags/TagsList";
import AddTag from "../../../../../../src.legacy/components/UI/add-tag";
import Tag from "../../../../../../src.legacy/utils/interfaces/tag";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Wrapper from "../../../../../../src.legacy/components/UI/wrapper/wrapper.component";
import useHttp from "../../../../../../src.legacy/hooks/use-http";
import RightSideDrawer from "../../../../../../src.legacy/components/UI/right-side-drawer/right-side-drawer";

type Props = {
  onSubmit: Dispatch<SetStateAction<boolean>>;
};

function CreateNewTag(props: Props) {
  const initialTags = useParcoursSelector(
    (state) => state.tags.initialTags
  );
  const dispatch = useParcoursDispatch();

  const { sendRequest } = useHttp();

  const [showNoTagMessage, setShowNoTagMessage] = useState(false);

  const handleCancel = () => {
    document.getElementById("create-tags")?.click();
    resetTags();
    resetTags();
  };

  const {
    tag,
    currentTags,
    handleCheckTags,
    handleOnChange,
    handleRemoveTag,
    handleTagSubmit,
    resetTags,
  } = useTags(initialTags);

  const handleSubmitNewTags = async () => {
    try {
      const tmpTags = handleCheckTags();

      console.log("=== DEBUG CREATE TAGS ===");
      console.log("Environment:", process.env.NODE_ENV);
      console.log("Current tags:", currentTags);
      //console.log("Tmp tags:", tmpTags);
      console.log("Initial tags:", initialTags);

      if (!tmpTags || tmpTags.length === 0) {
        console.error("Aucun tag à créer");
        setShowNoTagMessage(true);
        return;
      }

      const payload = {
        tags: tmpTags.map((item) => {
          console.log("Processing tag:", item);
          return { name: item.name, color: item.color };
        }),
      };

      console.log("Final payload:", payload);
      console.log("=== END DEBUG ===");

      const applyData = (data: Tag[]) => {
        dispatch({ type: "INIT_TAGS", payload: [...initialTags, ...data] });
        dispatch({ type: "ADD_NEW_CURRENT_TAGS", payload: data });
        props.onSubmit(true);
        handleCancel();
      };

      sendRequest(
        {
          path: "/tag",
          method: "post",
          body: payload,
        },
        applyData
      );
    } catch (error) {
      console.error("Error in handleSubmitNewTags:", error);
    }
  };

  useEffect(() => {
    const tmpTags = handleCheckTags();
    setShowNoTagMessage(tmpTags.length === 0 && currentTags.length > 0);
  }, [currentTags, handleCheckTags]);

  return (
    <RightSideDrawer id="create-tags" visible={false} title="Créer des tags">
      <Wrapper>
        <span className="w-[30rem] flex flex-col gap-y-4">
          <AddTag
            tag={tag}
            error={false}
            placeholder="Exemple : artisanal, technologie, industriel"
            onChangeValue={handleOnChange}
            onSubmit={handleTagSubmit}
          />
          <TagsList tagsList={currentTags} onRemove={handleRemoveTag} />
          {showNoTagMessage && (
            <p className="text-info text-xs pl-2">
              Les tags saisis existent déjà.
            </p>
          )}
          <div className="flex justify-between items-center mt-4">
            <button
              className="btn btn-outline btn-primary"
              onClick={handleCancel}
            >
              Annuler
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmitNewTags}
              disabled={showNoTagMessage}
            >
              Créer les nouveaux tags
            </button>
          </div>
        </span>
      </Wrapper>
    </RightSideDrawer>
  );
}

export default CreateNewTag;
