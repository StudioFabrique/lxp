import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import useTags from "../../../../../hooks/useTags";
import TagsList from "../../../../../components/tags/TagsList";
import AddTag from "../../../../../components/UI/add-tag";
import Tag from "../../../../../../src/utils/interfaces/tag";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import RightSideDrawer from "../../../../../components/UI/right-side-drawer/right-side-drawer";
import { parcoursApi } from "../../../api/parcours.api";

type Props = {
  onSubmit: Dispatch<SetStateAction<boolean>>;
};

function CreateNewTag(props: Props) {
  const initialTags = useParcoursSelector(
    (state) => state.tags.initialTags
  );
  const dispatch = useParcoursDispatch();

  const [showNoTagMessage, setShowNoTagMessage] = useState(false);

  const { mutate: createTags } = useMutation({
    mutationFn: (payload: { tags: { name: string; color: string }[] }) =>
      parcoursApi.mutations.createTags(payload),
    onSuccess: (data: Tag[]) => {
      dispatch({ type: "INIT_TAGS", payload: [...initialTags, ...data] });
      dispatch({ type: "ADD_NEW_CURRENT_TAGS", payload: data });
      props.onSubmit(true);
      handleCancel();
    },
    onError: () => {
      toast.error("Erreur lors de la création des tags");
    },
  });

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
    const tmpTags = handleCheckTags();

    if (!tmpTags || tmpTags.length === 0) {
      setShowNoTagMessage(true);
      return;
    }

    const payload = {
      tags: tmpTags.map((item) => ({ name: item.name, color: item.color })),
    };

    createTags(payload);
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
