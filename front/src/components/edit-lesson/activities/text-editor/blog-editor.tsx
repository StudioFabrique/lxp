/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import type { Activity } from "../../../../utils/interfaces/activity";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import useCreateBlog from "./use-create-blog";
import TiptapActivity from "../../../module-content-explorer/writing/tip-tap-activity";

type EditorProps = {
  activity?: Activity; // L'activité à éditer (optionnel)
  content?: string; // Le contenu initial de l'éditeur (optionnel)
  onCancel: () => void; // Fonction appelée lors de l'annulation
};

function BlogEditor({ activity, content, onCancel }: EditorProps) {
  // Récupération de la leçon depuis le store Redux pour avoir accès à l'id de cette dernière
  const { lesson } = useSelector((state: any) => state.lesson);

  const { errors, values, onChangeValue, handleSubmit } = useCreateBlog(
    lesson.id,
    activity ?? null,
    onCancel
  );

  const handleSubmitForm = async (
    _id?: number | undefined,
    title?: string | undefined,
    content?: string | undefined
  ) => {
    await handleSubmit(content || "");
    return true;
  };

  const handleChangeTitle = (title: string) => {
    onChangeValue("title", title);
  };

  const handleChangeContent = (content: string) => {};

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
