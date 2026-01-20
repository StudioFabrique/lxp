import { ModuleImportType } from "../../../views/module/hooks/use-import-modules";

type Props = { modules?: ModuleImportType[]; onPreviewModule: () => void };

const ModulesImportList = ({ modules, onPreviewModule }: Props) => {
  if (!modules?.length) return undefined;

  return (
    <div className="">
      {modules.map((module) => (
        <div>{module.title}</div>
      ))}
    </div>
  );
};

export default ModulesImportList;
