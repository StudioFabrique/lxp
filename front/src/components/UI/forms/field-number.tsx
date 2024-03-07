import CustomError from "../../../utils/interfaces/custom-error";

interface FieldNumberProps {
  label?: string;
  placeholder?: string;
  name: string;
  min: number;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: Record<string, string>;
    onChangeValue: (fieldNumber: string, value: string) => void;
    errors: CustomError[];
  };
}

const FieldNumber = (props: FieldNumberProps) => {
  const { label, placeholder, name, min } = props;

  const baseStyle =
    "input focus:outline-none disabled:cursor-default disabled:text-primary-content disabled:text-base-content";

  const style = props.data.errors.find((item) => item.type === name)
    ? baseStyle + " input-error"
    : baseStyle;

  return (
    <div className="flex flex-col gap-y-2">
      <label htmlFor={name}>{label}</label>
      <input
        className={style}
        type="number"
        id={name}
        name={name}
        min={min}
        value={
          props.data.values[name] !== undefined ? props.data.values[name] : ""
        }
        placeholder={placeholder}
        onChange={(event) =>
          props.data.onChangeValue(name, event.currentTarget.value)
        }
      />
    </div>
  );
};

export default FieldNumber;
