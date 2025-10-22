import ResourcesAddHeader from "../../components/resources-add/ResourcesAddHeader";
import ListHeader from "../../components/UI/list-header";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import ResourceForm from "../../components/resources-add/ResourceForm";
import Can from "../../components/UI/can/can.component";
import BonusActivityItem from "../../components/resources-add/BonusActivityItem";
import Modal from "../../components/UI/modal/modal";
import ElementNotFound from "../../components/UI/element-not-found";
import ActivityPreview from "../../components/lessons-preview/preview/activity-preview";
import useResource from "./hooks/useResource";
import ActivityCreationOptionsButtons from "../../components/lessons-preview/writing/activity-creation-options-buttons";
import TiptapActivity from "../../components/lessons-preview/writing/tip-tap-activity";

export default function ResourceAdd() {
  const {
    setFile,
    data,
    isLoading,
    tags,
    setTags,
    tagError,
    setTagError,
    showTipTapEditor,
    resource,
    handleClickShowTipTapEditor,
    handleCloseTipTapEditor,
    handleSubmitForm,
    handleDeleteActivity,
    activityToDelete,
    setActivityToDelete,
    previewActivity,
    setPreviewActivity,
  } = useResource();

  return (
    <main className="min-h-screen w-full flex flex-col items-center">
      <ListHeader>
        <ResourcesAddHeader />
        <div className="w-full flex-1 flex lg:flex-row flex-col pb-24 gap-8">
          <section className="w-full lg:w-[25rem] h-full flex flex-col gap-4">
            <article className="flex-1">
              <Wrapper>
                <ResourceForm
                  data={data}
                  onSubmit={handleSubmitForm}
                  isLoading={isLoading}
                  tags={tags}
                  setTags={setTags}
                  tagError={tagError}
                  onTagError={setTagError}
                  onSetFile={setFile}
                />
              </Wrapper>
            </article>
            <article>
              <Wrapper>
                {resource &&
                resource.activities &&
                resource.activities.length > 0 ? (
                  <ul>
                    {resource.activities.map((activity) => (
                      <li key={activity.id} className="mb-2 w-full">
                        <BonusActivityItem
                          activity={activity}
                          onDelete={setActivityToDelete}
                          onEdit={setPreviewActivity}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs">
                    <ElementNotFound message="Aucune activité liée à cette ressource pour le moment. Vous pourrez en ajouter une fois que vous aurez enregistré la ressource." />
                  </div>
                )}
              </Wrapper>
            </article>
          </section>
          <section className="flex-1 flex flex-col gap-4">
            <Can action="write" object="lesson">
              {resource && showTipTapEditor ? (
                // Maintenant, tous les états de l'éditeur de texte sont à gérer depuis l'extérieur, tkt c'est simple
                <TiptapActivity
                  // Il peut être utile d'utiliser key dans certaines situation dans lesquelles le composant ne se remonte pas correctement
                  // key={`tiptap_${mode}`}
                  // id tout court au lieu de parentId, au moins c'est clair et tout autant générique
                  id={resource.id}
                  // props title à passer (dynamique, ne pas reproduire le description: "description" avec title: "title" loool)
                  title=""
                  // props content à passer (dynamique, représente le contenu entier de l'editeur de texte sous forme de html)
                  content=""
                  // passer le mode d'edition "read", "edit" ou "write", peut être un state dynamique passé en props
                  mode="write"
                  // Appelé, quand on appuie sur fermer/annuler
                  onClose={handleCloseTipTapEditor}
                  onEditTitle={(title) => {}} // Appelé dès lors que le titre est modifié
                  onEditContent={(content) => {}} // Appelé dès lors que le contenu est modifié
                  onSave={async (id, title, content) => {
                    // retourner un boolean de façon asynchrone
                    const requeteReussi = true; // ou false si requête échoue ou autre type d'erreur

                    // await machinTrucToto()

                    return requeteReussi;
                  }}
                />
              ) : resource ? (
                <>
                  <ActivityCreationOptionsButtons
                    selectedLesson={resource}
                    onClickShowTipTapEditor={handleClickShowTipTapEditor}
                  />
                  {previewActivity ? (
                    <>
                      <div className="flex justify-center text-primary capitalize">
                        {previewActivity.title}
                      </div>
                      <ActivityPreview activity={previewActivity} />
                    </>
                  ) : null}
                </>
              ) : (
                <ElementNotFound message="Enregistrez la ressource pour ajouter des activités bonus." />
              )}
            </Can>
          </section>
        </div>
        {activityToDelete ? (
          <Modal
            onLeftClick={() => setActivityToDelete(null)}
            onRightClick={handleDeleteActivity}
            title="Supprimer une activité"
            isSubmitting={isLoading}
            leftLabel="Annuler"
            rightLabel="Confirmer"
          >
            Attention l'activité sera supprimée définitivement.
          </Modal>
        ) : null}
      </ListHeader>
    </main>
  );
}
