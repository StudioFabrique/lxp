/* eslint-disable @typescript-eslint/no-explicit-any */

import DOMPurify from "dompurify";
import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import TurndownService from "turndown";
import useHttp from "../../../hooks/use-http";
import EditBlog from "../../../components/edit-lesson/blog/edit-blog";
import useForm from "../../../components/UI/forms/hooks/use-form";

export default function CreateBlog() {
  const { sendRequest } = useHttp();
  const { lessonId } = useParams();

  const [markdown, setMarkdown] = useState("");
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();
  const editorRef = useRef<any>(null);
  const [content, setContent] = useState("");

  const { errors, values, onChangeValue, onValidationErrors, onResetForm } =
    useForm();
  const [showPreview, setShowPreview] = useState(false);

  const data = { values, errors, onChangeValue };

  const log = async () => {
    if (editorRef && editorRef.current) {
      const htmlContent = editorRef.current!.getContent();
      const turndownService = new TurndownService();
      const markdownContent = turndownService.turndown(htmlContent);
      setMarkdown(markdownContent);
      // Convert Markdown back to HTML
      let htmlFromMarkdown = await marked(markdownContent);
      // Sanitize the HTML
      htmlFromMarkdown = DOMPurify.sanitize(htmlFromMarkdown);
      setContent(htmlFromMarkdown);
    }
  };

  const handleSubmit = async () => {
    await log();
    setSubmit(true);
  };

  const handlePreview = async () => {
    await log();
    setShowPreview((prevState) => !prevState);
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
      <EditBlog
        content={content}
        showPreview={showPreview}
        onPreview={handlePreview}
        data={data}
        ref={editorRef}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
