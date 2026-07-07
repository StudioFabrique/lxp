import React from "react";
import Field from "../../../../../../../src.legacy/components/UI/forms/field";

type props = {
  data: {
    values: Record<string, unknown>;
    errors: { name: string[] };
    onChangeValue: (name: string, value: string) => void;
  };
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function ResourceForm({ data, onFileChange }: props) {
  return (
    <span className="h-full flex flex-col gap-y-2">
      <h2 className="text-lg font-bold">Ressources</h2>
      <form className="flex flex-col justify-around h-full gap-y-4">
        <span className="flex flex-col gap-y-4">
          <Field
            name="name"
            label="Nom du lien *"
            data={{
              values: { name: data.values.name },
              errors: [],
              onChangeValue: data.onChangeValue,
            }}
          />
        </span>
        <input
          className="file-input file-input-bordered file-input-primary w-full max-w-md"
          type="file"
          onChange={onFileChange}
          disabled={
            !data.values.name || Object.keys(data.values.name).length === 0
          }
        />
      </form>
    </span>
  );
}

export default ResourceForm;
