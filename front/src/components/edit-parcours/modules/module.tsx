import { useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useRef, useState } from "react";
import ElementNotFound from "../../UI/element-not-found";
import ModulesList from "./modules-list";
import { Copy, PlusCircle } from "lucide-react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";
import ModuleMetadatas from "../../../views/module/add/module-metadatas";
import ModuleToParcours from "../../../views/module/add/module-to-parcours";
import useForm from "../../UI/forms/hooks/use-form";
import { moduleCreateSchema } from "../../../lib/validation/parcours-edit/module-create-schema";

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
  bonusSkills: Skill[];
};

export default function ModuleComponent() {
  const { sendRequest, isLoading } = useHttp();
  const { id } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [parcours, setParcours] = useState<Parcours | null>(null);
  const [currentContacts, setCurrentContacts] = useState<Contact[]>([]);
  const [currentSkills, setCurrentSkills] = useState<Skill[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const refModule = useRef<HTMLFormElement | null>(null);

  const { values, onChangeValue, onResetForm, errors, onValidateForm } =
    useForm({}, moduleCreateSchema);

  const data = { values, onChangeValue, errors };

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

  console.log("Contacts :", currentContacts);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Valider le formulaire
    const isValid = onValidateForm();
    if (!isValid) {
      return;
    }

    const formData = new FormData();
    const module = {
      ...data.values,
      formationId: parcours?.formationId,
      duration:
        +data.values.duration === 0 || isNaN(+data.values.duration)
          ? 1
          : +data.values.duration,
      contacts: currentContacts.map((item) => item.id),
      skills: currentSkills.map((item) => item.id),
    };
    formData.append("module", JSON.stringify(module));
    if (file) formData.append("image", file);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const applyData = (data: { data: ModuleData; message: string }) => {
      onResetForm();
      setShowForm(false);
      setCurrentContacts([]);
      setCurrentSkills([]);
      setFile(null);
      setModules((prevModules) => [...prevModules, data.data as ModuleData]);
    };
    sendRequest(
      {
        path: "/formation/new-module",
        method: "post",
        body: formData,
      },
      applyData
    );
  };

  const handleCancelForm = () => {
    setShowForm(false);
    onResetForm();
    setCurrentContacts([]);
    setCurrentSkills([]);
    setFile(null);
  };

  useEffect(() => {
    if (showForm) {
      if (refModule && refModule.current) {
        refModule.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [showForm]);

  return (
    <div className="flex flex-col gap-y-4">
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
        <Wrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <ModulesList {...module} key={module.id} />
            ))}
          </div>
        </Wrapper>
      ) : (
        <ElementNotFound message="Aucun module trouvé" />
      )}
      {showForm ? (
        <>
          <div className="divider">Création de module</div>
          <Wrapper>
            <form onSubmit={handleSubmit} ref={refModule}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ModuleMetadatas data={data} onSetFile={setFile} />
                <ModuleToParcours
                  currentContacts={currentContacts ?? []}
                  currentSkills={currentSkills ?? []}
                  contacts={parcours?.contacts ?? []}
                  skills={parcours?.bonusSkills ?? []}
                  isLoading={isLoading}
                  setCurrentContacts={setCurrentContacts}
                  setCurrentSkills={setCurrentSkills}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={handleCancelForm}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer le module
                </button>
              </div>
            </form>
          </Wrapper>
        </>
      ) : null}
    </div>
  );
}
