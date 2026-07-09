import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";

import bgImage from "../../../../src/assets/images/new-parcours-default.jpg";
import { parcoursApi } from "../api/parcours.api";
import NewParcoursForm from "../components/edit/new-parcours-form";
import FadeWrapper from "../../../../src/components/wrappers/FadeWrapper";
import Loader from "../../../../src/components/loaders/Loader";
import Wrapper from "../../../../src/components/wrappers/BoxWrapper";
import Selecter from "../../../components/UI/selecter/selecter.component";
import { HelpCircle } from "lucide-react";
import { bgImageGradient } from "../../../utils/helpers/color-helpers";
import QuestionMarkTooltip from "../../../components/UI/question-mark-tooltip/question-mark-tooltip";

type Item = {
  id: number;
  title: string;
  formationId?: number;
};

const AddParcours = () => {
  const [formation, setFormation] = useState<number | undefined>(undefined);
  const [parcoursList, setParcoursList] = useState<Array<Item>>([]);
  const [parcours, setParcours] = useState<number | undefined>(undefined);
  const nav = useNavigate();

  const { data: formations } = useQuery({
    queryKey: ["formations"],
    queryFn: () => parcoursApi.queries.getFormations(),
  });

  const { mutate: createParcours, isPending: isCreating } = useMutation({
    mutationFn: (data: { title: string; formationId: number }) =>
      parcoursApi.mutations.createParcours({
        title: data.title,
        formation: data.formationId,
      }),
    onSuccess: (data) => {
      nav(`/admin/parcours/edit/${data.parcoursId}`);
    },
  });

  const { mutate: duplicateParcours } = useMutation({
    mutationFn: (id: number) => parcoursApi.mutations.duplicateParcours(id),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Parcours dupliqué avec succès");
        nav(`/admin/parcours/edit/${data.parcoursId}`);
      }
    },
  });

  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(bgImage),
    width: "100%",
    minHeight: "20rem",
    maxHeight: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  const handleFormation = (id: number) => {
    setFormation(id);
    parcoursApi.queries
      .getByFormation(id)
      .then((data) => setParcoursList(data.data))
      .catch(() => toast.error("Erreur lors du chargement des parcours"));
  };

  const handleParcours = (id: number) => {
    setParcours(id);
  };

  const handleSubmit = ({
    title,
    formationId,
  }: {
    title: string;
    formationId: number;
  }) => {
    createParcours({ title, formationId });
  };

  const handleDuplicateParcours = () => {
    if (parcours !== undefined) duplicateParcours(parcours);
  };

  return (
    <FadeWrapper>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto">
        <>
          <div>
            {isCreating ? (
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
  );
};

export default AddParcours;
