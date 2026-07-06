import CustomError from "../../../utils/interfaces/custom-error";
import QuestionMarkTooltip from "../question-mark-tooltip/question-mark-tooltip";

interface FieldProps {
  label?: string;
  tooltip?: string;
  placeholder?: string;
  isDisabled?: boolean;
  name: string;
  rows?: number;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: Record<string, unknown>;
    onChangeValue: (field: string, value: string) => void;
    errors: CustomError[];
  };
}

const FieldArea = (props: FieldProps) => {
  const { label, tooltip, placeholder, name, isDisabled } = props;
  const rows = props.rows !== undefined ? props.rows : 3;

  const baseStyle =
    "w-full textarea focus:outline-none disabled:cursor-not-allowed  disabled:text-base-content/60";

  const style = props.data.errors.find((item) => item.type === name)
    ? baseStyle + " textarea-error"
    : baseStyle;

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-2 items-center">
        <label htmlFor={name}>{label}</label>
        {tooltip && <QuestionMarkTooltip tooltipValue={tooltip} />}
      </div>
      <textarea
        className={style}
        id={name}
        name={name}
        rows={rows}
        value={
          props.data.values[name] !== undefined &&
          props.data.values[name] !== null
            ? (props.data.values[name] as string)
            : ""
        }
        placeholder={placeholder}
        disabled={isDisabled}
        onChange={(event) =>
          props.data.onChangeValue(name, event.currentTarget.value)
        }
      />
      {props.data.errors.find((item) => item.type === name) ? (
        <p className="text-error text-xs">
          {props.data.errors.find((item) => item.type === name)?.message}
        </p>
      ) : null}
    </div>
  );
};

export default FieldArea;
