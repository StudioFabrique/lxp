import { HelpCircle } from "lucide-react";

type QuestionMarkTooltipProps = {
  tooltipValue?: string;
  children?: React.ReactNode;
  tooltipPosition?: "right" | "left" | "top" | "bottom";
};

const QuestionMarkTooltip = ({
  children,
  tooltipValue,
  tooltipPosition = "right",
}: QuestionMarkTooltipProps) => {
  const position = "tooltip tooltip-" + tooltipPosition;

  return (
    <div className={position} data-tip={tooltipValue}>
      {children ? (
        children
      ) : (
        <HelpCircle className="w-4 h-4 stroke-base-content/60" />
      )}
    </div>
  );
};

export default QuestionMarkTooltip;
