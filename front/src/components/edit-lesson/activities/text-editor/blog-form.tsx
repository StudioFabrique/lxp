import CustomError from "../../../../utils/interfaces/custom-error";
import Field from "../../../UI/forms/field";

type Props = {
  values: Record<string, string>;
  onChangeValue: (field: string, value: string) => void;
  errors: CustomError[];
};

function BlogForm({ values, onChangeValue, errors }: Props) {
  return (
    <span className="flex flex-col gap-y-2">
      <h2 className="text-lg font-bold">Informations</h2>
      <form className="flex flex-col gap-y-4">
        <Field
          name="title"
          label="Titre *"
          data={{ values, errors, onChangeValue }}
        />
      </form>
    </span>
  );
}

export default BlogForm;
