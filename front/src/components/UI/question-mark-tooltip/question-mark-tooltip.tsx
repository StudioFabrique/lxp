import { HelpCircle } from "lucide-react";

type QuestionMarkTooltipProps = {
  tooltipValue?: string;
};

const QuestionMarkTooltip = ({ tooltipValue }: QuestionMarkTooltipProps) => (
  <div className="tooltip tooltip-right" data-tip={tooltipValue}>
    <HelpCircle className="w-4 h-4 stroke-base-content/60" />
  </div>
);

export default QuestionMarkTooltip;
