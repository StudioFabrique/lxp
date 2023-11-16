import CustomError from "../../../utils/interfaces/custom-error";

interface FieldProps {
  label?: string;
  placeholder?: string;
  name: string;
  type?: string;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: Record<string, string>;
    onChangeValue: (field: string, value: string) => void;
    errors: CustomError[];
  };
}

const Field = (props: FieldProps) => {
  const { label, placeholder, name } = props;
  const type = props.type ?? "text";

  const baseStyle = "input focus:outline-none";

  const style = props.data.errors.find((item) => item.type === name)
    ? baseStyle + " input-error"
    : baseStyle;

  console.log(name + " :", props.data.values[name]);

  return (
    <div className="flex flex-col gap-y-2">
      <label htmlFor={name}>{label}</label>
      <input
        className={style}
        type={type}
        id={name}
        name={name}
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

export default Field;
