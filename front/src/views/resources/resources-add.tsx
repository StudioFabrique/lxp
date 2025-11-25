import ResourcesAddHeader from "../../components/resources-add/ResourcesAddHeader";
import ListHeader from "../../components/UI/list-header";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import ResourceForm from "../../components/resources-add/ResourceForm";
import Can from "../../components/UI/can/can.component";
import BonusActivityItem from "../../components/resources-add/BonusActivityItem";
import Modal from "../../components/UI/modal/modal";
import ElementNotFound from "../../components/UI/element-not-found";
import ActivityCreationOptionsButtons from "../../components/module-content-explorer/writing/activity-creation-options-buttons";
import TiptapActivity from "../../components/module-content-explorer/writing/tip-tap-activity";
import useResource from "./hooks/useResource";
import { Activity } from "../../utils/interfaces/activity";

export default function ResourceAdd() {
  const {
    newActivity,
    activityState,
    mode,
    setFile,
    data,
    isLoading,
    tags,
    setTags,
    tagError,
    setTagError,
    showTipTapEditor,
    resource,
    handleSubmitForm,
    handleDeleteActivity,
    activityToDelete,
    setActivityToDelete,
    previewActivity,
    setPreviewActivity,
    activitiesActionsDisabled,
    handleCloseTextEditor,
    title,
    content,
    setTitle,
    editActivityContent,
    updateActivities,
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
                  mode={mode}
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
                    {resource.activities.map((activity: Activity) => (
                      <li key={activity.id} className="mb-2 w-full">
                        <BonusActivityItem
                          disabled={activitiesActionsDisabled}
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
              {(resource && showTipTapEditor) || previewActivity ? (
                <TiptapActivity
                  id={previewActivity?.id ?? resource?.activities.length ?? 0}
                  title={title}
                  content={content}
                  mode={activityState}
                  onClose={handleCloseTextEditor}
                  onEditTitle={setTitle}
                  onEditContent={editActivityContent}
                  onSave={() =>
                    updateActivities(
                      previewActivity ? previewActivity.id : resource?.id ?? 0,
                      title,
                      content,
                      activityState
                    )
                  }
                />
              ) : resource ? (
                <div className="w-full border border-primary/20 rounded-lg p-8">
                  <div className="m-auto xl:w-6/12">
                    <h2 className="text-center text-primary text-lg font-bold mb-8">
                      Gérez les activités liées aux ressources supplémentaires
                    </h2>
                    <p className="text-sm text-center text-secondary">
                      Ajoutez des activités bonus à cette ressource pour
                      enrichir l'expérience d'apprentissage des apprenants. Vous
                      pouvez créer des activités de type texte, vidéo, image ou
                      documents de différents formats.
                    </p>
                  </div>
                  <ActivityCreationOptionsButtons
                    selectedLesson={resource}
                    onClickShowTipTapEditor={newActivity}
                  />
                </div>
              ) : (
                <ElementNotFound message="Créez une ressource pour ajouter des activités bonus." />
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
