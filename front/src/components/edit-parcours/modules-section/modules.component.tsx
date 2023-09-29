import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useHttp from "../../../hooks/use-http";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Module from "../../../utils/interfaces/module";
import ModuleForm from "./module-form.component";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";
import ModuleList from "./module-list";
import { sortArray } from "../../../utils/sortArray";

const ModulesSection = () => {
  const dispatch = useDispatch();
  const { isLoading, sendRequest } = useHttp();
  const [formationModules, setFormationModules] = useState<Module[]>([]);
  const params = useParams();
  const parcoursId = params.id;
  const formationId = useSelector((state: any) => state.parcours.formation.id);
  const formRef = useRef<HTMLInputElement>(null);
  const [toggleForm, setToggleForm] = useState(false);
  const [newModule, setNewModule] = useState(false);
  const parcoursModules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];
  const [moduleToEdit, setModuleToEdit] = useState<Module | null>(null);
  const getFormationModules = useCallback(() => {
    const applyData = (data: Module[]) => {
      setFormationModules(sortArray(data, "id", false));
    };
    sendRequest(
      {
        path: `/modules/formation/${formationId}`,
      },
      applyData
    );
  }, [formationId, sendRequest]);

  useEffect(() => {
    getFormationModules();
  }, [getFormationModules]);

  const handleSubmitModule = (formData: FormData) => {
    const applyData = (data: any) => {
      setNewModule(false);
      setToggleForm(false);
      setFormationModules((prevData) =>
        sortArray([...prevData, data.data], "id", false)
      );
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

  const handleUpdateModule = (formData: FormData) => {
    const applyData = (data: any) => {
      console.log({ data });
      const module = {
        ...data.data,
        contacts: data.data.contacts.map((item: any) => item.contact),
        bonusSkills: data.data.bonusSkills.map((item: any) => item.bonusSkill),
      };
      dispatch(parcoursModulesSliceActions.replaceModule(module));
      setModuleToEdit(null);
      setToggleForm(false);
    };
    sendRequest(
      {
        path: "/modules/new-module/update",
        method: "put",
        body: formData,
      },
      applyData
    );
  };

  /**
   * efface une copie de module rattachée au parcours et toutes ses relations avec les compétences et les contacts
   * @param id string
   */
  const handleDeleteModule = (id: number) => {
    const applyData = (_data: Module) => {
      dispatch(parcoursModulesSliceActions.removeModule(id));
    };
    sendRequest(
      {
        path: `/modules/${id}`,
        method: "delete",
      },
      applyData
    );
  };

  /**
   * enregistre une copie du module et la rattache au parcours
   * et l'affiche dans la liste des modules du parcours
   * @param id number
   */
  const handleSelectModule = (id: number) => {
    const applyData = (data: any) => {
      dispatch(parcoursModulesSliceActions.addNewModule(data));
    };
    const module = formationModules.find((item) => item.id === id);
    if (module && !toggleForm) {
      sendRequest(
        {
          path: `/modules/add-module/${parcoursId}/${module.id}`,
          method: "put",
        },
        applyData
      );
    }
  };

  const handleCreateModule = () => {
    setNewModule(true);
    setToggleForm(true);
  };

  const handleModuleToEdit = (id: number) => {
    console.log("id", id);

    const module = parcoursModules.find((item) => item.id === id);
    console.log("module", module);

    if (module) {
      setModuleToEdit(module);
    }
    setToggleForm(true);
  };

  const handleCancel = () => {
    setNewModule(false);
    setModuleToEdit(null);
    setToggleForm(false);
  };

  useEffect(() => {
    dispatch(parcoursModulesSliceActions.setIsFormOpen(toggleForm));
  }, [toggleForm, dispatch]);

  // scroll jusqu'au premier champ du formulaire qd ce dernier est ouvert
  useEffect(() => {
    if ((newModule || moduleToEdit) && formRef && formRef.current) {
      formRef.current!.scrollIntoView({ behavior: "smooth" });
      formRef.current!.focus();
    }
  }, [newModule, moduleToEdit]);

  return (
    <div className="flex flex-col gap-y-8">
      <section>
        <h1 className="text-3xl font-extrabold">Modules</h1>
      </section>
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Wrapper>
            <ModuleList
              isSourceList={true}
              isLoading={isLoading}
              modules={formationModules}
              label="Modules de la formation"
              onEdit={() => {}}
              onSelect={handleSelectModule}
              onDelete={handleDeleteModule}
            />
          </Wrapper>
          <Wrapper>
            <ModuleList
              isSourceList={false}
              isLoading={isLoading}
              modules={parcoursModules}
              label="Modules du parcours"
              onEdit={handleModuleToEdit}
              onSelect={() => {}}
              onDelete={handleDeleteModule}
            />
          </Wrapper>
        </div>
      </section>
      <section>
        <div className="w-full flex justify-between">
          <button
            className="btn btn-outline btn-primary"
            onClick={handleCreateModule}
            disabled={toggleForm}
          >
            Créer un module
          </button>
        </div>
      </section>

      {toggleForm ? (
        <>
          {newModule ? (
            <Wrapper>
              <ModuleForm
                onSubmitModule={handleSubmitModule}
                isLoading={isLoading}
                ref={formRef}
                onCancel={handleCancel}
              />
            </Wrapper>
          ) : (
            <Wrapper>
              <ModuleForm
                currentModule={moduleToEdit}
                onSubmitModule={handleUpdateModule}
                isLoading={isLoading}
                ref={formRef}
                onCancel={handleCancel}
              />
            </Wrapper>
          )}
        </>
      ) : null}
    </div>
  );
};

export default ModulesSection;
