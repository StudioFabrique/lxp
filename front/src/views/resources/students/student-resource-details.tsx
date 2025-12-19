import { Link } from "react-router-dom";
import Header from "../../../components/UI/header";
import ListHeader from "../../../components/UI/list-header";
import { ArrowLeft } from "lucide-react";
import useResource from "../hooks/useResource";
import ActivityContent from "../../../components/resources-add/ActivityContent";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import BonusActivityItem from "../../../components/resources-add/BonusActivityItem";
import { Activity } from "../../../utils/interfaces/activity";
import ElementNotFound from "../../../components/UI/element-not-found";

export default function StudentResourceDetails() {
  const {
    activityType,
    activityState,
    data,
    setActivityState,
    resource,
    setActivityToDelete,
    previewActivity,
    setPreviewActivity,
    handleCloseTextEditor,
    resourceId,
    setEditActivity,
    refreshActivityList,
    uploadVideo,
    closePreviewActivity,
    resourceActivityiesSubmitted,
    submitIframeActivity,
  } = useResource();

  const placeholder = (
    <div className="border border-primary/20 rounded-lg p-8 relative">
      <div className="m-auto xl:w-6/12">
        <h2 className="text-center text-primary text-lg font-bold mb-8">
          Détail des activités
        </h2>
        <p className="text-sm text-center text-secondary">
          Choisissez une activité parmi celles proposées pour afficher son
          contenu.
        </p>
      </div>
    </div>
  );
  return (
    <main className="min-h-screen w-full flex flex-col items-center">
      <ListHeader>
        <Header
          title={resource?.title ?? "Détails de la ressource"}
          description={resource?.description ?? ""}
        >
          <Link className="btn btn-primary" to="/student/ressources">
            <ArrowLeft />
            Retour à la liste des ressources
          </Link>
        </Header>

        <div className="w-full flex-1 flex lg:flex-row flex-col pb-24 gap-8">
          <section className="w-full lg:w-[25rem] h-full flex flex-col gap-4">
            <article className="flex-1">
              <Wrapper>
                {resource &&
                resource.activities &&
                resource.activities.length > 0 ? (
                  <ul>
                    {resource.activities.map((activity: Activity) => (
                      <li key={activity.id} className="mb-2 w-full">
                        <BonusActivityItem
                          disabled={false}
                          activity={activity}
                          onDelete={setActivityToDelete}
                          onEdit={setEditActivity}
                          onPreview={setPreviewActivity}
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
            <ActivityContent
              activityState={activityState}
              parentId={resourceId ? +resourceId : 0}
              previewActivity={previewActivity}
              activityType={activityType!}
              onClose={closePreviewActivity}
              setActivityState={setActivityState}
              setPreviewActivity={setPreviewActivity}
              refreshActivityList={refreshActivityList}
              closePreviewActivity={closePreviewActivity}
              uploadVideo={uploadVideo}
              data={data}
              resourceActivitiesSubmitted={resourceActivityiesSubmitted}
              submitIframeActivity={submitIframeActivity}
              onCloseTextEditor={handleCloseTextEditor}
            >
              {placeholder}
            </ActivityContent>
          </section>
        </div>
      </ListHeader>
    </main>
  );
}
