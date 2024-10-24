/* eslint-disable @typescript-eslint/no-explicit-any */

import DOMPurify from "dompurify";
import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import TurndownService from "turndown";
import BlogEditor from "../../../components/edit-lesson/blog-editor";
import Field from "../../../components/UI/forms/field";
import FieldArea from "../../../components/UI/forms/field-area";
import useForm from "../../../components/UI/forms/hooks/use-form";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import useHttp from "../../../hooks/use-http";

export default function CreateBlog() {
  const { sendRequest } = useHttp();
  const { lessonId } = useParams();
  const [content, setContent] = useState("");
  const editorRef = useRef<any>(null);
  const { errors, values, onChangeValue, onValidationErrors, onResetForm } =
    useForm();
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();

  const data = { values, errors, onChangeValue };

  const log = async () => {
    console.log(editorRef, editorRef.current);

    if (editorRef && editorRef.current) {
      const htmlContent = editorRef.current!.getContent();
      const turndownService = new TurndownService();
      const markdownContent = turndownService.turndown(htmlContent);
      console.log(htmlContent);
      console.log("Markdown Content:", markdownContent);
      setMarkdown(markdownContent);
      // Convert Markdown back to HTML
      let htmlFromMarkdown = await marked(markdownContent);
      // Sanitize the HTML
      htmlFromMarkdown = DOMPurify.sanitize(htmlFromMarkdown);
      console.log("Sanitized HTML from Markdown:", htmlFromMarkdown);
      setContent(htmlFromMarkdown);
    }
  };

  const handleSubmit = async () => {
    await log();
    setSubmit(true);
  };

  useEffect(() => {
    if (submit) {
      const applyData = (data: any) => {
        console.log(data);
        toast.success(data.message);
        setSubmit(false);
        navigate("..");
      };
      if (markdown.length > 0)
        sendRequest(
          {
            path: `/activity/${lessonId!}`,
            method: "post",
            body: {
              title: values.title,
              description: values.description,
              value: markdown,
              type: "text",
              order: 0,
            },
          },
          applyData,
        );
    }
  }, [values, lessonId, markdown, navigate, sendRequest, submit]);

  return (
    <section className="flex flex-col gap-y-4">
      <span className="w-full flex justify-between place-items-center">
        <h1 className="text-xl font-bold">Créer une activité de type blog</h1>
        <Link className="btn btn-primary btn-outline" to="..">
          Retour
        </Link>
      </span>
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
            <BlogEditor ref={editorRef} content={content} />
            <div className="w-full flex justify-end gap-x-2">
              <button
                type="button"
                className="btn btn-info"
                onClick={async () => {
                  await log();
                  setShowPreview((prevState) => !prevState);
                }}
              >
                Preview
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleSubmit}
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
            <button
              className="btn btn-info"
              onClick={() => setShowPreview((prevState) => !prevState)}
            >
              Retour à l'éditeur
            </button>
          </div>
        </>
      )}
    </section>
  );
}
