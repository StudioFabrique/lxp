import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tagNameSchema } from "../tag.schema";
import { useFormField } from "../../../components/form/useFormField";
import { showFormErrors } from "../../../components/form/form-errors";
import { ChangeEvent } from "react";
import Tag from "../../../../src/utils/interfaces/tag";
import { cn } from "../../../utils/cn";

type TagsHomeEditingProps = {
  tag: Tag;
  onSubmitTag: (id: number, name: string) => void;
};

const TagsHomeEditing = ({ tag, onSubmitTag }: TagsHomeEditingProps) => {
  const form = useForm({ resolver: zodResolver(tagNameSchema), defaultValues: { name: tag.name } });
  const [tagName, setTagName] = useFormField(form, "name");
  const tagError = Boolean(form.formState.errors.name);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    form.clearErrors("name");
    setTagName(e.currentTarget.value);
  };

  const handleSubmitTag = form.handleSubmit(({ name }) => onSubmitTag(tag.id, name), showFormErrors);

  return (
    <form onSubmit={handleSubmitTag} className="flex flex-col items-center gap-4 py-5 px-1">
      <input
        className={cn("input", tagError && "input-error")}
        value={tagName}
        onChange={handleChangeValue}
      />
      <button type="submit" id="modal-submit-btn" className="hidden" />
    </form>
  );
};

export default TagsHomeEditing;
