import ExclamationMarkIcon from "../../UI/svg/exclamation-mark-icon";

interface TypeScenarioProps {
  scenario: boolean;
  label: string;
  description: string;
  onChangeScenario: () => void;
}

const TypeScenario = (props: TypeScenarioProps) => {
  const baseStyle = "flex flex-col gap-y-4 p-8 rounded-xl border ";
  const style = props.scenario
    ? baseStyle + "border-secondary/50 bg-primary/30"
    : baseStyle + "border-primary/50 bg-secondary/10";

  return (
    <div className={style}>
      <label className="flex gap-x-4" htmlFor="scenario">
        <input
          type="radio"
          name="scenario"
          checked={props.scenario}
          onChange={props.onChangeScenario}
          disabled={!props.scenario}
        />
        <p className="text-lg font-bold">{props.label}</p>
      </label>
      <div className="border border-primary/50 p-4 rounded-xl flex gap-x-2">
        <p className="flex-1">{props.description}</p>
        <div className="h-full flex items-start">
          <div className="w-8 h-8 text-primary">
            <ExclamationMarkIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeScenario;
