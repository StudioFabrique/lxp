import { normalizeImageSource } from "../../../../../../src/utils/images/image-source";
import { notValidModuleTooltip } from "../../../../../../src/config/not-valid-module";
import Module from "../../../../../../src/utils/interfaces/module";
import ToolTipWarning from "../../../../../components/UI/tooltip-warning/tooltip-warning";
import defaultImage from "../../../../../../src/assets/images/module-default-thumb.png";
import { bgImageGradient } from "../../../../../utils/helpers/color-helpers";
import { localeDate } from "../../../../../utils/helpers/locale-date";

interface PreviewModuleItemProps {
  module: Module;
}

const PreviewModuleItem = (props: PreviewModuleItemProps) => {
  const { module } = props;

  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(
      props.module.thumb
        ? normalizeImageSource(props.module.thumb)
        : defaultImage,
    ),
    width: "100%",
    minHeight: "9rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderTopLeftRadius: "0.75rem",
    borderTopRightRadius: "0.75rem",
  };

  console.log({ module });

  // un module item de la iste des modules du parcours n'est pas valide par défaut
  // teste si un module du parcours est valide (contacts et bonusSkills doivent exister et ne pas être vides)
  const notValid = !module.contacts?.length || !module.bonusSkills?.length;

  const dates = `Du ${localeDate(
    module.minDate!,
  )} au ${localeDate(module.maxDate!)}`;

  const text =
    module.title.length >= 70
      ? module.title?.slice(0, 70) + "..."
      : (module.title ?? "");

  const style = notValid
    ? "flex flex-col bg-secondary/10 rounded-xl border border-error"
    : "flex flex-col bg-secondary/10 rounded-xl";

  return (
    <div className={style}>
      <span style={classImage}></span>
      <span className="w-full h-[5rem] px-4 flex flex-col justify-center items-start relative">
        <p className="text-xs">{dates}</p>
        <p className="text-xs xl:text-sm font-bold">{text}</p>
        {notValid ? (
          <ToolTipWarning absolutePos message={notValidModuleTooltip} />
        ) : null}
      </span>
    </div>
  );
};

export default PreviewModuleItem;
