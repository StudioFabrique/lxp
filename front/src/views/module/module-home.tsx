/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Loader from "../../components/UI/loader";
import Module from "../../utils/interfaces/module";
import useHttp from "../../hooks/use-http";
import ModuleHomeList from "../../components/module-home/module-home";

const ModuleHome = () => {
  const [modules, setModules] = useState<Module[] | null>(null);
  const { sendRequest, error, isLoading } = useHttp();

  useEffect(() => {
    const applyData = (data: any) => {
      setModules(data.response);
    };
    sendRequest(
      {
        path: "/modules",
      },
      applyData
    );
  }, [sendRequest]);

  return (
    <main className="w-full min-h-screen flex justify-center ">
      {isLoading ? (
        <div className="flex items-center">
          <Loader />
        </div>
      ) : (
        <>{modules ? <ModuleHomeList modulesList={modules} /> : null}</>
      )}
    </main>
  );
};

export default ModuleHome;
