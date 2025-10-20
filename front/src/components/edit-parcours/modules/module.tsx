import { useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useRef, useState } from "react";
import ElementNotFound from "../../UI/element-not-found";
import ModulesList from "./modules-list";
import { Copy, PlusCircle } from "lucide-react";
import { moduleCreateSchema } from "../../../lib/validation/parcours-edit/module-create-schema";
import CreateModuleForm from "./create-module-form";
import useForm from "../../UI/forms/hooks/use-form";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";
import Module from "../../UI/sidebar/sidebar-parts/module";
import ModuleMetadatas from "../../../views/module/add/module-metadatas";

// Type pour les données du module
type ModuleData = {
  id: number;
  title: string;
  thumb?: string;
};

type Parcours = {
  id: number;
  formationId: number;
  contacts: Contact[];
  bonusdSkills: Skill[];
};

export default function ModuleComponent() {
  const { sendRequest, isLoading } = useHttp();
  const { id } = useParams();
  const formRef = useRef<HTMLInputElement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [parcours, setParcours] = useState<Parcours | null>(null);

  const {
    values,
    onChangeValue,
    onResetForm,
    errors,
    onValidationErrors,
    initValues,
  } = useForm({}, moduleCreateSchema);

  const getParcoursModules = useCallback(() => {
    const applyData = (data: {
      modules: ModuleData[];
      parcoursData: Parcours;
    }) => {
      console.log(data);
      setModules(data.modules);
      setParcours(data.parcoursData);
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
          <button
            className="btn btn-primary"
            disabled={showForm}
            onClick={() => setShowForm(true)}
          >
            <PlusCircle />
            Créer un nouveau module
          </button>
          <button className="btn btn-primary">
            <Copy />
            Ajouter un module
          </button>
        </span>
      </div>

      {modules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <ModulesList {...module} key={module.id} />
          ))}
        </div>
      ) : (
        <ElementNotFound message="Aucun module trouvé" />
      )}
      {showForm ? (
        <>
          <div className="divider">Création de module</div>
          <Wrapper>
<ModuleMetadatas data={}>
          </Wrapper>
        </>
      ) : null}
    </div>
  );
}
