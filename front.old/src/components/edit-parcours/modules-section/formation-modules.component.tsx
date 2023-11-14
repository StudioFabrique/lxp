import React, { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";

const FormationModule = () => {
  const { sendRequest } = useHttp();
  const [formationModules, setFormationModule] = useState<any>([]);

  useEffect(() => {
    const applyData = (data: any) => {
      console.log(data);
    };
    sendRequest(
      {
        path: `/module/formation/${1}`,
      },
      applyData
    );
  }, [sendRequest]);

  return <div></div>;
};

export default FormationModule;
