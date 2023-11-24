/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect } from "react";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";

const useFetchModules = () => {
  const { error, isLoading, sendRequest } = useHttp();

  const getFormationModules = (formationId: number) => {
    const applyData = (data: any) => {
      return data;
    };
    sendRequest(
      {
        path: `/modules/formation/${formationId}`,
      },
      applyData
    );
  };

  const getParcoursModules = (parcoursId: number) => {
    const applyData = (data: any) => {
      return data;
    };
    sendRequest(
      {
        path: `/modules/${parcoursId}`,
      },
      applyData
    );
  };

  const getAllModules = useCallback(() => {
    let result: any;
    const applyData = (data: any) => {
      console.log({ data });
      result = data;
      console.log({ result });
    };
    sendRequest(
      {
        path: "/modules",
      },
      applyData
    );
    return result;
  }, [sendRequest]);

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return { isLoading, getAllModules, getFormationModules, getParcoursModules };
};

export default useFetchModules;
