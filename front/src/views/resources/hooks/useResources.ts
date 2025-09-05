import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";

export type ResourceListItem = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
};

const useResources = () => {
  const [resourcesList, setResourcesList] = useState<ResourceListItem[]>([]);
  const { sendRequest, isLoading } = useHttp();

  const getResources = useCallback(() => {
    const applyData = (data: ResourceListItem[]) => {
      setResourcesList(data);
    };
    sendRequest(
      {
        path: "/resources",
      },
      applyData
    );
  }, [sendRequest]);

  useEffect(() => {
    getResources();
  }, [getResources]);

  return { resourcesList, isLoading };
};

export default useResources;
