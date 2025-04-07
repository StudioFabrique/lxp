/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import useTags from "../../../hooks/use-tags";
import TagsList from "../../formation-home/tags-list";
import AddTag from "../../UI/add-tag";
import Tag from "../../../utils/interfaces/tag";
import { Dispatch, SetStateAction } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import useHttp from "../../../hooks/use-http";
import { tagsAction } from "../../../store/redux-toolkit/tags";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";

type Props = {
  onSubmit: Dispatch<SetStateAction<boolean>>;
};

function CreateNewTag(props: Props) {
  const initialTags = useSelector(
    (state: any) => state.tags.initialTags
  ) as Tag[];
  const dispatch = useDispatch();

  const { sendRequest } = useHttp();

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

  const handleSubmitNewTags = () => {
    const tmpTags = handleCheckTags();

    const applyData = (data: Tag[]) => {
      dispatch(tagsAction.initTags([...initialTags, ...data]));
      dispatch(tagsAction.addNewCurrentTags(data));
      props.onSubmit(true);
      handleCancel();
    };
    sendRequest(
      {
        path: "/tag",
        method: "post",
        body: {
          tags: tmpTags.map((item) => ({ name: item.name, color: item.color })),
        },
      },
      applyData
    );
  };

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
          <div className="flex justify-between items-center mt-4">
            <button
              className="btn btn-outline btn-primary"
              onClick={handleCancel}
            >
              Annuler
            </button>
            <button className="btn btn-primary" onClick={handleSubmitNewTags}>
              Créer les nouveaux tags
            </button>
          </div>
        </span>
      </Wrapper>
    </RightSideDrawer>
  );
}

export default CreateNewTag;
