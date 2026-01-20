import { ModuleImportType } from "../../../views/module/hooks/use-import-modules";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import TiptapEditor from "../../UI/tiptap-editor/tiptapEditor";

type Props = {
  moduleToPreview?: ModuleImportType;
  error?: string;
};

const PreviewActivitiesFromImport = ({ moduleToPreview, error }: Props) => {
  if (!moduleToPreview?.courses?.length) return undefined;

  return (
    <div className="px-5">
      <SubWrapper hasError={Boolean(error)}>
        {error ? (
          <div className="flex flex-col items-center p-10">
            <span>L'exportation a échoué.</span>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-5">
            <div className="bg-black w-full"></div>
            <div className="w-full col-span-3">
              <TiptapEditor mode="read" initialValue="<p>test</p>" />
            </div>
          </div>
        )}
      </SubWrapper>
    </div>
  );
};

export default PreviewActivitiesFromImport;
