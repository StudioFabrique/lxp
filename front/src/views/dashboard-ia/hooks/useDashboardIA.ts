import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";

const useDashboardIA = () => {
  const { isLoading, error, sendRequest } = useHttp();
  const [totalTokens, setTotalTokens] = useState<number>(0);

  const getTotalTokens = useCallback(() => {
    const applyData = (data: { response: number }) => {
      setTotalTokens(data.response);
    };
    sendRequest(
      {
        path: "/dashboard-ia/total-tokens",
      },
      applyData,
    );
  }, [sendRequest]);

  useEffect(() => {
    getTotalTokens();
  }, [getTotalTokens]);

  return { isLoading, error, totalTokens, getTotalTokens };
};
export default useDashboardIA;
