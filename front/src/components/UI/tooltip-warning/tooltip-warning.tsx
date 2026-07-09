import WarningIcon from "../svg/warning-icon";

interface TooltipWarningProps {
  message: string;
  absolutePos?: boolean;
  tooltipPos?:
    | "tooltip-bottom"
    | "tooltip-top"
    | "tooltip-right"
    | "tooltip-left";
}

const ToolTipWarning = ({
  tooltipPos = "tooltip-bottom",
  ...props
}: TooltipWarningProps) => {
  return (
    <div
      className={`tooltip ${tooltipPos} cursor-pointer w-4 h-4 ${props.absolutePos ? "absolute top-2 right-2" : "relative"} text-error`}
      data-tip={props.message}
    >
      <WarningIcon />
    </div>
  );
};

export default ToolTipWarning;
