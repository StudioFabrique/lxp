import CustomError from "../../../utils/interfaces/custom-error";

interface FieldProps {
  label?: string;
  placeholder?: string;
  name: string;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: Record<string, string>;
    onChangeValue: (field: string, value: string) => void;
    errors: CustomError[];
  };
}

const FieldArea = (props: FieldProps) => {
  const { label, placeholder, name } = props;

  const baseStyle = "textarea focus:outline-none";

  const style = props.data.errors.find((item) => item.type === name)
    ? baseStyle + " textarea-error"
    : baseStyle;

  return (
    <div className="flex flex-col gap-y-2">
      <label htmlFor={name}>{label}</label>
      <textarea
        className={style}
        id={name}
        name={name}
        defaultValue={props.data.values[name]}
        placeholder={placeholder}
        onChange={(event) =>
          props.data.onChangeValue(name, event.currentTarget.value)
        }
      />
    </div>
  );
};

export default FieldArea;
