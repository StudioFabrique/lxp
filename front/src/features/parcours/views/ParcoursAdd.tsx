import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";

import bgImage from "../../../../src/assets/images/new-parcours-default.jpg";
import { parcoursApi } from "../api/parcours.api";
import NewParcoursForm from "../components/edit/new-parcours-form";
import FadeWrapper from "../../../../src/components/wrappers/FadeWrapper";
import Loader from "../../../../src/components/loaders/Loader";
import Wrapper from "../../../../src/components/wrappers/BoxWrapper";
import Selecter from "../../../components/UI/selecter/selecter.component";
import { Copy, Layers3 } from "lucide-react";
import { bgImageGradient } from "../../../utils/helpers/color-helpers";
import Modal from "../../../components/UI/modal/modal";
import { emitOnboardingEvent } from "../../onboarding/onboarding-events";
import type { AxiosError } from "axios";

type Item = {
  id: number;
  title: string;
  formationId?: number;
};

const AddParcours = () => {
  const [searchParams] = useSearchParams();
  const requestedFormationId = Number(searchParams.get("formationId"));
  const initialFormationId =
    Number.isInteger(requestedFormationId) && requestedFormationId > 0
      ? requestedFormationId
      : undefined;
  const [formation, setFormation] = useState<number | undefined>(
    initialFormationId,
  );
  const [parcoursList, setParcoursList] = useState<Array<Item>>([]);
  const [parcours, setParcours] = useState<number | undefined>(undefined);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
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
      emitOnboardingEvent({
        type: "parcours_created",
        id: data.parcoursId,
      });
      nav(`/admin/parcours/edit/${data.parcoursId}`);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message ??
          "Le parcours n’a pas pu être enregistré.",
      );
    },
  });

  const { mutate: duplicateParcours, isPending: isDuplicating } = useMutation({
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

  const closeTemplateModal = () => {
    if (isDuplicating) return;
    setShowTemplateModal(false);
    setParcours(undefined);
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
              <div className="flex flex-col gap-8">
                <h1 className="text-2xl font-extrabold">
                  Création d'un parcours
                </h1>

                <h3>
                  Pour commencer, veuillez saisir les informations nécessaires
                  pour créer le parcours
                </h3>

                <div data-onboarding="parcours-create">
                  <Wrapper>
                    <h2 className="text-lg font-bold">
                      Créer un nouveau parcours
                    </h2>
                    <NewParcoursForm
                      formations={formations}
                      initialFormationId={initialFormationId}
                      onSubmit={handleSubmit}
                    />
                  </Wrapper>
                </div>

                <div className="divider">ou</div>

                <button
                  className="btn btn-outline btn-secondary w-full min-h-14"
                  type="button"
                  onClick={() => setShowTemplateModal(true)}
                >
                  <Layers3 className="h-5 w-5" />
                  Créer un parcours à partir d'un modèle
                </button>
              </div>
            )}
          </div>
          <div style={classImage} />
        </>
      </div>
      {showTemplateModal && (
        <Modal
          title="Créer un parcours à partir d'un modèle"
          titleTooltip="Les objectifs, compétences, contacts, modules, cours, leçons et
          activités du parcours sélectionné seront dupliqués."
          leftLabel="Annuler"
          rightLabel="Dupliquer le parcours"
          onLeftClick={closeTemplateModal}
          onRightClick={handleDuplicateParcours}
          isSubmitting={isDuplicating}
          rightDisabled={parcours === undefined}
          modalBoxStyle="w-11/12 max-w-3xl"
        >
          <div className="mt-6 flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Rechercher par formation
              </label>
              <Selecter
                list={formations ?? []}
                title="Sélectionner une formation"
                onSelectItem={handleFormation}
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Parcours disponibles</p>
              {!formation ? (
                <p className="p-6 text-center text-sm text-base-content/60">
                  Sélectionnez une formation pour afficher ses parcours.
                </p>
              ) : parcoursList.length === 0 ? (
                <p className="rounded-xl p-6 text-center text-sm text-base-content/60">
                  Aucun parcours ne peut être utilisé comme modèle.
                </p>
              ) : (
                <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                  {parcoursList.map((item) => {
                    const selected = parcours === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleParcours(item.id)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                          selected
                            ? "border-primary bg-primary/10"
                            : "border-base-300 bg-base-100 hover:border-primary/50 cursor-pointer"
                        }`}
                      >
                        <Copy className="h-4 w-4 shrink-0 text-primary" />
                        <span className="font-medium">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </FadeWrapper>
  );
};

export default AddParcours;
