import { Ref, useEffect } from "react";
import CustomError from "../../../utils/interfaces/custom-error";

interface FieldProps {
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
  name: string;
  type?: string;
  fieldRef?: Ref<HTMLInputElement>;
  existingValue?: string;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: Record<string, string>;
    onChangeValue: (field: string, value: string) => void;
    errors: CustomError[];
  };
}

const Field = (props: FieldProps) => {
  const { label, placeholder, name, isDisabled, fieldRef } = props;
  const type = props.type ?? "text";

  const baseStyle =
    "input input-sm focus:outline-none disabled:cursor-default disabled:text-base-content";

  const style = props.data.errors.find((item) => item.type === name)
    ? baseStyle + " input-error"
    : baseStyle;

  //console.log(props.data.values[name]);

  useEffect(() => {
    if (
      props.existingValue &&
      props.existingValue !== props.data.values[name]
    ) {
      props.data.onChangeValue(name, props.existingValue);
    }
  }, [name, props.data, props.existingValue]);

  return (
    <div className="flex flex-col gap-y-2 w-full">
      <label htmlFor={name}>{label}</label>
      <input
        ref={fieldRef}
        className={style}
        type={type}
        id={name}
        name={name}
        value={
          props.data.values[name] !== undefined ? props.data.values[name] : ""
        }
        placeholder={placeholder}
        disabled={isDisabled}
        onChange={(event) =>
          props.data.onChangeValue(name, event.currentTarget.value)
        }
      />
    </div>
  );
};

export default Field;
