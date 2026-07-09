import { FileText } from "lucide-react";
import { GripVertical, Trash2 } from "lucide-react";
import SubWrapper from "../../../../../../../src/components/wrappers/SubBoxWrapper";
import { displaySize } from "../../../../../../utils/helpers/size-unit-conversion";
import { UploadProgressValues } from "./resources-list";
import FileUploadStatus from "./file-upload-status";

type Props = {
  resource: { name: string; file: File; hasError: boolean };
  index: number;
  isLoading: boolean;
  onRemove: (index: number) => void;
  uploadProgressValues: UploadProgressValues;
  uploadProgress: number | null;
  totalFiles: number;
};

function ResourceItem({
  resource,
  index,
  isLoading,
  onRemove,
  uploadProgressValues,
  uploadProgress,
  totalFiles,
}: Props) {
  return (
    <SubWrapper hasError={resource.hasError}>
      <div className="w-full flex justify-between items-center text-xs pr-4">
        <span className="w-full flex items-center">
          <div className="w-1/6 flex gap-x-2 items-center">
            <GripVertical
              className={`${isLoading ? "text-primary/50" : "20"}`}
            />
            {isLoading ? (
              <FileUploadStatus
                {...uploadProgressValues}
                uploadProgess={uploadProgress ?? 0}
                totalFiles={totalFiles}
              />
            ) : (
              <FileText className="text-info" />
            )}
          </div>
          <p className="w-2/6 truncate">{resource.name}</p>
          <p className="w-2/6 truncate">{resource.file.name}</p>
          <p className="w-1/6 truncate">{displaySize(resource.file.size)}</p>
        </span>
        <button onClick={() => onRemove(index)} disabled={isLoading}>
          <Trash2 className="w-4 h-4 text-error cursor-pointer" />
        </button>
      </div>
    </SubWrapper>
  );
}

export default ResourceItem;
