import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import ActivityListItem from "./activity-list-item";
import type { Activity } from "../../../../../../src/utils/interfaces/activity";
import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import Modal from "../../../../../components/UI/modal/modal";
import { DndWrapper } from "../../../../../components/UI/DndWrapper";

type Props = {
  activities: Activity[];
  setActivities: Dispatch<SetStateAction<Activity[]>>;
  onDeleteActivity: (activityId: number) => void;
  onReorderActivities: (activitiesIds: number[]) => void;
};

export default function DNDAcitivities(props: Props) {
  const [submit, setSubmit] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null,
  );

  const handleReorder = useCallback(() => {
    const activitiesIds = props.activities.map((item) => item.id);
    props.onReorderActivities(activitiesIds);
    setSubmit(false);
  }, [props]);

  const onDragEnd = (sourceIndex: number, destinationIndex: number) => {
    const newActivities = Array.from(props.activities);
    const [movedActivity] = newActivities.splice(sourceIndex, 1);
    newActivities.splice(destinationIndex, 0, movedActivity);
    props.setActivities(newActivities);
    setSubmit(true);
  };

  const deleteActivity = () => {
    props.onDeleteActivity(activityToDelete!.id!);
    setActivityToDelete(null);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submit) {
      timer = setTimeout(() => {
        handleReorder();
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [handleReorder, submit]);

  return (
    <>
      <DndWrapper
        droppableId="activities"
        items={props.activities}
        isLoading={false}
        onDragEnd={onDragEnd}
        getItemId={(activity) => activity.id!}
        renderItem={(activity, index) => (
          <Wrapper>
            <ActivityListItem
              activity={activity}
              index={index}
              onDeleteActivity={() => setActivityToDelete(activity)}
            />
          </Wrapper>
        )}
      />
      {activityToDelete ? (
        <Modal
          onLeftClick={() => setActivityToDelete(null)}
          onRightClick={deleteActivity}
          title="Supprimer une activité"
          isSubmitting={false}
          leftLabel="Annuler"
          rightLabel="Confirmer"
        >
          Attention l'activité et les ressources qui lui sont associées seront
          définitivement supprimées.
        </Modal>
      ) : null}
    </>
  );
}
