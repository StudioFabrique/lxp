import useTags from "../../../../../hooks/useTags";
import TagsList from "../../../../../components/tags/TagsList";
import AddTag from "../../../../../components/UI/add-tag";
import Tag from "../../../../../../src/utils/interfaces/tag";
import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import RightSideDrawer from "../../../../../components/UI/right-side-drawer/right-side-drawer";
import { parcoursApi } from "../../../api/parcours.api";
import { useParcoursTagsQuery } from "../../../hooks/useParcoursTagsQuery";
import { parcoursKeys } from "../../../api/parcours.keys";

type Props = {
  onCreated: (tags: Tag[]) => void;
};

function CreateNewTag(props: Props) {
  const { data: initialTags = [] } = useParcoursTagsQuery();
  const queryClient = useQueryClient();

  const { mutate: createTags, isPending } = useMutation({
    mutationFn: (payload: { tags: { name: string; color: string }[] }) =>
      parcoursApi.mutations.createTags(payload),
    onSuccess: (data: Tag[]) => {
      queryClient.setQueryData<Tag[]>(
        parcoursKeys.availableTags(),
        (current = []) => [...current, ...data],
      );
      props.onCreated(data);
      handleCancel();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la création des tags",
      );
    },
  });

  const handleCancel = () => {
    document.getElementById("create-tags")?.click();
    resetTags();
  };

  const {
    tag,
    currentTags,
    getTagsWithPendingInput,
    handleCheckTags,
    handleOnChange,
    handleRemoveTag,
    handleTagSubmit,
    resetTags,
  } = useTags(initialTags);

  const pendingName = tag.trim().toLocaleLowerCase();
  const pendingNameExists =
    pendingName.length > 0 &&
    initialTags.some(
      (item) => item.name.toLocaleLowerCase() === pendingName,
    );
  const canSubmit =
    handleCheckTags().length > 0 ||
    (pendingName.length > 0 && !pendingNameExists);

  const handleSubmitNewTags = async () => {
    const tmpTags = handleCheckTags(getTagsWithPendingInput());

    if (!tmpTags || tmpTags.length === 0) {
      toast("Aucun nouveau tag à créer");
      return;
    }

    const payload = {
      tags: tmpTags.map((item) => ({ name: item.name, color: item.color })),
    };

    createTags(payload);
  };

  const showNoTagMessage =
    pendingNameExists ||
    (handleCheckTags().length === 0 && currentTags.length > 0);

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
            <p className="text-error text-xs pl-2">
              Ce nom de tag est déjà utilisé.
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
              disabled={!canSubmit || isPending}
            >
              {isPending && <span className="loading loading-spinner loading-sm" />}
              Créer les nouveaux tags
            </button>
          </div>
        </span>
      </Wrapper>
    </RightSideDrawer>
  );
}

export default CreateNewTag;
