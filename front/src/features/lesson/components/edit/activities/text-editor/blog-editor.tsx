import { useLessonSelector } from "../../../../store/LessonContext";
import type { Activity } from "../../../../../../../src/utils/interfaces/activity";
import Wrapper from "../../../../../../../src/components/wrappers/BoxWrapper";
import useCreateBlog from "./use-create-blog";
import TiptapActivity from "../../../../../module-preview/components/writing/tip-tap-activity";

type EditorProps = {
  activity?: Activity;
  content?: string;
  onCancel: () => void;
};

function BlogEditor({ activity, content, onCancel }: EditorProps) {
  const lesson = useLessonSelector((state) => state.lesson);

  const { setValue, handleSubmit } = useCreateBlog(
    lesson?.id?.toString() ?? "",
    activity ?? null,
    onCancel,
  );

  const handleSubmitForm = async (
    _id?: number | undefined,
    _title?: string | undefined,
    contentValue?: string | undefined,
  ) => {
    await handleSubmit(contentValue || "");
    return true;
  };

  const handleChangeTitle = (value: string) => {
    setValue("title", value);
  };

  const handleChangeContent = (_content: string) => {};

  return (
    <div className="my-8 flex flex-col gap-y-4">
      <Wrapper>
        <TiptapActivity
          mode={activity ? "edit" : "write"}
          content={content}
          title={activity?.title}
          onEditContent={handleChangeContent}
          onEditTitle={handleChangeTitle}
          onSave={handleSubmitForm}
        />
      </Wrapper>
    </div>
  );
}

export default BlogEditor;
