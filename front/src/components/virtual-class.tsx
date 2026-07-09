import { HelpCircle } from "lucide-react";
import QuestionMarkTooltip from "./UI/question-mark-tooltip/question-mark-tooltip";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface VirtualClassProps {
  virtualClass: any;
  onChangeValue: (event: React.FormEvent<HTMLInputElement>) => void;
}

const VirtualClass = (props: VirtualClassProps) => {
  const { virtualClass, onChangeValue } = props;

  return (
    <div className="w-full flex flex-col gap-y-2">
      <label className="font-bold">Classe Virtuelle</label>
      <span className="flex items-center gap-x-2 w-full">
        <input
          className="flex-1 input input-sm focus:outline-none"
          id="virtual"
          name="virtual"
          defaultValue={virtualClass.value}
          onChange={onChangeValue}
          onBlur={virtualClass.valueBlurHandler}
          placeholder="Lien vers la classe virtuelle"
        />
        <QuestionMarkTooltip
          tooltipValue="Si vous gérez une classe virtuelle sur Zoom, Google meet, Teams … vous pouvez saisir le lien ici."
          tooltipPosition="left"
        >
          <HelpCircle className="w-6 h-6 text-primary" />
        </QuestionMarkTooltip>
      </span>
    </div>
  );
};

export default VirtualClass;
