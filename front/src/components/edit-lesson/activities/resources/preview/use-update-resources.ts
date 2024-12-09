import { useState } from "react";
import useHttp from "../../../../../hooks/use-http";
import Activity, {
  Resource as ActivityResource,
} from "../../../../../utils/interfaces/activity";

const useUpdateResources = () => {
  const { error, isLoading, sendRequest, uploadProgress } = useHttp();
  const [resources, setResources] = useState<ActivityResource[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { values, errors, onChangeValue } = useForm();
  const [uploadList, setUploadList] = useState<Resource[]>([]);
  const { error, isLoading, sendRequest, uploadProgress } = useHttp();
  const { handleDragEnd, submit, setSubmit } = useDragAndDrop({
    items: resources,
    onReorder: setResources,
  });
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  return { resources, isAdding, setIsAdding, isLoading, uploadProgress };
};
