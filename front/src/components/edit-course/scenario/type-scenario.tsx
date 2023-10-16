import ExclamationMarkIcon from "../../UI/svg/exclamation-mark-icon";

interface TypeScenarioProps {
  scenario: boolean;
  label: string;
}

const TypeScenario = (props: TypeScenarioProps) => {
  return (
    <div className="flex flex-col gap-y-4 p-8 rounded-xl border border-primary bg-secondary/10">
      <label className="flex gap-x-4" htmlFor="scenario">
        <input type="radio" checked={props.scenario} />
        <p className="text-lg font-bold">{props.label}</p>
      </label>
      <div className="border border-primary p-4 rounded-xl flex gap-x-2">
        <p className="flex-1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit
          amet mattis duin elit nisl, vestibulum quis sagittis feugiat,
          tincidunt ac orci. Suspendisse rhoncus tempor enim, ut aliquam est
          lacinia vel. Proin ante velit, feugiat at sem ac.
        </p>
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
