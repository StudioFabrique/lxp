import ResourcesAddHeader from "../../components/resources-add/ResourcesAddHeader";
import ListHeader from "../../components/UI/list-header";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import ResourceForm from "../../components/resources-add/ResourceForm";
import Can from "../../components/UI/can/can.component";
import ActivityCreationOptionsButtons from "../../components/lessons-preview/writing/activity-creation-options-buttons";
import TipTapActivity from "../../components/lessons-preview/writing/tip-tap-activity";
import BonusActivityItem from "../../components/resources-add/BonusActivityItem";
import useAddResource from "./hooks/useAddResource";
import Modal from "../../components/UI/modal/modal";
import ElementNotFound from "../../components/UI/element-not-found";
import ActivityPreview from "../../components/lessons-preview/preview/activity";

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
    isAnyActivityBeingEdited,
    setIsAnyActivityBeingEdited,
    handleClickShowTipTapEditor,
    handleCloseTipTapEditor,
    handleSubmitForm,
    handleActivityCreated,
    handleDeleteActivity,
    activityToDelete,
    setActivityToDelete,
    previewActivity,
    setPreviewActivity,
  } = useAddResource();

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
                resource.bonusActivities &&
                resource.bonusActivities.length > 0 ? (
                  <ul>
                    {resource.bonusActivities.map((activity) => (
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
                <TipTapActivity
                  parentId={resource.id}
                  isNewActivity={true}
                  onCloseTipTapEditor={handleCloseTipTapEditor}
                  onRefreshAllData={() => {}}
                  isAnyActivityBeingEdited={isAnyActivityBeingEdited}
                  onActivityEditChange={setIsAnyActivityBeingEdited}
                  parent="resource"
                  onActivityCreated={handleActivityCreated}
                />
              ) : resource ? (
                <>
                  {previewActivity ? (
                    <>
                      <div className="flex justify-center text-primary capitalize">
                        {previewActivity.title}
                      </div>
                      <ActivityPreview
                        lessonId={resource.id ?? 0}
                        activity={previewActivity}
                        isAnyActivityBeingEdited={isAnyActivityBeingEdited}
                        onActivityEditChange={setIsAnyActivityBeingEdited}
                      />
                    </>
                  ) : null}
                  <ActivityCreationOptionsButtons
                    bgColor="bg-secondary/20"
                    onClickShowTipTapEditor={handleClickShowTipTapEditor}
                    selectedLesson={resource!}
                    isDisabled={isAnyActivityBeingEdited}
                  />
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
