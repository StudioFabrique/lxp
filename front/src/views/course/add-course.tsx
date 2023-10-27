import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";

import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import toast from "react-hot-toast";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import Selecter from "../../components/UI/selecter/selecter.component";
import NewCourseForm from "../../components/edit-course/new-course-form";
import bgImage from "../../assets/images/new-parcours-default.jpg";
import { useNavigate } from "react-router-dom";

// type de données pour les listes
type Item = {
  id: number;
  title: string;
  reference?: number;
  tooltip: string;
};

const AddCourse = () => {
  const { sendRequest, error } = useHttp();
  const [parcoursList, setParcoursList] = useState<Item[]>([]);
  const [parcoursId, setParcoursId] = useState<number | null>(null);
  const [modulesList, setModulesList] = useState<Item[]>([]);
  const [moduleId, setModuleId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  // Image affichée sur la vue sous forme de background-image
  const classImage: React.CSSProperties = {
    backgroundImage: `url('${bgImage}')`,
    width: "100%",
    minHeight: "20rem",
    maxHeight: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  /**
   * définit le parcours sélectionné par l'utilisateur dans le but de
   * récupérer les modules associés à ce parcours
   * @param id number
   */
  const handleParcours = (id: number) => {
    setParcoursId(id);
  };

  /**
   * actualise l'id du module auquel doit être rattaché le cours
   * @param id number
   */
  const handleModuleId = (id: number) => {
    setModuleId(id);
  };

  /**
   * enregistre le cours dans la bdd
   * @param title string
   */
  const handleSubmit = (title: string) => {
    if (moduleId) {
      setIsLoading(true);
      const applyData = (data: any) => {
        setIsLoading(false);
        toast.success(data.message);
        nav(`/admin/course/edit/${data.course.id}`);
      };
      sendRequest(
        {
          path: "/course",
          method: "post",
          body: { title, moduleId },
        },
        applyData
      );
    }
  };

  /**
   * récupération de la liste des parcours
   */
  useEffect(() => {
    const applyData = (data: Item[]) => {
      setParcoursList(data);
    };
    sendRequest(
      {
        path: "/parcours",
      },
      applyData
    );
  }, [sendRequest]);

  /**
   * récupération de la liste des modules associés à un parcours
   */
  useEffect(() => {
    // quand un parcours est séléctionné on envoie une requête pour
    // récupérer les modules associés au parcours
    if (parcoursId) {
      const applyData = (data: any[]) => {
        setModulesList(data);
      };

      sendRequest(
        {
          path: `/modules/${parcoursId}`,
        },
        applyData
      );
    }
  }, [parcoursId, sendRequest]);

  /**
   * gestion des erreurs HTTP
   */
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setIsLoading(false);
    }
  }, [error]);

  return (
    <FadeWrapper>
      <div className="w-full xl:w-5/6 grid grid-cols-1 lg:grid-cols-2 gap-16 px-8 mx-auto my-16">
        <>
          <div>
            <div className="grid grid-rows-2 gap-8">
              <h1 className="text-2xl font-extrabold">Création d'un cours</h1>

              <h3>
                Pour commencer, veulliez saisir les informations nécessaires
                pour créer le cours
              </h3>

              <Wrapper>
                <div className="h-full flex flex-col justify-around gap-y-4">
                  <div className="text-sm font-bold">
                    Choisissez un parcours
                  </div>
                  <div className="flex flex-col gap-y-8">
                    <Selecter
                      list={parcoursList}
                      title="Choisissez un parcours"
                      onSelectItem={handleParcours}
                    />
                    <Selecter
                      list={modulesList}
                      title="Choisisez un module"
                      onSelectItem={handleModuleId}
                    />
                    <NewCourseForm
                      isLoading={isLoading}
                      onSubmit={handleSubmit}
                    />
                  </div>
                </div>
              </Wrapper>
            </div>
          </div>
          <div style={classImage} />
        </>
      </div>
    </FadeWrapper>
  );
};

export default AddCourse;
