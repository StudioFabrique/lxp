/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import bgImage from "../../assets/images/new-parcours-default.jpg";
import useHttp from "../../hooks/use-http";
import NewParcoursForm from "../../components/edit-parcours/new-parcours-form";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import Loader from "../../components/UI/loader";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import Selecter from "../../components/UI/selecter/selecter.component";
import QuestionMarkTooltip from "../../components/UI/question-mark-tooltip/question-mark-tooltip";
import { HelpCircle } from "lucide-react";

// type de données pour les listes
type Item = {
  id: number;
  title: string;
  formationId?: number;
};

const AddParcours = () => {
  const [formations, setFormations] = useState<Array<Item>>([]);
  const [formation, setFormation] = useState<number | undefined>(undefined);
  const [parcoursList, setParcoursList] = useState<Array<Item>>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [parcours, setParcours] = useState<number | undefined>(undefined);
  const { sendRequest, error } = useHttp();
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

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

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  /**
   * requête pour récupérer la liste des formations dans la bdd
   */
  useEffect(() => {
    const processData = (data: Array<Item>) => {
      setFormations(data);
    };
    sendRequest(
      {
        path: "/formation",
      },
      processData
    );
  }, [sendRequest]);

  /**
   * sélection d'un formation
   * @param id number
   */
  const handleFormation = (id: number) => {
    setFormation(id);
  };

  /**
   * sélection d'un parcours lié à la formation sélectionnée
   * @param id number
   */
  const handleParcours = (id: number) => {
    setParcours(id);
  };

  /**
   * enregistrement des données du formulaire dans la bdd
   * @param param0 {title: string, formationId: number}
   */
  const handleSubmit = ({
    title,
    formationId,
  }: {
    title: string;
    formationId: number;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processData = (data: any) => {
      //toast.success("Parcours enregistré avec succès");
      nav(`/admin/parcours/edit/${data.parcoursId}`);
    };
    setIsLoading(true);
    sendRequest(
      {
        path: "/parcours",
        method: "post",
        body: { title, formation: formationId },
      },
      processData
    );
    setIsLoading(false);
  };

  const handleDuplicateParcours = () => {
    const applyData = (data: { success: true; parcoursId: number }) => {
      if (data.success) {
        toast.success("Parcours dupliqué avec succès");
        nav(`/admin/parcours/edit/${data.parcoursId}`);
      }
    };
    sendRequest(
      {
        path: `/parcours/duplicate/${parcours!}`,
        method: "post",
      },
      applyData
    );
  };

  /**
   * requête qui retourne la liste des parcours liés à la formation sélectionnée
   */
  useEffect(() => {
    if (formation !== undefined) {
      const processData = (data: any) => {
        setParcoursList(data.data);
      };
      sendRequest(
        {
          path: `/parcours/parcours-by-formation/${formation}`,
        },
        processData
      );
    }
  }, [formation, sendRequest]);

  return (
    <>
      <FadeWrapper>
        <div className="w-full xl:w-5/6 grid grid-cols-1 lg:grid-cols-2 gap-16 px-8 mx-auto my-16">
          <>
            <div>
              {isLoading ? (
                <div className="h-full grid grid-rows-1">
                  <Loader />
                </div>
              ) : (
                <div className="grid grid-rows-2 gap-8">
                  <h1 className="text-2xl font-extrabold">
                    Création d'un parcours
                  </h1>

                  <h3>
                    Pour commencer, veuillez saisir les informations nécessaires
                    pour créer le parcours
                  </h3>

                  <Wrapper>
                    <div className="h-full flex flex-col justify-around gap-y-4">
                      <div className="text-sm font-bold">
                        Créer un parcours à partir d'un modèle
                      </div>
                      <div className="flex flex-col gap-y-8">
                        <span className="w-full flex items-center gap-x-4">
                          <Selecter
                            list={formations}
                            title="Rechercher par formation"
                            onSelectItem={handleFormation}
                          />
                          <QuestionMarkTooltip tooltipValue="Chosissez une formation pour obtenir une liste de parcours dans le menu déroulant ci-dessous">
                            <HelpCircle className="w-6 h-6 text-info" />
                          </QuestionMarkTooltip>
                        </span>

                        <span className="w-full flex items-center gap-x-4">
                          <Selecter
                            list={parcoursList}
                            title="Choisisez le parcours à dupliquer"
                            onSelectItem={handleParcours}
                          />
                          <QuestionMarkTooltip tooltipValue="Les compétences, objectifs, ressources pédagogiques, modules, cours, leçons et activités associés au parcours choisi seront également dupliqués lors de l'opération.">
                            <HelpCircle className="w-6 h-6 text-info" />
                          </QuestionMarkTooltip>
                        </span>
                      </div>
                      <div className="w-full flex justify-end mt-4">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={handleDuplicateParcours}
                          disabled={parcours === undefined || !formation}
                        >
                          Créer
                        </button>
                      </div>
                    </div>
                  </Wrapper>

                  <h3>Ou</h3>
                  <Wrapper>
                    <NewParcoursForm
                      formations={formations}
                      onSubmit={handleSubmit}
                    />
                  </Wrapper>
                </div>
              )}
            </div>
            <div style={classImage} />
          </>
        </div>
      </FadeWrapper>
    </>
  );
};

export default AddParcours;
