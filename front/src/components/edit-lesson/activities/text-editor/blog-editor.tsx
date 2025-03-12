/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import Activity from "../../../../utils/interfaces/activity";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import BlogForm from "./blog-form";
import useCreateBlog from "./use-create-blog";
import Editor from "./editor";

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
    activity ?? null
  );

  return (
    <div className="my-8 flex flex-col gap-y-4">
      <Wrapper>
        <BlogForm
          values={values}
          errors={errors}
          onChangeValue={onChangeValue}
        />
      </Wrapper>
      <Wrapper>
        <Editor
          onSubmit={handleSubmit}
          content={content ?? ""}
          onCancel={onCancel}
        />
      </Wrapper>
    </div>
  );
}

export default BlogEditor;
