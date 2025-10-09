import { Link, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useState } from "react";
import ElementNotFound from "../../UI/element-not-found";
import ModulesList from "./modules-list";
import { Copy, PlusCircle } from "lucide-react";

// Type pour les données du module
interface ModuleData {
  id: number;
  title: string;
  thumb?: string;
}

export default function ModuleComponent() {
  const { sendRequest } = useHttp();
  const { id } = useParams();

  const [fromParcours, setFromParcours] = useState<ModuleData[]>([]);

  const getParcoursModules = useCallback(() => {
    const applyData = (data: ModuleData[]) => {
      console.log(data);
      setFromParcours(data);
    };
    sendRequest({ path: `/modules/${id}` }, applyData);
  }, [id, sendRequest]);

  useEffect(() => {
    getParcoursModules();
  }, [getParcoursModules]);

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">
          Modules associés au Parcours
        </h1>
        <span className="flex gap-x-2 items-center">
          <button className="btn btn-primary">
            <PlusCircle />
            Créer un nouveau module
          </button>
          <button className="btn btn-primary">
            <Copy />
            Ajouter un module
          </button>
        </span>
      </div>

      {fromParcours.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fromParcours.map((module) => (
            <ModulesList {...module} key={module.id} />
          ))}
        </div>
      ) : (
        <ElementNotFound message="Aucun module trouvé" />
      )}
    </div>
  );
}
