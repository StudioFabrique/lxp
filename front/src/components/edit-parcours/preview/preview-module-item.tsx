import Module from "../../../utils/interfaces/module";

interface PreviewModuleItemProps {
  module: Module;
}

const PreviewModuleItem = (props: PreviewModuleItemProps) => {
  const { module } = props;

  const classImage: React.CSSProperties = {
    backgroundImage: `url('${module.thumb}')`,
    width: "100%",
    minHeight: "9rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderTopLeftRadius: "0.75rem",
    borderTopRightRadius: "0.75rem",
  };

  const dates = `Du ${new Date(
    module.minDate!
  ).toLocaleDateString()} au ${new Date(module.maxDate!).toLocaleDateString()}`;

  const text = module.title.slice(0, 70) + "...";

  return (
    <div className="flex flex-col bg-secondary/10 rounded-lg">
      <span style={classImage}></span>
      <span className="w-full h-[5rem] px-4 flex flex-col justify-center items-start">
        <p className="text-xs">{dates}</p>
        <p className="text-xs xl:text-sm">{text}</p>
      </span>
    </div>
  );
};

export default PreviewModuleItem;
