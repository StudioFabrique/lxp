import CustomError from "../../../utils/interfaces/custom-error";

interface FieldProps {
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
  name: string;
  rows?: number;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: Record<string, string>;
    onChangeValue: (field: string, value: string) => void;
    errors: CustomError[];
  };
}

const FieldArea = (props: FieldProps) => {
  const { label, placeholder, name, isDisabled } = props;
  const rows = props.rows !== undefined ? props.rows : 3;

  const baseStyle =
    "textarea focus:outline-none disabled:cursor-default disabled:text-primary-content disabled:text-base-content";

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
        rows={rows}
        value={
          props.data.values[name] !== undefined &&
          props.data.values[name] !== null
            ? props.data.values[name]
            : ""
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

export default FieldArea;
