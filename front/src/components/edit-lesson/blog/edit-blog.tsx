import { forwardRef, ForwardedRef } from "react";
import Field from "../../UI/forms/field";
import FieldArea from "../../UI/forms/field-area";
import Wrapper from "../../UI/wrapper/wrapper.component";
import BlogEditor from "../blog-editor";
import { Editor as TinyMCEEditor } from "tinymce";

type Props = {
  content: string;
  data: any;
  showPreview: boolean;
  onPreview: () => void;
  onSubmit: () => void;
};

const EditBlog = forwardRef(
  (
    { content, data, showPreview, onPreview, onSubmit }: Props,
    ref: ForwardedRef<TinyMCEEditor>,
  ) => {
    return (
      <>
        {!showPreview ? (
          <>
            <div className="grid grid-cols-1 2xl:grid-cols-2">
              <Wrapper>
                <span className="flex flex-col gap-y-2">
                  <h2 className="text-lg font-bold">Informations</h2>
                  <form className="flex flex-col gap-y-4">
                    <Field name="title" label="Titre *" data={data} />
                    <FieldArea
                      name="description"
                      data={data}
                      label="Description *"
                    />
                  </form>
                </span>
              </Wrapper>
            </div>
            <article className="flex flex-col gap-y-4">
              <BlogEditor ref={ref} content={content} />
              <div className="w-full flex justify-end gap-x-2">
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={onPreview}
                >
                  Preview
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={onSubmit}
                >
                  Enregistrer
                </button>
              </div>
            </article>
          </>
        ) : (
          <>
            <div
              className="prose prose-h1:text-primary prose-h1:text-center prose-h2:text-primary prose-a:text-center prose-a:text-secondary prose-img:text-center prose-p:text-justify prose-ul:ml-8 prose-strong:text-primary w-full"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <div className="flex justify-end">
              <button className="btn btn-info" onClick={onPreview}>
                Retour à l'éditeur
              </button>
            </div>
          </>
        )}
      </>
    );
  },
);

export default EditBlog;
