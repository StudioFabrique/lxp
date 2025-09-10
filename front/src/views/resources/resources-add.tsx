import z from "zod";
import ResourcesAddHeader from "../../components/resources-add/ResourcesAddHeader";
import useForm from "../../components/UI/forms/hooks/use-form";
import ListHeader from "../../components/UI/list-header";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import { useEffect, useState } from "react";
import Tag from "../../utils/interfaces/tag";

import useHttp from "../../hooks/use-http";
import { regexGeneric } from "../../utils/constantes";
import ResourceForm from "../../components/resources-add/ResourceForm";
import toast from "react-hot-toast";
import SuccessWithMessage from "../../utils/interfaces/success-with-message";

const schema = z.object({
  title: z
    .string({ required_error: "Le titre est requis." })
    .regex(regexGeneric, {
      message: "Le titre contient des caractères non autorisés.",
    }),
  description: z
    .string({ required_error: "La description est requise." })
    .regex(regexGeneric, {
      message: "La description contient des caractères non autorisés.",
    }),
});

export default function ResourceAdd() {
  const [file, setFile] = useState<File | null>(null);
  const { errors, values, onChangeValue, onResetForm, onValidateForm } =
    useForm({}, schema);

  const data = { values, errors, onChangeValue };
  const { sendRequest, isLoading, error } = useHttp();

  const [tags, setTags] = useState<Tag[]>([]);
  const [tagError, setTagError] = useState(false);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onValidateForm()) return;
    const formData = new FormData();
    const resource = {
      ...data.values,
      tags: tags.map((tag) => tag.name),
    };

    formData.append("data", JSON.stringify(resource));

    if (file) formData.append("image", file);

    const applyData = (data: SuccessWithMessage) => {
      if (data.success) {
        toast.success(data.message);
      }
      onResetForm();
      setFile(null);
      setTags([]);
      setTagError(false);
    };
    sendRequest(
      {
        path: "/resources",
        method: "post",
        body: formData,
      },
      applyData
    );
  };

  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return (
    <main className="min-h-screen w-full flex flex-col items-center">
      <ListHeader>
        <ResourcesAddHeader />
        <div className="w-full flex-1 flex lg:flex-row flex-col pb-24 gap-8">
          <section className="w-full lg:w-[25rem] h-full flex flex-col gap-4">
            <article className="flex-1">
              <Wrapper>
                <ResourceForm
                  data={data}
                  onSubmit={handleSubmitForm}
                  isLoading={isLoading}
                  tags={tags}
                  setTags={setTags}
                  tagError={tagError}
                  onTagError={setTagError}
                  onSetFile={setFile}
                />
              </Wrapper>
            </article>
            <article>
              <Wrapper>articles</Wrapper>
            </article>
          </section>
          <section>Preview</section>
        </div>
      </ListHeader>
    </main>
  );
}
