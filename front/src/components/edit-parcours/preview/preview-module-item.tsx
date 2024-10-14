import { notValidModuleTooltip } from "../../../lib/not-valid-module";
import Module from "../../../utils/interfaces/module";
import ToolTipWarning from "../../UI/tooltip-warning/tooltip-warning";
import defaultImage from "../../../assets/images/module-default-thumb.png";

interface PreviewModuleItemProps {
  module: Module;
}

const PreviewModuleItem = (props: PreviewModuleItemProps) => {
  const { module } = props;

  const classImage: React.CSSProperties = {
    backgroundImage: `url(${props.module.thumb ? "data:image/jpeg;base64," + props.module.thumb : defaultImage})`,
    width: "100%",
    minHeight: "9rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderTopLeftRadius: "0.75rem",
    borderTopRightRadius: "0.75rem",
  };

  // un module item de la iste des modules du parcours n'est pas valide par défaut
  let notValid = true;

  // teste si un module du parcours est valide
  if (module.contacts !== undefined && module.bonusSkills !== undefined) {
    notValid = module.contacts.length === 0 || module.bonusSkills.length === 0;
  }

  const dates = `Du ${new Date(
    module.minDate!,
  ).toLocaleDateString()} au ${new Date(module.maxDate!).toLocaleDateString()}`;

  const text =
    module.title.length >= 70
      ? module.title.slice(0, 70) + "..."
      : module.title;

  const style = notValid
    ? "flex flex-col bg-secondary/10 rounded-xl border border-error"
    : "flex flex-col bg-secondary/10 rounded-xl";

  return (
    <div className={style}>
      <span style={classImage}></span>
      <span className="w-full h-[5rem] px-4 flex flex-col justify-center items-start relative">
        <p className="text-xs">{dates}</p>
        <p className="text-xs xl:text-sm font-bold">{text}</p>
        {notValid ? <ToolTipWarning message={notValidModuleTooltip} /> : null}
      </span>
    </div>
  );
};

export default PreviewModuleItem;
