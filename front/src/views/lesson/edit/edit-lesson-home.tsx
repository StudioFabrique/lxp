/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import ActionsButtonsGroup from "../../../components/edit-lesson/actions-buttons-group";
import { BlogUpdate } from "../../../components/edit-lesson/activities/blog-update";
import Video from "../../../components/edit-lesson/activities/video";
import AddBlock from "../../../components/edit-lesson/add-block";
import CurrentBlock from "../../../components/edit-lesson/current-block";
import Modal from "../../../components/UI/modal/modal";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import { sortArray } from "../../../utils/sortArray";
import useActivity from "./use-activity";
import ImageActivity from "../../../components/edit-lesson/activities/image/image-activity";

export default function EditLessonHomeOld() {
  const {
    isLoading,
    currentType,
    activities,
    activityToDelete,
    blogEdition,
    handleSubmit,
    handleSelectActivityType,
    handleDeleteActivity,
    handleCancelDeletion,
    handleClickUp,
    handleClickDown,
    success,
  } = useActivity();

  console.log(currentType);

  return (
    <>
      {activities && activities.length > 0 ? (
        <section className="mt-8 flex flex-col items-center gap-y-8">
          <AddBlock onActivityType={handleSelectActivityType} />
          {!currentType ? (
            <ul className="w-full flex flex-col justify-center items-center">
              {sortArray(activities, "order").map((item, index) => (
                <li className="w-full mb-8" key={item.id}>
                  <div className="flex justify-center items-center gap-x-8">
                    <span className="text-primary flex flex-col gap-y-2">
                      <button
                        className="btn btn-primary btn-sm btn-circle rounded-md btn-outline"
                        disabled={index === 0}
                        onClick={() => handleClickUp(item)}
                      >
                        <ChevronUp />
                      </button>
                      <button
                        className="btn btn-primary btn-sm btn-circle rounded-md btn-outline"
                        disabled={index === activities.length - 1}
                        onClick={() => handleClickDown(item)}
                      >
                        <ChevronDown />
                      </button>
                    </span>

                    <div className="w-full flex flex-col gap-y-2">
                      <Wrapper>
                        <span className="flex items-center gap-x-2">
                          <h2 className="font-bold text-md text-primary">
                            Activité n° {index + 1}
                          </h2>
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          ) : null}
                          {success ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : null}
                        </span>
                      </Wrapper>
                      <div className="w-full flex justify-center">
                        {item.type === "text" ? (
                          <BlogUpdate activity={item} />
                        ) : null}
                        {item.type === "video" ? (
                          <Video activity={item} />
                        ) : null}
                        {item.type === "image" ? <ImageActivity /> : null}
                      </div>
                      {!blogEdition ? (
                        <ActionsButtonsGroup activity={item} />
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <CurrentBlock isSubmitting={isLoading} onSubmit={handleSubmit} />
          )}
        </section>
      ) : null}

      {activityToDelete ? (
        <Modal
          onLeftClick={handleCancelDeletion}
          onRightClick={handleDeleteActivity}
          title={`Supprimer l'activité n° ${activityToDelete.order + 1}`}
          isSubmitting={isLoading}
          leftLabel="Annuler"
          rightLabel="Confirmer"
        >
          <p>
            Attention l'activité et les ressources qui lui sont associées seront
            définitivement supprimées.
          </p>
        </Modal>
      ) : null}
    </>
  );
}
