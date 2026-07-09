import { useDragAndDrop } from "../../../../../../../src/hooks/useDragAndDrop";
import { DndWrapper } from "../../../../../../../src/components/UI/DndWrapper";
import ResourceItem from "./resource-item";
import { useMemo } from "react";

type Props = {
  filesList: { name: string; file: File; hasError: boolean }[];
  handleRemoveResource: (index: number) => void;
  isLoading: boolean;
  onReorder: (
    newList: { name: string; file: File; hasError: boolean }[]
  ) => void;
  uploadProgress: number | null;
};

export type UploadProgressValues = {
  minUpload: number;
  maxUpload: number;
};

function ResourcesList({
  filesList,
  handleRemoveResource,
  isLoading,
  onReorder,
  uploadProgress,
}: Props) {
  const { handleDragEnd } = useDragAndDrop({
    items: filesList,
    onReorder,
  });

  const totalFilesSize = useMemo(() => {
    return filesList.reduce((acc, file) => acc + file.file.size, 0);
  }, [filesList]);

  const uploadProgressValues = useMemo(() => {
    if (!filesList.length || !totalFilesSize) return [];

    return filesList.reduce((acc: UploadProgressValues[], file, index) => {
      const previousFilesSize = filesList
        .slice(0, index)
        .reduce((sum, f) => sum + f.file.size, 0);

      const minUpload = (previousFilesSize / totalFilesSize) * 100;
      const maxUpload =
        ((previousFilesSize + file.file.size) / totalFilesSize) * 100;

      return [...acc, { minUpload, maxUpload }];
    }, []);
  }, [filesList, totalFilesSize]);

  return (
    <div className="flex flex-col gap-y-2">
      {uploadProgress && uploadProgress > 0 ? (
        <div className="mb-4 w-full">
          <p className="w-full text-xs text-info flex justify-end">
            {uploadProgress} %
          </p>
          <progress
            className="progress progress-secondary w-full"
            value={uploadProgress}
            max="100"
          ></progress>
        </div>
      ) : null}
      <DndWrapper
        isLoading={isLoading}
        droppableId="resources"
        items={filesList}
        onDragEnd={handleDragEnd}
        renderItem={(resource, index) => (
          <ResourceItem
            resource={resource}
            index={index}
            isLoading={isLoading}
            onRemove={handleRemoveResource}
            uploadProgressValues={uploadProgressValues[index]}
            uploadProgress={uploadProgress}
            totalFiles={filesList.length}
          />
        )}
      />
    </div>
  );
}

export default ResourcesList;
