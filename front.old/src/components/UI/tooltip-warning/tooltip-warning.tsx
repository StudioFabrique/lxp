import WarningIcon from "../svg/warning-icon";

interface TooltipWarningProps {
  message: string;
}

const ToolTipWarning = (props: TooltipWarningProps) => {
  return (
    <div
      className="tooltip tooltip-bottom cursor-pointer w-4 h-4 absolute top-2 right-2 text-error"
      data-tip={props.message}
    >
      <WarningIcon />
    </div>
  );
};

export default ToolTipWarning;
