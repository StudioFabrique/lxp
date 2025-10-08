import { useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useState } from "react";

export default function ModuleComponent() {
  const { sendRequest } = useHttp();
  const { id } = useParams();

  const [fromParcours, setFromParcours] = useState<any>([]);

  const getParcoursModules = useCallback(() => {
    const applyData = (data: any) => {
      console.log(data);
      setFromParcours(data);
    };
    sendRequest({ path: `/modules/${id}` }, applyData);
  }, [id, sendRequest]);

  useEffect(() => {
    getParcoursModules();
  }, [getParcoursModules]);

  return (
    <div>
      <div>Module Component - Parcours ID: {id}</div>
      <div>{JSON.stringify(fromParcours)}</div>
    </div>
  );
}
