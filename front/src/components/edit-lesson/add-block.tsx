import ActivityTypes from "./activity-types";

export default function AddBlock({
  onActivityType,
}: {
  onActivityType: (activityType: string) => void;
}) {
  return (
    <section className="flex flex-col items-start gap-y-4">
      <ActivityTypes onActivityType={onActivityType} />
    </section>
  );
}
