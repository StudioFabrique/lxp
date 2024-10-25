/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditBlog from "../../../components/edit-lesson/blog/edit-blog";
import useForm from "../../../components/UI/forms/hooks/use-form";
import useEditBlog from "../../../hooks/use-edit-blog";
import useHttp from "../../../hooks/use-http";

export default function CreateBlog() {
  const { sendRequest } = useHttp();
  const { lessonId } = useParams();

  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();

  const { errors, values, onChangeValue, onValidationErrors, onResetForm } =
    useForm();
  const data = { values, errors, onChangeValue };
  const [showPreview, setShowPreview] = useState(false);
  const { content, editorRef, log, markdown } = useEditBlog();

  const handleSubmit = async () => {
    await log();
    setSubmit(true);
  };

  const handlePreview = async () => {
    if (!showPreview) await log();
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
