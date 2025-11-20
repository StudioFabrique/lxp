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
import TiptapActivity from "../../components/lessons-preview/writing/tip-tap-activity";
import ActivityCreationOptionsButtons from "../../components/lessons-preview/writing/activity-creation-options-buttons";

export default function ResourceEdit() {
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
    setTitle,
    createActivity,
    editActivityContent,
    content,
    title,
  } = useResource();
  console.log({ showTipTapEditor });

  return (
    <main className="min-h-screen w-full flex flex-col items-center">
      <ListHeader>
        <ResourcesAddHeader />
        <div className="w-full flex-1 flex lg:flex-row flex-col pb-24 gap-8">
          <section className="w-full lg:w-[25rem] h-full flex flex-col gap-4">
            <article className="flex-1">
              <Wrapper>
                <ResourceForm
                  mode={resource ? "edit" : "add"}
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
              {resource &&
              previewActivity &&
              previewActivity.type === "text" &&
              showTipTapEditor ? (
                // Maintenant, tous les états de l'éditeur de texte sont à gérer depuis l'extérieur, tkt c'est simple
                <TiptapActivity
                  // Il peut être utile d'utiliser key dans certaines situation dans lesquelles le composant ne se remonte pas correctement
                  // key={`tiptap_${mode}`}
                  // id tout court au lieu de parentId, au moins c'est clair et tout autant générique
                  id={resource.id}
                  // props title à passer (dynamique, ne pas reproduire le description: "description" avec title: "title" loool)
                  title={title}
                  // props content à passer (dynamique, représente le contenu entier de l'editeur de texte sous forme de html)
                  content={content}
                  mode="edit"
                  onClose={handleCloseTipTapEditor}
                  onEditTitle={setTitle} // Appelé dès lors que le titre est modifié
                  onEditContent={editActivityContent} // Appelé dès lors que le contenu est modifié
                  onSave={() => createActivity(0, title, content)}
                />
              ) : resource && previewActivity ? (
                <>
                  <ActivityCreationOptionsButtons
                    selectedLesson={resource}
                    onClickShowTipTapEditor={handleClickShowTipTapEditor}
                  />
                  {previewActivity && previewActivity.type !== "text" ? (
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
