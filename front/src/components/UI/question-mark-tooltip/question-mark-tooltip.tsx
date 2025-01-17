import { HelpCircle } from "lucide-react";

type QuestionMarkTooltipProps = {
  tooltipValue?: string;
  children?: React.ReactNode;
};

const QuestionMarkTooltip = ({
  children,
  tooltipValue,
}: QuestionMarkTooltipProps) => (
  <div className="tooltip tooltip-right" data-tip={tooltipValue}>
    {children ? (
      children
    ) : (
      <HelpCircle className="w-4 h-4 stroke-base-content/60" />
    )}
  </div>
);

export default QuestionMarkTooltip;
